import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';

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
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Handle cookie setting errors
              console.error('Cookie set error:', error);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              console.error('Cookie remove error:', error);
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if user profile exists in our database
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        // If no profile exists, create one (OAuth signup)
        if (!existingUser) {
          try {
            // Create organization for OAuth user
            // @ts-ignore - Supabase type inference issue
            const { data: org, error: orgError } = await supabase
              .from('organizations')
              .insert([{
                name: `${user.user_metadata.full_name || user.email}'s Organization`,
                slug: (user.email?.split('@')[0] || 'user') + '-' + Date.now(),
                plan: 'free',
              }])
              .select()
              .single();

            if (org && !orgError) {
              // Create user profile
              // @ts-ignore - Supabase type inference issue
              await supabase.from('users').insert([{
                id: user.id,
                organization_id: org.id,
                email: user.email!,
                full_name: user.user_metadata.full_name || user.user_metadata.name || null,
                avatar_url: user.user_metadata.avatar_url || null,
                role: 'owner',
              }]);
            }
          } catch (error) {
            console.error('Error creating user profile:', error);
            // Continue anyway - user is authenticated
          }
        }
      }

      // Redirect with proper headers
      const redirectUrl = new URL(next, requestUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If error, redirect to login with error message
  return NextResponse.redirect(
    new URL('/auth/login?error=Could not authenticate', requestUrl.origin)
  );
}
