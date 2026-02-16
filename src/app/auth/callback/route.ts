import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();

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
          // Create organization for OAuth user
          const { data: org } = await supabase
            .from('organizations')
            .insert({
              name: `${user.user_metadata.full_name || user.email}'s Organization`,
              slug: (user.email?.split('@')[0] || 'user') + '-' + Date.now(),
              plan: 'free',
            })
            .select()
            .single();

          if (org) {
            // Create user profile
            await supabase.from('users').insert({
              id: user.id,
              organization_id: org.id,
              email: user.email!,
              full_name: user.user_metadata.full_name || user.user_metadata.name || null,
              avatar_url: user.user_metadata.avatar_url || null,
              role: 'owner',
            });
          }
        }
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // If error, redirect to login with error message
  return NextResponse.redirect(
    new URL('/auth/login?error=Could not authenticate', requestUrl.origin)
  );
}
