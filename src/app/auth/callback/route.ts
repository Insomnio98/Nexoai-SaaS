import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Will be handled by middleware on next request
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user profile exists, create one for OAuth signups
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

      const redirectUrl = new URL(next, requestUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(
    new URL('/auth/login?error=Could not authenticate', requestUrl.origin)
  );
}
