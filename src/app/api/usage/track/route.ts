import { NextResponse } from 'next/server';
import { getUserWithOrganization } from '@/lib/auth';
import { checkUsageLimit, trackUsage } from '@/lib/auth';
import { workflows } from '@/lib/n8n/client';
import { rateLimitMiddleware } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'api');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { user, organization } = await getUserWithOrganization();

    if (!user || !organization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventType, creditsUsed = 1, metadata = {} } = await request.json();

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type required' },
        { status: 400 }
      );
    }

    // Check usage limits
    const { allowed, remaining } = await checkUsageLimit(
      organization.id,
      creditsUsed
    );

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Usage limit exceeded',
          remaining: 0,
          limit: organization.usage_limit,
        },
        { status: 429 }
      );
    }

    // Track usage
    await trackUsage({
      organizationId: organization.id,
      userId: user.id,
      eventType,
      creditsUsed,
      metadata,
    });

    // Check if threshold reached (80%)
    const usagePercentage =
      ((organization.usage_limit - remaining + creditsUsed) /
        organization.usage_limit) *
      100;

    if (usagePercentage >= 80 && usagePercentage < 100) {
      workflows.usageThresholdReached(organization.id, usagePercentage);
    }

    return NextResponse.json({
      success: true,
      remaining: remaining - creditsUsed,
      limit: organization.usage_limit,
    });
  } catch (error: any) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
