import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { n8nClient } from '@/lib/n8n/client';
import { createServiceClient } from '@/lib/supabase/server';
import { rateLimitMiddleware } from '@/lib/rate-limit';

/**
 * Webhook endpoint for receiving callbacks from n8n workflows
 */
export async function POST(request: Request) {
  // Rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'webhook');
  if (rateLimitResponse) return rateLimitResponse;

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('x-n8n-signature');

  // Verify signature
  if (!signature || !n8nClient.verifyWebhookSignature(signature, body)) {
    console.error('Invalid n8n webhook signature');
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  try {
    const data = JSON.parse(body);
    const { workflowName, executionId, status, result, error } = data;

    const supabase = createServiceClient();

    // Log workflow execution
    if (data.organizationId) {
      await supabase.from('workflow_executions').insert({
        organization_id: data.organizationId,
        workflow_name: workflowName,
        status: status || 'success',
        input: data.input || null,
        output: result || null,
        error: error || null,
        completed_at: new Date().toISOString(),
      });
    }

    // Handle specific workflow callbacks
    switch (workflowName) {
      case 'document-processing':
        // Update document status in database
        if (data.documentId && result) {
          // Your custom logic here
          console.log('Document processed:', data.documentId);
        }
        break;

      case 'usage-threshold-reached':
        // Send notification to organization
        console.log('Usage threshold reached:', data.organizationId);
        break;

      default:
        console.log('Workflow completed:', workflowName);
    }

    return NextResponse.json({
      success: true,
      executionId,
    });
  } catch (error: any) {
    console.error('n8n webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
