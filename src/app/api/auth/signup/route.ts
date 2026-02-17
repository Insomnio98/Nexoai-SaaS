import { createServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { rateLimitMiddleware } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'auth');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email, password, fullName, organizationName } = await request.json();

    // Use service role to create user (auto-confirms email so they can log in immediately)
    const adminClient = createServiceClient();

    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      });

    if (authError) {
      if (authError.message?.includes('already been registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in.' },
          { status: 409 }
        );
      }
      console.error('Signup auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 }
      );
    }

    // Create organization using service role (bypasses RLS)
    const { data: org, error: orgError } = await adminClient
      .from('organizations')
      .insert([
        {
          name: organizationName || `${fullName}'s Organization`,
          slug: email.split('@')[0] + '-' + Date.now(),
          plan: 'free',
        },
      ])
      .select()
      .single();

    if (orgError) {
      console.error('Failed to create organization:', orgError);
    }

    // Link user to organization
    if (org) {
      const { error: userInsertError } = await adminClient
        .from('users')
        .insert([
          {
            id: authData.user.id,
            organization_id: org.id,
            email: authData.user.email!,
            full_name: fullName,
            role: 'owner',
          },
        ]);

      if (userInsertError) {
        console.error('Failed to link user to org:', userInsertError);
      }
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user.id, email: authData.user.email },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
