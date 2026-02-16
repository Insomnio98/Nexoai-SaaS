# Nexoai - AI-Powered SaaS Architecture

## 🎯 Core Principles

1. **Automation-First**: Business logic lives in n8n workflows, not application code
2. **Thin Backend**: Next.js API routes are orchestrators, not processors
3. **Cost Optimization**: Local/low-cost AI, serverless execution, pay-per-use
4. **Security by Design**: Webhook verification, tenant isolation, secret management
5. **Scale Without Rewrite**: Stateless architecture, event-driven, horizontal scaling

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│                  Next.js 14 + Tailwind CSS                   │
│              (Vercel Edge Functions + SSR/ISR)               │
└─────────────────┬───────────────────────────┬────────────────┘
                  │                           │
                  ▼                           ▼
┌─────────────────────────────┐  ┌──────────────────────────┐
│   Supabase Auth + RLS       │  │   Next.js API Routes     │
│   - JWT tokens              │  │   - Orchestration only   │
│   - Role-based access       │  │   - Webhook handlers     │
│   - Tenant isolation        │  │   - Event triggers       │
└─────────────────────────────┘  └──────────┬───────────────┘
                                             │
                  ┌──────────────────────────┼──────────────┐
                  ▼                          ▼              ▼
     ┌────────────────────┐    ┌─────────────────┐  ┌────────────┐
     │  Supabase DB       │    │  n8n Workflows  │  │   Stripe   │
     │  - PostgreSQL      │◄───│  - Business     │  │  - Billing │
     │  - Realtime        │    │    Logic        │  │  - Webhooks│
     │  - Storage         │    │  - AI Tasks     │  │  - Usage   │
     └────────────────────┘    │  - Background   │  └────────────┘
                               │    Jobs         │
                               │  - Webhooks     │
                               └─────────────────┘
                                       │
                               ┌───────┴────────┐
                               ▼                ▼
                    ┌──────────────┐  ┌─────────────────┐
                    │  Local AI    │  │  External APIs  │
                    │  - Ollama    │  │  - OpenAI       │
                    │  - Whisper   │  │  - Anthropic    │
                    └──────────────┘  └─────────────────┘
```

---

## 🚀 MVP Setup

### Phase 1: Foundation (Week 1)
✅ Next.js 14 app with TypeScript
✅ Supabase project setup (database, auth, storage)
✅ Basic UI with Tailwind + shadcn/ui
✅ Authentication flow (sign up, login, logout)
✅ Tenant isolation via RLS policies

### Phase 2: Automation Core (Week 2)
✅ n8n self-hosted instance
✅ Webhook endpoints in Next.js → n8n
✅ First workflow: User onboarding automation
✅ Background job processing
✅ Event-driven architecture

### Phase 3: Monetization (Week 3)
✅ Stripe integration (subscriptions + usage-based)
✅ Webhook handlers for payment events
✅ Usage tracking system
✅ Plan-based feature gating

### Phase 4: Production Ready (Week 4)
✅ Security hardening (rate limiting, CORS, CSP)
✅ Monitoring and logging
✅ CI/CD pipeline (GitHub Actions + Vercel)
✅ Documentation and runbooks

---

## 🤖 Automation-First Design Decisions

### Why n8n Handles Business Logic

**Traditional Approach (Bad)**:
```typescript
// ❌ Business logic in API routes - hard to change, redeploy needed
export async function POST(req: Request) {
  const user = await createUser(data);
  await sendWelcomeEmail(user.email);
  await createTrialSubscription(user.id);
  await notifySlack(user);
  await enrichUserData(user);
  return Response.json(user);
}
```

**Automation-First Approach (Good)**:
```typescript
// ✅ Orchestration only - business logic in n8n
export async function POST(req: Request) {
  const user = await supabase.from('users').insert(data);

  // Trigger n8n workflow
  await triggerWorkflow('user.created', { userId: user.id });

  return Response.json(user);
}
```

**Benefits**:
- Change workflows without code deployment
- Non-technical users can modify logic
- A/B test different automation flows
- Visual debugging and monitoring
- Reuse workflows across different triggers

### Workflow Categories

1. **User Lifecycle**: onboarding, offboarding, upgrades
2. **AI Processing**: document analysis, content generation, summarization
3. **Integration Sync**: CRM, analytics, third-party tools
4. **Background Jobs**: cleanup, reporting, email campaigns
5. **Webhook Handlers**: Stripe, external webhooks

---

## 💰 Cost Optimization Strategy

### AI Usage Tiers

```javascript
const AI_STRATEGY = {
  development: {
    model: 'ollama/llama3.1',
    cost: '$0/month',
    latency: 'medium',
  },
  production_light: {
    model: 'groq/llama3-70b', // Free tier
    cost: '$0-50/month',
    latency: 'low',
  },
  production_advanced: {
    model: 'anthropic/claude-3-5-haiku', // Cheapest Claude
    cost: '$50-200/month',
    latency: 'low',
    useCase: 'complex reasoning only',
  },
  production_premium: {
    model: 'anthropic/claude-3-5-sonnet',
    cost: 'usage-based',
    latency: 'low',
    useCase: 'user-facing, billable features',
  },
};
```

### Infrastructure Costs (MVP)

- **Vercel**: $20/month (Pro plan for team features)
- **Supabase**: $25/month (Pro plan - includes 8GB database)
- **n8n**: $0 (self-hosted on Render/Railway - $5/month container)
- **Stripe**: 2.9% + $0.30 per transaction
- **AI**: $0-50/month (Groq/Ollama)
- **Total**: ~$50-100/month for MVP

---

## 📊 Data Architecture

### Supabase Tables

```sql
-- Multi-tenancy with RLS
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  usage_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users belong to organizations
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  role TEXT DEFAULT 'member',
  email TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking for billing
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow execution logs
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  workflow_name TEXT NOT NULL,
  status TEXT DEFAULT 'running',
  input JSONB,
  output JSONB,
  error TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view organization data"
  ON usage_events FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));
