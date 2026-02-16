import { NextResponse } from 'next/server';
import { getUserWithOrganization } from '@/lib/auth';
import { createOrGetCustomer, createCheckoutSession } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { rateLimitMiddleware } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'api');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { user, organization } = await getUserWithOrganization();

    if (!user || !organization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID required' },
        { status: 400 }
      );
    }

    // Create or get Stripe customer
    const customer = await createOrGetCustomer({
      email: user.email!,
      organizationId: organization.id,
      name: organization.name,
    });

    // Update organization with customer ID if not set
    if (!organization.stripe_customer_id) {
      const supabase = await createClient();
      await supabase
        .from('organizations')
        .update({ stripe_customer_id: customer.id })
        .eq('id', organization.id);
    }

    // Create checkout session
    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      organizationId: organization.id,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
