'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-primary hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Last updated: February 16, 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, including:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Account information (name, email, organization)</li>
              <li>Payment information (processed securely via Stripe)</li>
              <li>Usage data and analytics</li>
              <li>Workflow execution logs</li>
              <li>Files and documents you upload for processing</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect and prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">3. Data Storage and Security</h2>
            <p className="text-muted-foreground">
              Your data is stored securely using industry-standard encryption:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Database: Supabase (PostgreSQL) with Row-Level Security (RLS)</li>
              <li>File storage: Encrypted at rest and in transit</li>
              <li>Payment data: Never stored on our servers (handled by Stripe)</li>
              <li>Authentication: Secure JWT tokens with automatic expiration</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Service providers (Stripe for payments, n8n for workflows)</li>
              <li>Law enforcement when required by law</li>
              <li>Your organization members (data is isolated by tenant)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Your Rights (GDPR/CCPA)</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Request data deletion</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to automated decision-making</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              To exercise these rights, contact us at: privacy@nexoai.com
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies for:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Authentication and session management</li>
              <li>Analytics and performance monitoring</li>
              <li>Preferences and settings</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your data for as long as your account is active or as needed to
              provide services. You can request deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of
              any changes by posting the new policy on this page and updating the "Last
              updated" date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">9. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="ml-6 list-none space-y-2 text-muted-foreground">
              <li>Email: privacy@nexoai.com</li>
              <li>Support: support@nexoai.com</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
