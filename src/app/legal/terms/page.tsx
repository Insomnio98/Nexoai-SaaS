'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-primary hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Last updated: February 16, 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Nexoai ("the Service"), you accept and agree to be
              bound by these Terms of Service. If you do not agree to these terms, please
              do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Nexoai provides AI-powered automation and workflow management services,
              including:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Document processing and analysis</li>
              <li>Workflow automation via n8n integration</li>
              <li>AI-powered content generation</li>
              <li>Data synchronization and integration</li>
              <li>Usage tracking and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">3. Account Registration</h2>
            <p className="text-muted-foreground">
              To use the Service, you must:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or have parental consent</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Subscription and Billing</h2>
            <p className="text-muted-foreground">
              Our subscription plans operate as follows:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Free Plan:</strong> Limited usage (1,000 credits/month)
              </li>
              <li>
                <strong>Pro Plan:</strong> Enhanced usage (10,000 credits/month)
              </li>
              <li>
                <strong>Enterprise Plan:</strong> Unlimited usage with SLA
              </li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Billing is handled securely through Stripe. You can cancel your subscription
              at any time from the billing portal.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Usage Limits and Credits</h2>
            <p className="text-muted-foreground">
              Each action consumes credits based on complexity:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Document processing: 10 credits per document</li>
              <li>AI generation: 5 credits per request</li>
              <li>Workflow execution: 1-50 credits depending on complexity</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Exceeding your plan limits will require an upgrade or additional credits
              purchase.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">6. Acceptable Use Policy</h2>
            <p className="text-muted-foreground">You agree NOT to:</p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Use the Service for illegal or fraudulent activities</li>
              <li>Attempt to bypass usage limits or security measures</li>
              <li>Upload malware, viruses, or malicious code</li>
              <li>Scrape or harvest data from the Service</li>
              <li>Reverse engineer or decompile the Service</li>
              <li>Share your account with unauthorized users</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              You retain ownership of your data and content. We retain ownership of the
              Service, including all software, designs, and trademarks. You grant us a
              license to use your content solely to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. Data Processing and Privacy</h2>
            <p className="text-muted-foreground">
              Your data is processed in accordance with our{' '}
              <Link href="/legal/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              . We implement industry-standard security measures including encryption,
              access controls, and regular security audits.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">9. Service Availability</h2>
            <p className="text-muted-foreground">
              We strive for 99.9% uptime but do not guarantee uninterrupted service.
              Planned maintenance will be announced in advance. We are not liable for
              service interruptions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">10. Termination</h2>
            <p className="text-muted-foreground">
              We may suspend or terminate your account if you violate these terms. You may
              terminate your account at any time from your account settings. Upon
              termination, your data will be deleted within 30 days unless retention is
              required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              11. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXOAI SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
              FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">12. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the
              Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">13. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of [Your Jurisdiction]. Any disputes
              shall be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">14. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service:
            </p>
            <ul className="ml-6 list-none space-y-2 text-muted-foreground">
              <li>Email: legal@nexoai.com</li>
              <li>Support: support@nexoai.com</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
