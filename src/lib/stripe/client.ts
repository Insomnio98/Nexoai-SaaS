import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

/**
 * Subscription plans configuration
 */
export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 1000,
    features: [
      '1,000 credits/month',
      'Basic AI features',
      'Community support',
    ],
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRICE_ID_PRO,
    credits: 10000,
    features: [
      '10,000 credits/month',
      'Advanced AI features',
      'Priority support',
      'Custom workflows',
    ],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    credits: 50000,
    features: [
      '50,000 credits/month',
      'All AI features',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;

/**
 * Create or retrieve a Stripe customer
 */
export async function createOrGetCustomer(params: {
  email: string;
  organizationId: string;
  name?: string;
}): Promise<Stripe.Customer> {
  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email: params.email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      organizationId: params.organizationId,
    },
  });
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  organizationId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      organizationId: params.organizationId,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  });
}

/**
 * Create a customer portal session
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

/**
 * Track usage for metered billing
 */
export async function recordUsage(params: {
  subscriptionItemId: string;
  quantity: number;
  timestamp?: number;
}): Promise<Stripe.UsageRecord> {
  return stripe.subscriptionItems.createUsageRecord(
    params.subscriptionItemId,
    {
      quantity: params.quantity,
      timestamp: params.timestamp || Math.floor(Date.now() / 1000),
      action: 'increment',
    }
  );
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Update subscription
 */
export async function updateSubscription(params: {
  subscriptionId: string;
  priceId: string;
}): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(
    params.subscriptionId
  );

  return stripe.subscriptions.update(params.subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: params.priceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}
