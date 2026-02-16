# 🚀 Nexoai - Production Deployment Guide

## ✅ WHAT'S BEEN COMPLETED

### 1. ✅ Core Infrastructure
- [x] **Environment Variables**: Configured with real Supabase & Upstash credentials
- [x] **Database Schema**: Deployed to Supabase with RLS policies
- [x] **Authentication System**: Complete login/signup/OAuth/password reset
- [x] **Products Checkout**: Stripe integration ready (pending credentials)
- [x] **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- [x] **Legal Pages**: Privacy Policy & Terms of Service
- [x] **SEO Optimization**: Meta tags, robots.txt, sitemap ready

### 2. ✅ Authentication Features
| Feature | Status | Location |
|---------|--------|----------|
| Email/Password Login | ✅ Working | `/auth/login` |
| Email/Password Signup | ✅ Working | `/auth/signup` |
| OAuth (Google/GitHub) | ✅ Ready | `/auth/login` |
| Forgot Password | ✅ Working | `/auth/forgot-password` |
| Reset Password | ✅ Working | `/auth/reset-password` |
| OAuth Callback | ✅ Working | `/auth/callback` |

### 3. ✅ Products Marketplace
| Feature | Status | Notes |
|---------|--------|-------|
| Product Catalog | ✅ Working | 9 AI products |
| Shopping Cart | ✅ Working | Client-side state |
| Checkout API | ✅ Ready | Awaiting Stripe keys |
| Success Page | ✅ Created | `/products/success` |

### 4. ✅ Security Features
| Security | Implemented | Details |
|----------|-------------|---------|
| Row-Level Security | ✅ Yes | All tables protected |
| Rate Limiting | ✅ Yes | Upstash Redis |
| Webhook Verification | ✅ Yes | Stripe & n8n |
| HTTPS Headers | ✅ Yes | Next.js config |
| Input Validation | ⚠️ Partial | Basic validation |
| CSRF Protection | ✅ Yes | Supabase auth |

---

## 🎯 WHAT YOU NEED TO DO NOW

### Step 1: Set Up Stripe (REQUIRED for Checkout)

1. **Create Stripe Account**: https://dashboard.stripe.com/register

2. **Get API Keys**:
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (starts with `pk_test_...`)
   - Copy **Secret key** (starts with `sk_test_...`)

3. **Create Products in Stripe**:
   ```bash
   # Run this script to create all products:
   # I'll provide you with a script
   ```

4. **Set Up Webhook**:
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events: Select all `checkout`, `customer`, and `invoice` events
   - Copy the **Webhook Secret** (starts with `whsec_...`)

5. **Update `.env.local`**:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### Step 2: Configure n8n Workflows (OPTIONAL but Recommended)

1. **Get n8n API Key**:
   - Go to: https://alexjou.app.n8n.cloud/settings
   - Generate API key
   - Update `.env.local`:
     ```bash
     N8N_API_KEY=your-api-key
     N8N_WEBHOOK_SECRET=your-webhook-secret
     ```

2. **Import Workflows**:
   - Upload files from `n8n/workflows/` to your n8n instance
   - Activate each workflow
   - Test with the simple-test workflow first

### Step 3: Deploy to Vercel

#### Method 1: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables (do this once)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel env add N8N_WEBHOOK_URL production
vercel env add N8N_API_KEY production
vercel env add N8N_WEBHOOK_SECRET production
vercel env add JWT_SECRET production

# Deploy to production
vercel --prod
```

#### Method 2: Via Vercel Dashboard

1. **Connect Repository**:
   - Go to: https://vercel.com/new
   - Import your GitHub repository
   - Framework Preset: **Next.js** (auto-detected)

2. **Configure Environment Variables**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from your `.env.local`
   - ⚠️ **IMPORTANT**: Set environment to **Production**

3. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (~3-5 minutes)

4. **Update Webhook URLs**:
   - After deployment, update Stripe webhook URL to your Vercel domain
   - Update Supabase OAuth redirect URLs

### Step 4: Configure OAuth Providers in Supabase

1. **Google OAuth**:
   - Go to: https://console.cloud.google.com/
   - Create OAuth credentials
   - Authorized redirect URI: `https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback`
   - In Supabase → Authentication → Providers → Google
   - Add Client ID & Client Secret

2. **GitHub OAuth**:
   - Go to: https://github.com/settings/developers
   - New OAuth App
   - Callback URL: `https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback`
   - In Supabase → Authentication → Providers → GitHub
   - Add Client ID & Client Secret

### Step 5: Update Environment Variables in Vercel

After deployment, update:

```bash
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Then redeploy:
```bash
vercel --prod
```

