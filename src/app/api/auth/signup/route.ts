import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { workflows } from '@/lib/n8n/client';
import { rateLimitMiddleware } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'auth');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email, password, fullName, organizationName } = await request.json();

    const supabase = await createClient();

    // Create user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 }
      );
    }

    // Create organization
    // @ts-ignore - Supabase type inference issue
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert([{
        name: organizationName || `${fullName}'s Organization`,
        slug: email.split('@')[0] + '-' + Date.now(),
        plan: 'free',
      }])
      .select()
      .single();

    if (orgError || !org) {
      console.error('Failed to create organization:', orgError);
      // Continue anyway - user can create org later
    }

    // Link user to organization
    if (org) {
      // @ts-ignore - Supabase type inference issue
      await supabase.from('users').insert([{
        id: authData.user.id,
        organization_id: org.id,
        email: authData.user.email!,
        full_name: fullName,
        role: 'owner',
      }]);
    }

    // Trigger onboarding workflow in n8n
    if (org) {
      workflows.userCreated(authData.user.id, email);
      workflows.organizationCreated(org.id, 'free');
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      organization: org,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
