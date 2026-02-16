import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring
 * Preview mode - no database required
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: 'preview',
    timestamp: new Date().toISOString(),
    services: {
      api: 'healthy',
      preview: 'enabled',
    },
  });
}
