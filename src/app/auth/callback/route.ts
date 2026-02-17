import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Determine correct origin on Vercel
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocal = process.env.NODE_ENV === 'development';
  let origin: string;
  if (isLocal) {
    origin = `http://${request.headers.get('host')}`;
  } else if (forwardedHost) {
    origin = `https://${forwardedHost}`;
  } else {
    origin = new URL(request.url).origin;
  }

  // Handle OAuth errors from Supabase
  const errorParam = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  if (errorParam || error_description) {
    const msg = error_description || errorParam || 'OAuth error';
    console.error('OAuth callback error:', msg);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(msg)}`, origin)
    );
  }

  if (code) {
    // Use the official Supabase SSR pattern: setAll must update BOTH
    // request.cookies (so subsequent getAll reads see updates) and
    // the outgoing response cookies (so the browser gets them).
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Exchange succeeded — now create the redirect with session cookies
      const redirectUrl = new URL(next, origin);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // Copy session cookies from the exchange response to the redirect
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });

      // Create profile for first-time OAuth users using service role (bypasses RLS)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const adminClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
              cookies: {
                getAll() { return []; },
                setAll() {},
              },
            }
          );

          const { data: existingUser } = await adminClient
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single();

          if (!existingUser) {
            const { data: org } = await adminClient
              .from('organizations')
              .insert([
                {
                  name: `${user.user_metadata.full_name || user.email}'s Organization`,
                  slug: (user.email?.split('@')[0] || 'user') + '-' + Date.now(),
                  plan: 'free',
                },
              ])
              .select()
              .single();

            if (org) {
              await adminClient.from('users').insert([
                {
                  id: user.id,
                  organization_id: org.id,
                  email: user.email!,
                  full_name:
                    user.user_metadata.full_name ||
                    user.user_metadata.name ||
                    null,
                  avatar_url: user.user_metadata.avatar_url || null,
                  role: 'owner',
                },
              ]);
            }
          }
        }
      } catch (err) {
        console.error('Error creating OAuth user profile:', err);
      }

      return redirectResponse;
    }

    console.error('Code exchange failed:', error.message);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, origin)
    );
  }

  // No code and no error — shouldn't happen, redirect to login
  return NextResponse.redirect(
    new URL('/auth/login?error=No authentication code received', origin)
  );
}
