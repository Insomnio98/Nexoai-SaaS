import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Determine correct origin on Vercel (load balancer rewrites origin)
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

  if (code) {
    // Create redirect response FIRST so we can set cookies directly on it
    const redirectTo = new URL(next, origin);
    const response = NextResponse.redirect(redirectTo);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Create profile for first-time OAuth users
      if (user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingUser) {
          try {
            // @ts-ignore
            const { data: org } = await supabase
              .from('organizations')
              .insert([
                {
                  name: `${user.user_metadata.full_name || user.email}'s Organization`,
                  slug:
                    (user.email?.split('@')[0] || 'user') + '-' + Date.now(),
                  plan: 'free',
                },
              ])
              .select()
              .single();

            if (org) {
              // @ts-ignore
              await supabase.from('users').insert([
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
          } catch (err) {
            console.error('Error creating OAuth user profile:', err);
          }
        }
      }

      // Return the response that already has cookies set on it
      return response;
    }
  }

  return NextResponse.redirect(
    new URL('/auth/login?error=Could not authenticate', origin)
  );
}
