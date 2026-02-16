import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nexoai.vercel.app'),
  title: {
    default: 'Nexoai - AI-Powered Automation & Workflow Platform',
    template: '%s | Nexoai',
  },
  description:
    'Transform your business with AI-powered automation. No-code workflows, document processing, and intelligent automation tools designed for scale.',
  keywords: [
    'AI automation',
    'workflow automation',
    'n8n',
    'document processing',
    'AI SaaS',
    'business automation',
    'no-code automation',
    'AI tools',
  ],
  authors: [{ name: 'Nexoai Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Nexoai - AI-Powered Automation & Workflow Platform',
    description: 'Transform your business with AI-powered automation tools.',
    siteName: 'Nexoai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