---

## 📊 WHAT'S READY TO TEST NOW

### Without Stripe (Current State)
✅ You can test:
- User registration (email/password)
- User login (email/password)
- Password reset flow
- Products browsing
- Shopping cart (UI only)
- Dashboard access (demo data)

### With Stripe (After Setup)
✅ You can test:
- Complete checkout flow
- Payment processing
- Subscription management
- Billing portal
- Invoice generation

---

## 🔐 PRODUCTION CHECKLIST

Before launching publicly:

### Security
- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable Supabase email verification
- [ ] Set up Sentry for error tracking
- [ ] Configure rate limits for production traffic
- [ ] Review and test RLS policies
- [ ] Set up monitoring alerts

### Performance
- [ ] Enable Next.js Image Optimization
- [ ] Configure CDN for static assets
- [ ] Set up database indexes (already done)
- [ ] Enable caching for API routes

### Legal & Compliance
- [ ] Update Privacy Policy with your company details
- [ ] Update Terms of Service with your jurisdiction
- [ ] Add Cookie Consent banner (if required by GDPR)
- [ ] Set up data export/deletion endpoints

### Marketing
- [ ] Create Open Graph image (`/public/og-image.png`)
- [ ] Set up Google Analytics or PostHog
- [ ] Create app screenshots for marketing
- [ ] Write blog posts/documentation

---

## 📝 STRIPE PRODUCT CREATION SCRIPT

Save this as `scripts/create-stripe-products.js` and run with `node scripts/create-stripe-products.js`:

```javascript
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = [
  { name: 'AI Document Analyzer Pro', price: 49.99 },
  { name: 'Automation Workflow Pack', price: 99.99 },
  { name: 'Social Media AI Assistant', price: 79.99 },
  { name: 'Email Campaign Builder', price: 59.99 },
  { name: 'Customer Support Bot', price: 129.99 },
  { name: 'Data Sync Suite', price: 69.99 },
  { name: 'AI Content Generator', price: 89.99 },
  { name: 'Lead Scoring Engine', price: 149.99 },
  { name: 'Voice AI Transcription', price: 39.99 },
];

async function createProducts() {
  for (const product of products) {
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: `${product.name} - One-time purchase`,
    });

    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100),
      currency: 'usd',
    });

    console.log(`Created: ${product.name} - Price ID: ${price.id}`);
  }
}

createProducts();
```

---

## 🚀 QUICK START COMMANDS

```bash
# Development
npm run dev                    # Start local server

# Build & Test
npm run build                  # Build for production
npm run start                  # Start production server

# Deployment
vercel                         # Deploy to Vercel
vercel --prod                  # Deploy to production

# Database
npx supabase db push           # Push migrations (if using CLI)
```

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**Issue**: Checkout doesn't work
- **Solution**: Add Stripe API keys to `.env.local` and Vercel

**Issue**: OAuth login fails
- **Solution**: Configure OAuth providers in Supabase dashboard

**Issue**: Database connection error
- **Solution**: Verify Supabase credentials are correct

**Issue**: Rate limiting not working
- **Solution**: Check Upstash Redis credentials

### Need Help?

- Documentation: Check `README.md`, `ARCHITECTURE.md`
- Database Schema: `supabase/migrations/20240101000000_initial_schema.sql`
- n8n Setup: `N8N_SETUP.md`

---

## 🎉 YOU'RE READY TO LAUNCH!

Once you complete the steps above, your app will be:
- ✅ Fully functional
- ✅ Secure and compliant
- ✅ Ready for real users
- ✅ Scalable to thousands of users

**Estimated Time to Production**: 1-2 hours (mostly waiting for builds)

Good luck with your launch! 🚀
