import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export type UserWithOrg = User & {
  organization?: Database['public']['Tables']['users']['Row'];
};

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current user with organization data
 */
export async function getUserWithOrganization(): Promise<{
  user: User | null;
  organization: Database['public']['Tables']['organizations']['Row'] | null;
  userRole: 'owner' | 'admin' | 'member' | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, organization: null, userRole: null };
  }

  // Get user's organization membership
  const { data: userData } = await supabase
    .from('users')
    .select('organization_id, role')
    .eq('id', user.id)
    .single();

  if (!userData?.organization_id) {
    return { user, organization: null, userRole: null };
  }

  // Get organization details
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', userData.organization_id)
    .single();

  return {
    user,
    organization: organization || null,
    userRole: userData.role,
  };
}

/**
 * Check if user has required role
 */
export async function requireRole(
  allowedRoles: Array<'owner' | 'admin' | 'member'>
): Promise<boolean> {
  const { userRole } = await getUserWithOrganization();

  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
}

/**
 * Require authentication - throw if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Check usage limits for organization
 */
export async function checkUsageLimit(
  organizationId: string,
  creditsNeeded: number = 1
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = await createClient();

  // Get organization's plan limits
  const { data: org } = await supabase
    .from('organizations')
    .select('plan, usage_limit')
    .eq('id', organizationId)
    .single();

  if (!org) {
    return { allowed: false, remaining: 0 };
  }

  // Calculate current month's usage
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usage } = await supabase
    .from('usage_events')
    .select('credits_used')
    .eq('organization_id', organizationId)
    .gte('created_at', startOfMonth.toISOString());

  const totalUsed = usage?.reduce((sum, e) => sum + e.credits_used, 0) || 0;
  const remaining = org.usage_limit - totalUsed;

  return {
    allowed: remaining >= creditsNeeded,
    remaining: Math.max(0, remaining),
  };
}

/**
 * Track usage event
 */
export async function trackUsage(params: {
  organizationId: string;
  userId?: string;
  eventType: string;
  creditsUsed: number;
  metadata?: any;
}): Promise<void> {
  const supabase = await createClient();

  await supabase.from('usage_events').insert({
    organization_id: params.organizationId,
    user_id: params.userId || null,
    event_type: params.eventType,
    credits_used: params.creditsUsed,
    metadata: params.metadata || {},
  });
}
