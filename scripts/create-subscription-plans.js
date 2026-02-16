#!/usr/bin/env node

/**
 * Create Subscription Plans in Stripe
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

async function createSubscriptionPlans() {
  console.log('🎨 Creating Subscription Plans in Stripe...\n');

  const plans = [
    {
      name: 'Free Plan',
      price: 0,
      interval: 'month',
      credits: 1000,
      features: [
        '1,000 credits/month',
        'Basic workflows',
        'Email support',
        'Community access'
      ]
    },
    {
      name: 'Pro Plan',
      price: 29,
      interval: 'month',
      credits: 10000,
      features: [
        '10,000 credits/month',
        'Advanced workflows',
        'Priority support',
        'Custom integrations',
        'Analytics dashboard'
      ]
    },
    {
      name: 'Enterprise Plan',
      price: 99,
      interval: 'month',
      credits: -1, // unlimited
      features: [
        'Unlimited credits',
        'Custom workflows',
        'Dedicated support',
        'SLA guarantee',
        'Advanced analytics',
        'White-label option'
      ]
    }
  ];

  const priceIds = {};

  for (const plan of plans) {
    console.log(`Creating: ${plan.name}...`);

    // Create product
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.features.join(' • '),
      metadata: {
        type: 'subscription',
        credits: plan.credits.toString(),
      },
    });

    console.log(`  ✅ Product ID: ${product.id}`);

    if (plan.price > 0) {
      // Create price for paid plans
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price * 100,
        currency: 'usd',
        recurring: {
          interval: plan.interval,
        },
        metadata: {
          credits: plan.credits.toString(),
        },
      });

      console.log(`  ✅ Price ID: ${price.id}`);
      console.log(`  💰 Amount: $${plan.price}/${plan.interval}\n`);

      if (plan.name.includes('Pro')) {
        priceIds['STRIPE_PRICE_ID_PRO'] = price.id;
      } else if (plan.name.includes('Enterprise')) {
        priceIds['STRIPE_PRICE_ID_ENTERPRISE'] = price.id;
      }
    } else {
      console.log(`  ℹ️  Free plan - no price needed\n`);
      priceIds['STRIPE_PRICE_ID_FREE'] = 'price_free';
    }
  }

  console.log('✨ All subscription plans created!\n');
  console.log('📋 Add these to your .env.local:\n');
  Object.entries(priceIds).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
}

createSubscriptionPlans().catch(console.error);
