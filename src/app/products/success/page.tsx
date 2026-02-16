'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Simulate verification
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="glass max-w-2xl rounded-2xl p-12 text-center neon-glow">
        {isVerifying ? (
          <>
            <div className="mb-6 text-6xl">⏳</div>
            <h1 className="mb-4 text-3xl font-bold">Verifying payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your purchase
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 text-6xl">✅</div>
            <h1 className="neon-text mb-4 text-4xl font-bold">
              Purchase Successful!
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Thank you for your purchase. Your products are now available in
              your dashboard.
            </p>

            <div className="mb-8 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Access granted to purchased products</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Confirmation email sent</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Invoice available in billing section</span>
              </div>
            </div>

            {sessionId && (
              <div className="mb-6 rounded-lg border border-white/10 bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Session ID</p>
                <p className="mt-1 font-mono text-xs">{sessionId}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard →
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse More Products
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
