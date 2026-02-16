#!/usr/bin/env node

/**
 * Stripe Product Setup Script
 *
 * This script creates all marketplace products in Stripe
 * Run with: node scripts/setup-stripe-products.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function setupStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey || stripeSecretKey === 'sk_test_pending') {
    console.error('❌ Stripe not configured!');
    console.error('\nPlease add your Stripe secret key to .env.local:');
    console.error('STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE\n');
    console.error('Get it from: https://dashboard.stripe.com/test/apikeys');
    process.exit(1);
  }

  const Stripe = require('stripe');
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
  });

  console.log('🎨 Setting up Stripe products...\n');

  const products = [
    { name: 'AI Document Analyzer Pro', price: 49.99, envVar: 'STRIPE_PRICE_ID_DOC_ANALYZER' },
    { name: 'Automation Workflow Pack', price: 99.99, envVar: 'STRIPE_PRICE_ID_WORKFLOW_PACK' },
    { name: 'Social Media AI Assistant', price: 79.99, envVar: 'STRIPE_PRICE_ID_SOCIAL_MEDIA' },
    { name: 'Email Campaign Builder', price: 59.99, envVar: 'STRIPE_PRICE_ID_EMAIL_CAMPAIGN' },
    { name: 'Customer Support Bot', price: 129.99, envVar: 'STRIPE_PRICE_ID_SUPPORT_BOT' },
    { name: 'Data Sync Suite', price: 69.99, envVar: 'STRIPE_PRICE_ID_DATA_SYNC' },
    { name: 'AI Content Generator', price: 89.99, envVar: 'STRIPE_PRICE_ID_CONTENT_GEN' },
    { name: 'Lead Scoring Engine', price: 149.99, envVar: 'STRIPE_PRICE_ID_LEAD_SCORING' },
    { name: 'Voice AI Transcription', price: 39.99, envVar: 'STRIPE_PRICE_ID_VOICE_AI' },
  ];

  const envVars = [];

  try {
    for (const product of products) {
      console.log(`Creating: ${product.name}...`);

      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: `${product.name} - One-time purchase for Nexoai platform`,
        metadata: {
          type: 'marketplace_product',
        },
      });

      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          original_price: product.price.toString(),
        },
      });

      console.log(`  ✅ Product ID: ${stripeProduct.id}`);
      console.log(`  ✅ Price ID: ${price.id}`);
      console.log(`  💰 Amount: $${product.price}\n`);

      envVars.push(`${product.envVar}=${price.id}`);
    }

    console.log('✨ All products created successfully!\n');
    console.log('📋 Add these to your .env.local file:\n');
    console.log('# Stripe Product Price IDs');
    envVars.forEach((envVar) => console.log(envVar));

    console.log('\n\n📝 Also create subscription plans:\n');
    console.log('Run this in Stripe Dashboard or via API:');
    console.log('1. Pro Plan: $29/month (10,000 credits)');
    console.log('2. Enterprise Plan: $99/month (unlimited credits)');

  } catch (error) {
    console.error('❌ Error creating Stripe products:', error.message);
    process.exit(1);
  }
}

setupStripe();
