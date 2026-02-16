# Deployment Guide

## Prerequisites

- [ ] GitHub repository created
- [ ] Vercel account
- [ ] Supabase project created
- [ ] Stripe account
- [ ] n8n instance deployed
- [ ] Domain name (optional)

## 1. Vercel Setup

### Create Vercel Project

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### Configure Environment Variables

Go to Project Settings → Environment Variables and add:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# n8n
N8N_WEBHOOK_URL=https://your-n8n.railway.app
N8N_API_KEY=your-n8n-api-key
N8N_WEBHOOK_SECRET=your-shared-secret

# Optional
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
ANTHROPIC_API_KEY=sk-ant-your-key
GROQ_API_KEY=gsk_your-key
```

**Important**: Set environment variables for all environments:
- Production
- Preview
- Development

### Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 2. Custom Domain (Optional)

### Add Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `app.nexoai.com`)
3. Configure DNS records:

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (~5-10 minutes)
5. SSL certificate is automatically provisioned

### Update Environment Variables

```bash
NEXT_PUBLIC_APP_URL=https://app.nexoai.com
```

## 3. Configure Stripe Webhooks

### Production Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret
5. Add to Vercel env vars: `STRIPE_WEBHOOK_SECRET`

### Test Webhook

```bash
# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Or test production endpoint
stripe trigger checkout.session.completed
```

## 4. Configure Supabase

### Update Auth URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/**` (wildcard)

### Update CORS

Go to Dashboard → Settings → API:

```json
{
  "allowed_origins": [
    "https://your-app.vercel.app",
    "https://your-custom-domain.com"
  ]
}
```

### Connection Pooling (Production)

Enable connection pooling for better performance:

1. Dashboard → Settings → Database
2. Enable "Connection Pooler"
3. Use pooler URL in production:

```bash
DATABASE_URL=postgresql://postgres.xxxxx:6543/postgres
```

## 5. Setup n8n Production Webhooks

Update n8n workflows with production URLs:

1. Open each workflow in n8n
2. Update HTTP Request nodes:
   - URL: `https://your-app.vercel.app/api/webhooks/n8n`
   - Header: `x-n8n-signature: <your-secret>`
3. Save and activate

## 6. GitHub Actions Setup

### Add Secrets to GitHub

Go to Repository Settings → Secrets and variables → Actions:

```bash
# Vercel
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>

# Supabase
SUPABASE_ACCESS_TOKEN=<your-access-token>
SUPABASE_PROJECT_REF=<your-project-ref>
```

### Get Vercel Tokens

```bash
# Install Vercel CLI
npm i -g vercel

# Get org and project IDs
vercel link

# Copy .vercel/project.json values
cat .vercel/project.json
```

### Get Supabase Token

1. Go to Supabase Dashboard → Account → Access Tokens
2. Create new token
3. Copy and add to GitHub Secrets

## 7. Monitoring Setup (Optional)

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

Add to Vercel env vars:
```bash
NEXT_PUBLIC_SENTRY_DSN=your-dsn
```

### BetterStack (Uptime Monitoring)

1. Go to [BetterStack](https://betterstack.com)
2. Add monitor: `https://your-app.vercel.app/api/health`
3. Set check interval: 1 minute
4. Add alert channels (email, Slack)

### PostHog (Analytics)

```bash
npm install posthog-js
```

Add to Vercel env vars:
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## 8. Production Checklist

### Security
- [ ] All secrets in Vercel environment variables
- [ ] Stripe webhook signature verification working
- [ ] n8n webhook signature verification working
- [ ] RLS policies enabled on all Supabase tables
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (Upstash Redis)
- [ ] Security headers configured
- [ ] SSL/TLS enforced

### Functionality
- [ ] Authentication flow works
- [ ] Stripe checkout works
- [ ] Stripe customer portal works
- [ ] Webhook handlers tested
- [ ] n8n workflows activated
- [ ] Email delivery working
- [ ] File upload working (Supabase Storage)

### Performance
- [ ] Build succeeds without errors
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] Database indexes created
- [ ] Connection pooling enabled

### Monitoring
- [ ] Error tracking setup (Sentry)
- [ ] Uptime monitoring (BetterStack)
- [ ] Analytics tracking (PostHog)
- [ ] Log aggregation configured
- [ ] Alerts configured

### Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent (if EU traffic)
- [ ] GDPR compliance (data export/delete)
- [ ] Stripe billing compliance

## 9. Deployment Workflow

### Development → Staging → Production

```bash
# Feature branch
git checkout -b feature/my-feature
# ... make changes ...
git push origin feature/my-feature

# Create PR → triggers preview deployment

# Merge to develop → triggers staging deployment
git checkout develop
git merge feature/my-feature
git push origin develop

# Merge to main → triggers production deployment
git checkout main
git merge develop
git push origin main
```

### Rollback Strategy

```bash
# Revert to previous deployment
vercel rollback

# Or redeploy specific commit
git revert HEAD
git push origin main
```

## 10. Cost Breakdown (Production)

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| n8n (Railway) | Starter | $5 |
| Upstash Redis | Pay-as-you-go | $0-10 |
| Stripe | Transaction fees | 2.9% + $0.30 |
| Domain | Varies | $10-15 |
| **Total** | | **~$60-75/month** |

### Scaling Costs

| Users | Vercel | Supabase | n8n | Total |
|-------|--------|----------|-----|-------|
| 0-1K | $20 | $25 | $5 | $50 |
| 1K-10K | $20 | $25 | $10 | $55 |
| 10K-100K | $20 | $100 | $20 | $140 |
| 100K+ | $20 | $599 | $50+ | $669+ |

## 11. Post-Deployment Tasks

### Week 1
- [ ] Monitor error rates
- [ ] Check webhook delivery
- [ ] Test all critical paths
- [ ] Verify emails are delivered
- [ ] Monitor database performance

### Week 2-4
- [ ] Review analytics data
- [ ] Optimize slow queries
- [ ] Fine-tune rate limits
- [ ] A/B test onboarding
- [ ] Collect user feedback

### Ongoing
- [ ] Weekly database backups
- [ ] Monthly security audits
- [ ] Quarterly dependency updates
- [ ] Review and optimize costs

## 12. Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
vercel --force

# Check build logs
vercel logs <deployment-url>
```

### Environment Variables Not Working

- Redeploy after changing env vars
- Check variable names (case-sensitive)
- Verify all environments have vars

### Webhook Failures

- Check webhook signature
- Verify endpoint is accessible
- Check rate limiting
- Review logs in Vercel

### Database Connection Issues

- Use connection pooler
- Check connection limits
- Verify RLS policies
- Review Supabase logs

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## Support

- Create issues in GitHub repo
- Join Discord community
- Email: support@nexoai.com
