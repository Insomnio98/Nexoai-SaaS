# Quick Start Guide - Nexoai

Get Nexoai running in under 15 minutes!

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/command line access

## 🚀 5-Minute Setup

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd nexoai

# Install dependencies
npm install
```

### Step 2: Create Supabase Project (3 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: nexoai-dev
   - **Database Password**: (generate and save it)
   - **Region**: Choose closest to you
4. Wait ~2 minutes for project to initialize
5. Copy your project credentials:
   - Go to Settings → API
   - Copy `URL` and `anon public` key

### Step 3: Environment Variables (2 minutes)

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

For now, leave other variables empty. We'll add them later.

### Step 4: Database Setup (1 minute)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push database schema
supabase db push
```

**Where to find project ref?**
- Supabase Dashboard → Settings → General → Reference ID

### Step 5: Start Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

🎉 **You should see the Nexoai landing page!**

---

## 🔧 Next Steps (Optional but Recommended)

### Enable Authentication (5 minutes)

1. In Supabase Dashboard → Authentication → URL Configuration
2. Add redirect URL: `http://localhost:3000/auth/callback`
3. Test signup at: `http://localhost:3000/auth/signup`

### Set Up Stripe (10 minutes)

1. Create Stripe account: [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy **Publishable key** and **Secret key**
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

5. Set up webhook:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
# or download from: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

6. Copy webhook secret to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Deploy n8n (15 minutes)

**Option 1: Railway (Easiest)**

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy n8n template
3. Set environment variables:
   - `N8N_ENCRYPTION_KEY`: Generate with `openssl rand -hex 32`
4. Deploy and copy your app URL
5. Add to `.env.local`:

```bash
N8N_WEBHOOK_URL=https://your-n8n.up.railway.app
N8N_API_KEY=your-api-key
```

**Option 2: Docker (For Local Development)**

```bash
# Create docker-compose.yml
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Access at: http://localhost:5678
```

6. Import workflows from `n8n/workflows/`

### Test the Full Stack

1. **Create an account**
   - Go to `http://localhost:3000`
   - Click "Get Started"
   - Sign up with email

2. **Check Supabase**
   - Dashboard → Table Editor → users
   - You should see your new user

3. **Test Stripe** (if configured)
   - Go to billing page
   - Try upgrading to Pro plan
   - Use test card: `4242 4242 4242 4242`

4. **Check n8n** (if configured)
   - Open n8n dashboard
   - Check "Executions" tab
   - Should see "user-created" workflow run

---

## 🐛 Troubleshooting

### "Cannot connect to Supabase"

**Solution**: Check `.env.local` has correct URL and key

```bash
# Verify with:
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### "Database schema not found"

**Solution**: Run migrations

```bash
supabase db push
```

### "Stripe webhook signature verification failed"

**Solution**: Make sure webhook secret matches

```bash
# Get fresh secret from:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Build errors

**Solution**: Clear cache and reinstall

```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Port 3000 already in use

**Solution**: Kill existing process or use different port

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

---

## 📚 What to Do Next

### 1. Explore the Code

- [`src/app/page.tsx`](src/app/page.tsx) - Landing page
- [`src/app/api/`](src/app/api/) - API routes
- [`src/lib/`](src/lib/) - Utility functions
- [`supabase/migrations/`](supabase/migrations/) - Database schema

### 2. Read the Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Supabase Setup](supabase/README.md)
- [n8n Workflows](n8n/README.md)
- [Deployment Guide](deployment/README.md)

### 3. Customize for Your Use Case

- Update branding in `src/app/page.tsx`
- Modify pricing plans in `src/lib/stripe/client.ts`
- Add custom workflows in n8n
- Create your dashboard UI

### 4. Deploy to Production

When ready to launch:

1. Deploy to Vercel: `vercel --prod`
2. Set up production Supabase project
3. Configure production Stripe webhooks
4. Deploy n8n to Railway/Render
5. Add custom domain

See [deployment/README.md](deployment/README.md) for full guide.

---

## ✅ Checklist for Production

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Supabase RLS policies tested
- [ ] Stripe webhooks configured
- [ ] n8n workflows activated
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Error monitoring setup (Sentry)
- [ ] Uptime monitoring setup (BetterStack)
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Email templates customized
- [ ] Test all user flows
- [ ] Load testing completed

---

## 🆘 Need Help?

- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **GitHub Issues**: Create an issue
- **Discord**: Join our community
- **Email**: support@nexoai.com

---

## 🎯 Pro Tips

1. **Use Supabase local dev**: `supabase start` for faster iteration
2. **Test webhooks locally**: Use ngrok or Stripe CLI
3. **Monitor logs**: `vercel logs` for production debugging
4. **Database backups**: Run `supabase db dump` regularly
5. **Type safety**: Run `npm run type-check` before commits

---

**Happy building! 🚀**

Need more help? Read the [full documentation](ARCHITECTURE.md) or join our [Discord](https://discord.gg/nexoai).
