import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Rate limiters for different use cases
 */
export const rateLimiters = {
  // API endpoints - 10 requests per 10 seconds
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
        prefix: 'ratelimit:api',
      })
    : null,

  // AI endpoints - 5 requests per minute (more expensive)
  ai: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        analytics: true,
        prefix: 'ratelimit:ai',
      })
    : null,

  // Webhook endpoints - 100 requests per minute
  webhook: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:webhook',
      })
    : null,

  // Authentication - 5 attempts per 15 minutes
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        analytics: true,
        prefix: 'ratelimit:auth',
      })
    : null,
};

/**
 * Check rate limit and return response if exceeded
 */
export async function checkRateLimit(
  identifier: string,
  limiter: keyof typeof rateLimiters
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  const ratelimit = rateLimiters[limiter];

  if (!ratelimit) {
    // If Redis is not configured, allow all requests
    console.warn('Rate limiting disabled: Redis not configured');
    return { success: true };
  }

  const result = await ratelimit.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Rate limit middleware helper
 */
export async function rateLimitMiddleware(
  request: Request,
  limiter: keyof typeof rateLimiters
): Promise<Response | null> {
  // Use IP address as identifier
  const identifier =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const result = await checkRateLimit(identifier, limiter);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit?.toString() || '',
          'X-RateLimit-Remaining': result.remaining?.toString() || '',
          'X-RateLimit-Reset': result.reset?.toString() || '',
        },
      }
    );
  }

  return null;
}
