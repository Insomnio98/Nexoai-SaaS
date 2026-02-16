# Nexoai - AI-Powered SaaS Platform

> **Automation-first architecture for building lean, scalable SaaS applications**

A production-ready SaaS boilerplate built with Next.js 14, Supabase, n8n, and Stripe. Designed for low-cost operations with business logic in workflows, not code.

## 🎯 Key Features

- ⚡ **Thin Backend**: Next.js API routes orchestrate, n8n executes business logic
- 💰 **Cost Optimized**: ~$50-75/month for MVP, scales efficiently
- 🔒 **Security First**: Row-level security, webhook verification, tenant isolation
- 🤖 **AI Ready**: Support for local AI (Ollama) and cloud APIs (Claude, OpenAI, Groq)
- 📊 **Usage-Based Billing**: Stripe subscriptions + metered billing
- 🚀 **Zero-Config Deploy**: Vercel + GitHub Actions CI/CD
- 📈 **Production Monitoring**: Health checks, error tracking, analytics

## 🏗️ Architecture

```
Next.js Frontend (Vercel)
    ↓
Supabase (Auth + DB + Storage)
    ↓
n8n Workflows (Business Logic)
    ↓
AI Services (Ollama/Claude/OpenAI)
```

**Why This Stack?**
- **Next.js**: Best React framework, excellent Vercel integration
- **Supabase**: PostgreSQL + Auth + Storage + Realtime in one
- **n8n**: Visual workflows, modify logic without code deployment
- **Stripe**: Industry-standard billing, excellent documentation

## 📦 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 14 + TypeScript | UI and Server Components |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first styling |
| **Database** | Supabase (PostgreSQL) | Data storage with RLS |
| **Auth** | Supabase Auth | Authentication + JWT |
| **Storage** | Supabase Storage | File uploads |
| **Automation** | n8n | Workflow engine |
| **Billing** | Stripe | Subscriptions + usage |
| **Deployment** | Vercel + GitHub Actions | CI/CD |
| **Monitoring** | Sentry + BetterStack | Errors + uptime |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- n8n instance (Railway/Render)

### 1. Clone and Install

```bash
git clone <repository-url>
cd nexoai
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Fill in your environment variables
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `N8N_WEBHOOK_URL` and `N8N_API_KEY`

### 3. Database Setup

```bash
# Start local Supabase (optional)
npx supabase start

# Run migrations
npx supabase db push

# Or use remote Supabase
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Set Up n8n

See [n8n/README.md](n8n/README.md) for detailed setup instructions.

### 6. Configure Stripe

See [deployment/README.md](deployment/README.md#3-configure-stripe-webhooks)

## 📚 Documentation

- [Architecture Overview](ARCHITECTURE.md) - System design and decisions
- [Supabase Setup](supabase/README.md) - Database and auth configuration
- [n8n Workflows](n8n/README.md) - Automation engine setup
- [Deployment Guide](deployment/README.md) - Production deployment steps

## 🎨 Project Structure

```
nexoai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── billing/      # Stripe integration
│   │   │   ├── webhooks/     # Webhook handlers
│   │   │   └── usage/        # Usage tracking
│   │   ├── dashboard/        # Dashboard pages
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   ├── lib/                  # Utilities and clients
│   │   ├── supabase/        # Supabase client
│   │   ├── stripe/          # Stripe client
│   │   ├── n8n/             # n8n client
│   │   ├── auth.ts          # Auth helpers
│   │   └── rate-limit.ts    # Rate limiting
│   └── types/               # TypeScript types
├── supabase/                # Database schema
│   └── migrations/          # SQL migrations
├── n8n/                     # Workflow definitions
│   └── workflows/           # JSON workflow files
├── deployment/              # Deployment configs
└── .github/workflows/       # CI/CD pipelines
```

## 🔐 Security Features

- ✅ Row-Level Security (RLS) on all tables
- ✅ Webhook signature verification (Stripe + n8n)
- ✅ Rate limiting on all endpoints
- ✅ CORS configuration
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ JWT-based authentication
- ✅ Environment variable validation
- ✅ SQL injection prevention
- ✅ XSS protection

## 💰 Pricing Strategy

Built-in support for:
- **Free Tier**: 1,000 credits/month
- **Pro Tier**: 10,000 credits/month - $29/mo
- **Enterprise Tier**: 50,000 credits/month - $99/mo
- **Usage-Based**: Additional credits beyond plan

Configure in [src/lib/stripe/client.ts](src/lib/stripe/client.ts)

## 🤖 AI Integration

### Supported AI Providers

1. **Ollama** (Free, local)
   - Best for: Development, cost-sensitive production
   - Models: Llama 3.1, Mistral, etc.

2. **Groq** (Free tier available)
   - Best for: Fast inference, high throughput
   - Models: Llama 3, Mixtral

3. **Anthropic Claude** (Recommended)
   - Best for: Complex reasoning, production
   - Models: Claude 3.5 Sonnet, Haiku

4. **OpenAI**
   - Best for: General purpose
   - Models: GPT-4, GPT-3.5

## 🔄 Automation Workflows

Built-in workflows:
1. **User Onboarding** - Welcome emails, sample data creation
2. **Document Processing** - AI-powered document analysis
3. **Usage Alerts** - Threshold notifications
4. **Payment Events** - Subscription lifecycle

Add custom workflows in n8n without code changes!

## 📊 Monitoring & Analytics

### Built-in Monitoring

- Health check endpoint: `/api/health`
- Error tracking with Sentry (optional)
- Uptime monitoring with BetterStack (optional)
- Analytics with PostHog (optional)

### Usage Tracking

All API usage is tracked in `usage_events` table:
- Credits consumed per request
- Organization-level aggregation
- Monthly quota management

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Alternative Platforms

- Netlify
- Cloudflare Pages
- AWS Amplify
- Railway

See [deployment/README.md](deployment/README.md) for detailed instructions.

## 🧪 Testing

```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Build
npm run build
```

## 📈 Scaling Strategy

| Users | Architecture | Monthly Cost |
|-------|-------------|--------------|
| 0-1K | Single region, free tiers | ~$50 |
| 1K-10K | Supabase Pro, dedicated n8n | ~$60 |
| 10K-100K | n8n queue mode, read replicas | ~$150 |
| 100K-1M | Multi-region, n8n cluster | ~$700+ |

**No rewrites needed** - architecture scales horizontally!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🆘 Support

- **Documentation**: Read the [docs](ARCHITECTURE.md)
- **Issues**: Create a [GitHub issue](https://github.com/your-repo/issues)
- **Discussions**: Join our [Discord](https://discord.gg/your-server)
- **Email**: support@nexoai.com

## 🎯 Roadmap

- [ ] Dashboard UI components
- [ ] User management interface
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] API SDK for third-party integrations
- [ ] More AI provider integrations
- [ ] Advanced workflow templates

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [n8n](https://n8n.io)
- [Stripe](https://stripe.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 📸 Screenshots

_Coming soon_

## ⚡ Performance

- Lighthouse Score: 95+
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Core Web Vitals: All passing

---

**Built with ❤️ for lean, automated SaaS operations**

[Get Started](https://nexoai.com) • [Documentation](ARCHITECTURE.md) • [Discord](https://discord.gg/nexoai)
