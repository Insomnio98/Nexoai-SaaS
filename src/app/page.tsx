import Link from 'next/link';
import { LogoText } from '@/components/logo';
import { RocketIcon, CheckIcon } from '@/components/icons';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <LogoText className="neon-text" />
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/products" className="text-sm hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="#pricing" className="text-sm hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
              Demo
            </Link>
            <Link href="/auth/login" className="glass rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-all">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20"></div>
        <div className="container relative mx-auto px-4 py-20 text-center">
          <div className="float mb-8 inline-block">
            <RocketIcon className="h-20 w-20 text-primary" />
          </div>
          <h1 className="neon-text mb-6 text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            AI-Powered SaaS
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Built for Automation
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Lean architecture. Low cost. High performance. Built with Next.js,
            AI automation, and cutting-edge technology.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="btn-futuristic inline-block"
            >
              Browse Products
            </Link>
            <Link
              href="/dashboard"
              className="glass inline-block rounded-xl px-8 py-3 text-sm font-medium transition-all hover:bg-white/10 hover:scale-105"
            >
              View Demo Dashboard
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • Free demo available
          </p>

          {/* Floating stats */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="glass rounded-2xl p-6 hover-scale">
              <div className="text-4xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="glass rounded-2xl p-6 hover-scale">
              <div className="text-4xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="glass rounded-2xl p-6 hover-scale">
              <div className="text-4xl font-bold text-primary">$5/mo</div>
              <div className="text-sm text-muted-foreground">Starting Price</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
        <div className="container relative mx-auto px-4">
          <h2 className="mb-4 text-center text-4xl font-bold">
            Automation-First Architecture
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Built for developers who value efficiency and scalability
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="product-card text-center">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Thin Backend</h3>
              <p className="text-muted-foreground">
                Next.js API routes orchestrate, n8n executes. Change logic
                without redeploying.
              </p>
            </div>
            <div className="product-card text-center">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Cost Optimized</h3>
              <p className="text-muted-foreground">
                Local AI, serverless execution, pay-per-use. Scale without
                breaking the bank.
              </p>
            </div>
            <div className="product-card text-center">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold">Security First</h3>
              <p className="text-muted-foreground">
                Row-level security, webhook verification, tenant isolation by
                design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animated-border rounded-3xl p-12 text-center">
            <div className="mb-6 flex justify-center">
              <svg className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="mb-4 text-4xl font-bold">
              Ready-to-Use AI Products
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Browse our marketplace of premium AI tools and automation workflows
            </p>
            <Link href="/products" className="btn-futuristic inline-block">
              Explore Marketplace →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-4xl font-bold">Simple Pricing</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Choose the plan that works for you
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div className="glass rounded-2xl p-8">
              <h3 className="mb-2 text-xl font-semibold">Free</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  1,000 credits/month
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  Basic AI features
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  Community support
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="mt-6 block rounded-lg border border-white/10 px-4 py-3 text-center hover:bg-white/5 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="animated-border rounded-2xl p-8">
              <div className="mb-2 text-xs font-semibold uppercase text-primary">
                Popular
              </div>
              <h3 className="mb-2 text-xl font-semibold">Pro</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  10,000 credits/month
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  Advanced AI features
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  Custom workflows
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="btn-futuristic mt-6 block text-center"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="glass rounded-2xl p-8">
              <h3 className="mb-2 text-xl font-semibold">Enterprise</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  50,000 credits/month
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  All AI features
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  Dedicated support
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  Custom integrations
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  SLA guarantee
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="mt-6 block rounded-lg border border-white/10 px-4 py-3 text-center hover:bg-white/5 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/10 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Built with Next.js, AI, and automation. Open source on{' '}
            <a href="https://github.com/Insomnio98/Nexoai-SaaS" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>
          <p>© 2024 Nexoai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
