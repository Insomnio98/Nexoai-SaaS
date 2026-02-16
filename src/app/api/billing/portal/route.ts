import { NextResponse } from 'next/server';
import { getUserWithOrganization } from '@/lib/auth';
import { createPortalSession } from '@/lib/stripe/client';
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

    if (!organization.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      );
    }

    const session = await createPortalSession({
      customerId: organization.stripe_customer_id,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
