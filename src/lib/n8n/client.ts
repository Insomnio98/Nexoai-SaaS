import axios from 'axios';

export interface N8nWorkflowTrigger {
  workflowName: string;
  data: Record<string, any>;
}

export interface N8nWorkflowResponse {
  executionId: string;
  data?: any;
}

/**
 * N8n Client - Triggers workflows and handles webhook communication
 */
export class N8nClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.N8N_WEBHOOK_URL || '';
    this.apiKey = process.env.N8N_API_KEY || '';

    if (!this.baseUrl || !this.apiKey) {
      console.warn('N8N_WEBHOOK_URL or N8N_API_KEY not configured');
    }
  }

  /**
   * Trigger a workflow by webhook name
   */
  async triggerWorkflow(
    workflowName: string,
    data: Record<string, any>
  ): Promise<N8nWorkflowResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/webhook/${workflowName}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': this.apiKey,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      return {
        executionId: response.data.executionId || 'unknown',
        data: response.data,
      };
    } catch (error) {
      console.error(`Failed to trigger n8n workflow: ${workflowName}`, error);
      throw new Error(`N8n workflow trigger failed: ${workflowName}`);
    }
  }

  /**
   * Trigger workflow asynchronously (fire and forget)
   */
  async triggerWorkflowAsync(
    workflowName: string,
    data: Record<string, any>
  ): Promise<void> {
    // Don't await - fire and forget
    this.triggerWorkflow(workflowName, data).catch((error) => {
      console.error(
        `Async n8n workflow failed: ${workflowName}`,
        error
      );
    });
  }

  /**
   * Verify n8n webhook signature
   */
  verifyWebhookSignature(signature: string, body: string): boolean {
    const crypto = require('crypto');
    const secret = process.env.N8N_WEBHOOK_SECRET || '';

    if (!secret) {
      console.warn('N8N_WEBHOOK_SECRET not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

// Singleton instance
export const n8nClient = new N8nClient();

/**
 * Common workflow triggers
 */
export const workflows = {
  // User lifecycle
  userCreated: (userId: string, email: string) =>
    n8nClient.triggerWorkflowAsync('user-created', { userId, email }),

  userUpdated: (userId: string, changes: Record<string, any>) =>
    n8nClient.triggerWorkflowAsync('user-updated', { userId, changes }),

  // Organization events
  organizationCreated: (orgId: string, plan: string) =>
    n8nClient.triggerWorkflowAsync('organization-created', { orgId, plan }),

  planUpgraded: (orgId: string, fromPlan: string, toPlan: string) =>
    n8nClient.triggerWorkflowAsync('plan-upgraded', {
      orgId,
      fromPlan,
      toPlan,
    }),

  // AI processing
  documentProcessing: (documentId: string, organizationId: string) =>
    n8nClient.triggerWorkflow('document-processing', {
      documentId,
      organizationId,
    }),

  // Usage tracking
  usageThresholdReached: (orgId: string, percentage: number) =>
    n8nClient.triggerWorkflowAsync('usage-threshold-reached', {
      orgId,
      percentage,
    }),

  // Billing events
  paymentSucceeded: (orgId: string, amount: number, invoiceId: string) =>
    n8nClient.triggerWorkflowAsync('payment-succeeded', {
      orgId,
      amount,
      invoiceId,
    }),

  paymentFailed: (orgId: string, reason: string) =>
    n8nClient.triggerWorkflowAsync('payment-failed', { orgId, reason }),
};
