import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/client';
import { createServiceClient } from '@/lib/supabase/server';
import { workflows } from '@/lib/n8n/client';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId;

        if (organizationId && session.subscription) {
          // Update organization with Stripe IDs
          await supabase
            .from('organizations')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', organizationId);

          // Trigger workflow
          workflows.paymentSucceeded(
            organizationId,
            session.amount_total || 0,
            session.id
          );
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        // Find organization by subscription ID
        const { data: org } = await supabase
          .from('organizations')
          .select('id, plan')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (org) {
          // Determine new plan based on subscription
          let newPlan: 'free' | 'pro' | 'enterprise' = 'free';
          if (subscription.status === 'active') {
            // Logic to determine plan based on price ID
            const priceId = subscription.items.data[0]?.price.id;
            if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
              newPlan = 'pro';
            } else if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) {
              newPlan = 'enterprise';
            }
          }

          // Update organization plan
          await supabase
            .from('organizations')
            .update({ plan: newPlan })
            .eq('id', org.id);

          // Trigger workflow if plan changed
          if (newPlan !== org.plan) {
            workflows.planUpgraded(org.id, org.plan, newPlan);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Downgrade to free plan
        await supabase
          .from('organizations')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        const { data: org } = await supabase
          .from('organizations')
          .select('id')
          .eq('stripe_customer_id', invoice.customer as string)
          .single();

        if (org) {
          workflows.paymentSucceeded(
            org.id,
            invoice.amount_paid,
            invoice.id
          );
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        const { data: org } = await supabase
          .from('organizations')
          .select('id')
          .eq('stripe_customer_id', invoice.customer as string)
          .single();

        if (org) {
          workflows.paymentFailed(
            org.id,
            invoice.last_finalization_error?.message || 'Payment failed'
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
