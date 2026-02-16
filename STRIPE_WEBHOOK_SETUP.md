# 🔔 Stripe Webhook Configuration

## Update Stripe Webhook URL

Your app is now live at: **https://nexoai-sigma.vercel.app**

You need to update the Stripe webhook to point to your production URL.

---

## Step 1: Update Webhook Endpoint

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/test/webhooks

2. **Find your existing webhook** (if any) and click on it

3. **Update the Endpoint URL** to:
   ```
   https://nexoai-sigma.vercel.app/api/webhooks/stripe
   ```

4. **OR Create a New Webhook**:
   - Click "Add endpoint"
   - Endpoint URL: `https://nexoai-sigma.vercel.app/api/webhooks/stripe`
   - Description: "Nexoai Production Webhook"
   - Events to send: Click "Select events"
     - Select these events:
       - `checkout.session.completed`
       - `customer.subscription.created`
       - `customer.subscription.updated`
       - `customer.subscription.deleted`
       - `invoice.payment_succeeded`
       - `invoice.payment_failed`
   - Click "Add endpoint"

5. **Copy the Webhook Signing Secret**:
   - Click on the webhook you just created
   - Click "Reveal" next to "Signing secret"
   - Copy the value (starts with `whsec_...`)

---

## Step 2: Update Vercel Environment Variable

Run this command to update the webhook secret in Vercel:

```bash
cd /c/Users/alexj/Documents/claude
echo "whsec_YOUR_NEW_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET production --yes
```

Then redeploy:

```bash
vercel --prod
```

---

## Step 3: Test the Webhook

1. **Make a Test Purchase**:
   - Go to: https://nexoai-sigma.vercel.app/products
   - Add items to cart
   - Click "Proceed to Checkout"
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

2. **Check Stripe Webhook Logs**:
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click on your webhook
   - You should see successful events with `200` status

3. **Check Your Database**:
   - Go to: https://app.supabase.com/project/btxkfuecplntpavvexxp/editor
   - Check if the purchase was recorded

---

## Current Webhook Secret

Your webhook secret from earlier:
```
whsec_aYlx6OyPdLyBeOcNSNCbW42tp6qGP4I1
```

**Important**: Make sure this matches the one in Stripe Dashboard!

---

## Webhook Test Events

Stripe provides test events you can trigger manually:

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click your webhook
3. Click "Send test webhook"
4. Select event type (e.g., `checkout.session.completed`)
5. Click "Send test event"
6. Check if your app received it successfully

---

**Your checkout should now work end-to-end!** 🎉
