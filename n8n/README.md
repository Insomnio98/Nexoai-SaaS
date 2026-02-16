# n8n Setup Guide

## Overview

n8n is our automation engine - it handles all business logic, workflows, and background jobs. This keeps the Next.js app thin and allows non-developers to modify workflows.

## 1. Self-Hosted n8n Setup

### Option A: Railway (Recommended - Easy)

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from Template"
3. Search for "n8n" or use: https://railway.app/template/n8n
4. Configure:
   - **N8N_ENCRYPTION_KEY**: Generate with `openssl rand -hex 32`
   - **N8N_HOST**: Your Railway domain (e.g., n8n-production-xxxx.up.railway.app)
   - **WEBHOOK_URL**: Same as N8N_HOST
   - **N8N_PROTOCOL**: https
5. Deploy (takes ~2 minutes)
6. Access your n8n instance at the provided URL

**Cost**: ~$5/month

### Option B: Render.com

1. Go to [Render.com](https://render.com)
2. New → Web Service
3. Use Docker image: `n8nio/n8n`
4. Environment variables:

```bash
N8N_ENCRYPTION_KEY=your-random-key
N8N_HOST=your-app.onrender.com
WEBHOOK_URL=https://your-app.onrender.com/
N8N_PROTOCOL=https
GENERIC_TIMEZONE=America/New_York
N8N_EDITOR_BASE_URL=https://your-app.onrender.com/
```

5. Deploy

**Cost**: $7/month (Starter)

### Option C: Docker (Self-Hosted)

```bash
# Create docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-secure-password
      - N8N_HOST=your-domain.com
      - WEBHOOK_URL=https://your-domain.com/
      - GENERIC_TIMEZONE=America/New_York
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:

# Start n8n
docker-compose up -d
```

## 2. Configure n8n

### Create API Key

1. Open n8n dashboard
2. Settings → API
3. Create API Key
4. Save it to your `.env.local`:

```bash
N8N_API_KEY=your-api-key-here
N8N_WEBHOOK_URL=https://your-n8n-instance.com
```

### Set Up Webhook Secret

1. Generate shared secret:
```bash
openssl rand -hex 32
```

2. Add to both:
   - n8n environment variables: `N8N_WEBHOOK_SECRET`
   - Your app's `.env.local`: `N8N_WEBHOOK_SECRET`

## 3. Import Workflows

### Method 1: Import JSON Files

1. Open n8n
2. Click "+" → "Import from File"
3. Select workflow JSON files from `n8n/workflows/`
4. Activate each workflow

### Method 2: Create Manually

Follow the workflow examples below.

## 4. Essential Workflows

### Workflow 1: User Onboarding

**File**: `workflows/user-onboarding.json`

**Trigger**: Webhook `/webhook/user-created`

**Steps**:
1. Receive user data (userId, email)
2. Wait 5 minutes
3. Send welcome email
4. Create sample data in database
5. Track analytics event
6. Send Slack notification to team

### Workflow 2: Document Processing

**File**: `workflows/document-processing.json`

**Trigger**: Webhook `/webhook/document-processing`

**Steps**:
1. Receive document ID
2. Download file from Supabase Storage
3. Extract text (PDF/OCR)
4. Send to local AI for summarization
5. Store results in database
6. Callback to app via webhook
7. Track usage credits

### Workflow 3: Usage Threshold Alert

**File**: `workflows/usage-threshold.json`

**Trigger**: Webhook `/webhook/usage-threshold-reached`

**Steps**:
1. Receive organization ID and percentage
2. Fetch organization details from Supabase
3. Send email to admin
4. Create in-app notification
5. If >90%, send Slack alert

### Workflow 4: Payment Success

**File**: `workflows/payment-success.json`

**Trigger**: Webhook `/webhook/payment-succeeded`

**Steps**:
1. Receive payment data
2. Send thank you email
3. Update CRM (if connected)
4. Track analytics event
5. Send invoice

## 5. Workflow Templates

### Basic Webhook Workflow

```json
{
  "nodes": [
    {
      "parameters": {
        "path": "user-created",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "respondWith": "allIncomingItems",
        "options": {}
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [850, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]]
    }
  }
}
```

### Supabase Query Example

Add "Supabase" node:
- **Operation**: Select
- **Table**: organizations
- **Return All**: No
- **Limit**: 1
- **Filters**:
  - Column: `id`
  - Operator: `equals`
  - Value: `{{ $json.organizationId }}`

### Send Email Example

Add "Send Email" node or integrate with:
- Resend
- SendGrid
- Mailgun
- SMTP

## 6. Connecting to Your App

### Trigger Workflow from Next.js

```typescript
import { workflows } from '@/lib/n8n/client';

// Fire and forget
await workflows.userCreated(userId, email);

// Wait for response
const result = await n8nClient.triggerWorkflow('document-processing', {
  documentId: 'abc123',
  organizationId: 'org456'
});
```

### Receive Callback from n8n

n8n calls your app at: `POST /api/webhooks/n8n`

```typescript
// In your workflow, add HTTP Request node:
{
  "method": "POST",
  "url": "https://your-app.com/api/webhooks/n8n",
  "headers": {
    "x-n8n-signature": "{{ $env.N8N_WEBHOOK_SECRET }}"
  },
  "body": {
    "workflowName": "document-processing",
    "organizationId": "{{ $json.organizationId }}",
    "result": "{{ $json }}"
  }
}
```

## 7. Best Practices

### Error Handling

Always add error handling:
1. Add "Error Trigger" node
2. Send error notifications
3. Log to database
4. Retry failed executions

### Credentials Management

Store credentials in n8n:
1. Credentials → Add Credential
2. Select type (Supabase, OpenAI, etc.)
3. Never hardcode in workflows

### Testing

1. Use "Manual" trigger during development
2. Test with sample data
3. Check execution logs
4. Activate only when ready

### Performance

- Use "Queue Mode" for high-volume workflows
- Set execution timeouts
- Limit concurrent executions if needed

## 8. Monitoring

### Execution Logs

- View in n8n: Executions tab
- Store in database: Add Supabase insert node
- Send errors to Sentry

### Webhook Debugging

```bash
# Test webhook locally
curl -X POST https://your-n8n.com/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 9. Scaling n8n

### Queue Mode (for high traffic)

Update Docker/Railway config:

```bash
EXECUTIONS_MODE=queue
QUEUE_BULL_REDIS_HOST=your-redis-host
QUEUE_BULL_REDIS_PORT=6379
```

Benefits:
- Handle 1000+ workflows/minute
- Multiple worker instances
- Automatic retries

### Database (for production)

Use PostgreSQL instead of SQLite:

```bash
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=your-db-host
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=your-password
```

## 10. Cost Optimization

### Use Local AI

Instead of OpenAI API:
- Ollama (free, self-hosted)
- Groq (free tier)
- LocalAI

```javascript
// In n8n HTTP Request node
{
  "url": "http://host.docker.internal:11434/api/generate",
  "method": "POST",
  "body": {
    "model": "llama3.1",
    "prompt": "{{ $json.text }}"
  }
}
```

### Batch Processing

Group multiple operations:
- Process files in batches
- Send emails in bulk
- Aggregate database writes

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Community Workflows](https://n8n.io/workflows)
- [n8n Academy](https://academy.n8n.io/)
- [Discord Community](https://discord.gg/n8n)

## Troubleshooting

### Webhook Not Firing
- Check webhook URL is correct
- Verify n8n is accessible from internet
- Check firewall settings

### Credentials Error
- Re-save credentials in n8n
- Check credential permissions
- Verify API keys are valid

### Workflow Fails
- Check execution logs
- Verify node configuration
- Test with manual execution
- Check data format

## Next Steps

1. ✅ Import example workflows
2. ✅ Configure credentials (Supabase, AI, Email)
3. ✅ Test each workflow manually
4. ✅ Activate workflows
5. ✅ Monitor executions
6. ✅ Customize for your use case
