import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimitMiddleware } from '@/lib/rate-limit';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export async function POST(request: Request) {
  // Rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'api');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request data
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid product IDs' },
        { status: 400 }
      );
    }

    // Product catalog (same as in products page)
    const productCatalog = [
      {
        id: 1,
        name: 'AI Document Analyzer Pro',
        price: 49.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_DOC_ANALYZER,
      },
      {
        id: 2,
        name: 'Automation Workflow Pack',
        price: 99.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_WORKFLOW_PACK,
      },
      {
        id: 3,
        name: 'Social Media AI Assistant',
        price: 79.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_SOCIAL_MEDIA,
      },
      {
        id: 4,
        name: 'Email Campaign Builder',
        price: 59.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_EMAIL_CAMPAIGN,
      },
      {
        id: 5,
        name: 'Customer Support Bot',
        price: 129.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_SUPPORT_BOT,
      },
      {
        id: 6,
        name: 'Data Sync Suite',
        price: 69.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_DATA_SYNC,
      },
      {
        id: 7,
        name: 'AI Content Generator',
        price: 89.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_CONTENT_GEN,
      },
      {
        id: 8,
        name: 'Lead Scoring Engine',
        price: 149.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_LEAD_SCORING,
      },
      {
        id: 9,
        name: 'Voice AI Transcription',
        price: 39.99,
        stripePriceId: process.env.STRIPE_PRICE_ID_VOICE_AI,
      },
    ];

    // Get selected products
    const selectedProducts = productCatalog.filter((p) =>
      productIds.includes(p.id)
    );

    if (selectedProducts.length === 0) {
      return NextResponse.json(
        { error: 'No valid products found' },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: 'Payment system not configured',
          message:
            'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.',
          products: selectedProducts,
          totalAmount: selectedProducts.reduce((sum, p) => sum + p.price, 0),
        },
        { status: 503 }
      );
    }

    // Get user's organization
    const { data: userData } = await supabase
      .from('users')
      .select('organization_id, organizations(*)')
      .eq('id', user.id)
      .single();

    let customerId = userData?.organizations?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          user_id: user.id,
          organization_id: userData?.organization_id || '',
        },
      });

      customerId = customer.id;

      // Update organization with customer ID
      if (userData?.organization_id) {
        await supabase
          .from('organizations')
          .update({ stripe_customer_id: customerId })
          .eq('id', userData.organization_id);
      }
    }

    // Create line items for Stripe
    const lineItems = selectedProducts.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products?canceled=true`,
      metadata: {
        user_id: user.id,
        organization_id: userData?.organization_id || '',
        product_ids: productIds.join(','),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