```

---

## 🔐 Security Architecture

### 1. Authentication & Authorization

```typescript
// Supabase Auth with RLS
// - JWT tokens signed by Supabase
// - Row-level security on all tables
// - Tenant isolation enforced at database level

const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
```

### 2. Webhook Security

```typescript
// Stripe webhook verification
const signature = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);

// n8n webhook verification
const n8nSignature = req.headers['x-n8n-signature'];
const isValid = verifyN8nSignature(body, n8nSignature);
```

### 3. Secrets Management

```bash
# .env.local (never commit)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Server-side only
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
N8N_WEBHOOK_URL=
N8N_API_KEY=
```

### 4. Rate Limiting

```typescript
// Upstash Redis for rate limiting
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});
```

---

## 📈 Scaling Strategy

### Horizontal Scaling (No Code Changes)

1. **Frontend**: Vercel automatically scales Edge Functions
2. **Database**: Supabase connection pooling + read replicas
3. **n8n**: Scale to multiple instances with Redis queue
4. **Storage**: Supabase Storage with CDN (Cloudflare)

### When to Scale Components

| Monthly Users | Architecture |
|---------------|-------------|
| 0-1K | Single n8n instance, Supabase free tier |
| 1K-10K | Supabase Pro, dedicated n8n container |
| 10K-100K | n8n queue mode (multiple workers), Supabase Team |
| 100K-1M | n8n cluster, Supabase Enterprise, separate AI service |

### Preventing Rewrites

**Do This From Day 1**:
- Event-driven architecture (no tight coupling)
- Stateless API routes (no in-memory sessions)
- Database migrations via Supabase CLI
- Feature flags for gradual rollouts
- Monitoring and observability built-in

**Avoid**:
- Monolithic API routes
- Direct database queries in components
- Hard-coded configuration
- Tight coupling between services

---

## 🔄 Example Workflows

### 1. User Onboarding
```
Trigger: User signs up
→ Create Stripe customer
→ Send welcome email
→ Create sample data
→ Track analytics event
→ Assign to sales team (if high-value)
```

### 2. AI Document Processing
```
Trigger: File uploaded to Supabase Storage
→ Download file
→ Extract text (local AI)
→ Summarize content (Groq API)
→ Store in database
→ Notify user
→ Track usage credits
```

### 3. Subscription Webhook
```
Trigger: Stripe webhook received
→ Verify signature
→ Update database
→ Send confirmation email
→ Update feature access
→ Log usage event
```

---

## 🎯 Production Checklist

- [ ] Environment variables in Vercel
- [ ] Supabase RLS policies tested
- [ ] Stripe webhook endpoint verified
- [ ] n8n workflows backed up
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (BetterStack)
- [ ] Database backups automated
- [ ] GDPR compliance (data export/delete)
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] SSL/TLS enforced
- [ ] DDoS protection (Cloudflare)

---

## 📚 Technology Decisions

### Why These Technologies?

| Tech | Reason | Alternative Considered |
|------|--------|----------------------|
| Next.js 14 | Best React framework, Vercel integration, Server Components | Remix, Astro |
| Supabase | PostgreSQL + Auth + Storage + Realtime in one | Firebase, PlanetScale |
| n8n | Open source, self-hosted, visual workflows | Zapier (expensive), Temporal (complex) |
| Stripe | Industry standard, excellent docs | Paddle, LemonSqueezy |
| Vercel | Zero-config Next.js deployment, edge network | Netlify, Cloudflare Pages |
| Tailwind | Utility-first, fast development | CSS Modules, Emotion |

---

## 🚦 Getting Started

```bash
# 1. Clone and install
git clone <repo>
cd nexoai
npm install

# 2. Set up Supabase
# - Create project at supabase.com
# - Run migrations: npx supabase db push
# - Copy .env.example to .env.local

# 3. Set up Stripe
# - Create account at stripe.com
# - Copy API keys to .env.local
# - Set up webhook endpoint

# 4. Set up n8n
# - Deploy to Render/Railway (see n8n/README.md)
# - Import workflows from n8n/workflows/
# - Configure webhook URLs

# 5. Run locally
npm run dev

# 6. Deploy to Vercel
vercel --prod
```

---

## 📖 Next Steps

1. **Review Files**: Check all generated files in project structure
2. **Supabase Setup**: Follow [supabase/README.md](supabase/README.md)
3. **n8n Setup**: Follow [n8n/README.md](n8n/README.md)
4. **Deploy**: Follow [deployment/README.md](deployment/README.md)
5. **Customize**: Modify workflows and UI for your use case

---

**Built with ❤️ for lean, automated SaaS operations**
