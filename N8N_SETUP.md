# n8n Cloud Setup Guide

## Your n8n Instance
**URL**: https://alexjou.app.n8n.cloud

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Import Simple Test Workflow

1. Open: https://alexjou.app.n8n.cloud
2. Click **"+"** (top right) → **"Import from File"**
3. Select: `n8n/workflows/simple-test.json`
4. Click **"Save"** and **"Activate"**

### Step 2: Get Webhook URL

After activating, you'll see a webhook URL like:
```
https://alexjou.app.n8n.cloud/webhook-test/nexoai-test
```

Copy this URL!

### Step 3: Test It

Open terminal and run:
```bash
curl -X POST https://alexjou.app.n8n.cloud/webhook-test/nexoai-test \
  -H "Content-Type: application/json" \
  -d '{"test": "hello from Nexoai"}'
```

You should see:
```json
{
  "message": "Hello from n8n! Workflow is working ✓",
  "timestamp": "2024-02-16...",
  "received_data": "{\"test\":\"hello from Nexoai\"}"
}
```

✅ **Success!** Your n8n cloud is working!

---

## 🔗 Connect to Your App

### Update Environment Variables

Edit `.env.local`:
```bash
# n8n Cloud Instance
N8N_WEBHOOK_URL=https://alexjou.app.n8n.cloud
N8N_API_KEY=your-api-key-from-n8n
N8N_WEBHOOK_SECRET=create-a-random-secret
```

### Get n8n API Key

1. In n8n cloud: **Settings** → **API**
2. Click **"Create API Key"**
3. Copy the key
4. Paste in `.env.local`

---

## 📋 Available Workflows

### 1. **simple-test.json** (Start Here)
- Simple webhook that responds with "Hello"
- Use to test connection
- 3 nodes, no external dependencies

### 2. **user-onboarding.json**
- Triggers when new user signs up
- Sends welcome email
- Creates sample data
- 6 nodes

### 3. **document-processing.json**
- Processes uploaded documents
- Extracts text with AI
- Stores results in database
- 8 nodes

---

## 🧪 Test from Your App

### Create Test API Route

Create `src/app/api/test-n8n/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { n8nClient } from '@/lib/n8n/client';

export async function GET() {
  try {
    const result = await n8nClient.triggerWorkflow('nexoai-test', {
      message: 'Test from Nexoai app',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
```

Then visit: `http://localhost:3002/api/test-n8n`

---

## 🎯 Workflow URLs in Your n8n Cloud

After importing and activating, your webhooks will be:

| Workflow | Webhook URL |
|----------|-------------|
| Simple Test | `https://alexjou.app.n8n.cloud/webhook-test/nexoai-test` |
| User Onboarding | `https://alexjou.app.n8n.cloud/webhook/user-created` |
| Document Processing | `https://alexjou.app.n8n.cloud/webhook/document-processing` |

---

## 🔧 Troubleshooting

### "Webhook not found"
- Make sure workflow is **activated** (toggle switch is green)
- Check webhook path matches exactly

### "Connection refused"
- Verify `N8N_WEBHOOK_URL` in `.env.local`
- Make sure you're using `https://` not `http://`

### "API key invalid"
- Get fresh API key from n8n Settings
- Update `.env.local`
- Restart dev server: `npm run dev`

---

## 📖 Next Steps

1. ✅ Import `simple-test.json`
2. ✅ Test webhook with curl
3. ✅ Get API key from n8n
4. ✅ Update `.env.local`
5. ✅ Test from your app
6. 🚀 Import other workflows

---

**Your n8n cloud is ready to automate! 🎉**

Need help? Check the full docs: https://docs.n8n.io/
