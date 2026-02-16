import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold">Nexoai</div>
          <nav className="flex gap-6">
            <Link href="#features" className="text-sm hover:underline">
              Features
            </Link>
            <Link href="#pricing" className="text-sm hover:underline">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            AI-Powered SaaS
            <br />
            <span className="text-primary">Built for Automation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Lean architecture. Low cost. High performance. Built with Next.js,
            Supabase, n8n, and Stripe.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold">
            Automation-First Architecture
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="text-xl font-semibold">Thin Backend</h3>
              <p className="mt-2 text-muted-foreground">
                Next.js API routes orchestrate, n8n executes. Change logic
                without redeploying.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 text-4xl">💰</div>
              <h3 className="text-xl font-semibold">Cost Optimized</h3>
              <p className="mt-2 text-muted-foreground">
                Local AI, serverless execution, pay-per-use. Scale without
                breaking the bank.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 text-4xl">🔒</div>
              <h3 className="text-xl font-semibold">Security First</h3>
              <p className="mt-2 text-muted-foreground">
                Row-level security, webhook verification, tenant isolation by
                design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold">Simple Pricing</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold">Free</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                <li>✓ 1,000 credits/month</li>
                <li>✓ Basic AI features</li>
                <li>✓ Community support</li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-6 block rounded-lg border px-4 py-2 text-center hover:bg-accent"
              >
                Get Started
              </Link>
            </div>
            <div className="rounded-lg border-2 border-primary bg-card p-6">
              <div className="mb-2 text-xs font-semibold uppercase text-primary">
                Popular
              </div>
              <h3 className="text-xl font-semibold">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                <li>✓ 10,000 credits/month</li>
                <li>✓ Advanced AI features</li>
                <li>✓ Priority support</li>
                <li>✓ Custom workflows</li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-6 block rounded-lg bg-primary px-4 py-2 text-center text-primary-foreground hover:bg-primary/90"
              >
                Start Free Trial
              </Link>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold">Enterprise</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                <li>✓ 50,000 credits/month</li>
                <li>✓ All AI features</li>
                <li>✓ Dedicated support</li>
                <li>✓ Custom integrations</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-6 block rounded-lg border px-4 py-2 text-center hover:bg-accent"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js, Supabase, n8n, and Stripe. Open source on{' '}
            <a href="#" className="underline">
              GitHub
            </a>
            .
          </p>
          <p className="mt-4">© 2024 Nexoai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
