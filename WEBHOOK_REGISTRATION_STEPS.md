# 🔔 Webhook Registration - Step-by-Step Guide

## ✅ What We've Done So Far

1. ✅ Implemented webhook endpoint (`/api/webhook`) in backend
2. ✅ Added signature verification for security
3. ✅ Added handlers for key subscription events
4. ✅ Committed and pushed code to GitHub
5. ✅ Triggered backend deployment on Render

## 📋 Next Steps to Complete Webhook Setup

### Step 1: Wait for Backend Deployment ⏳

**Check deployment status:**
- Go to https://dashboard.render.com/web/srv-d41omf3e5dus73asijug
- Wait for "Live" status (usually 2-3 minutes)
- You'll see the new webhook endpoint in the logs

**Or verify it's live:**
```bash
curl https://travel-planner-stripe.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","service":"LlamaTrip Payments API"}
```

---

### Step 2: Register Webhook in Stripe Dashboard

Once the backend is deployed:

1. **Go to Stripe Webhooks**
   - Navigate to: https://dashboard.stripe.com/webhooks
   - Make sure you're in **LIVE mode** (toggle in top right)

2. **Click "Add endpoint"**

3. **Enter Endpoint URL:**
   ```
   https://travel-planner-stripe.onrender.com/api/webhook
   ```

4. **Select Events to Listen To:**
   
   Click "Select events" and choose:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `customer.subscription.trial_will_end`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. **Click "Add endpoint"**

---

### Step 3: Get Webhook Signing Secret

After creating the webhook:

1. Click on the webhook you just created
2. You'll see a section called **"Signing secret"**
3. Click **"Reveal"** to see the secret
4. It will start with `whsec_...`
5. **Copy this secret** - you'll need it in the next step

---

### Step 4: Add Webhook Secret to Render

1. **Go to your backend service:**
   - Navigate to: https://dashboard.render.com/web/srv-d41omf3e5dus73asijug
   
2. **Click "Environment" in the left sidebar**

3. **Add new environment variable:**
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (the secret you copied)

4. **Save changes** - this will trigger a new deployment

5. **Wait for deployment to complete** (~2 minutes)

---

### Step 5: Test Your Webhook

#### Test in Stripe Dashboard:

1. Go back to https://dashboard.render.com/webhooks
2. Click on your webhook
3. Click **"Send test webhook"** button
4. Select event type: `customer.subscription.created`
5. Click **"Send test webhook"**

#### Check if it worked:

1. Go to your Render backend service
2. Click **"Logs"** tab
3. Look for:
   ```
   📬 Received event: customer.subscription.created
   ✅ New subscription created: sub_xxxxx
   ```

If you see this, **SUCCESS!** 🎉

---

### Step 6: Test with Real Event

The best test is to create a real subscription:

1. Go to: https://travel-planner-mv5b.onrender.com
2. Click "Subscribe Now"
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Check Render logs for webhook events:
   ```
   📬 Received event: customer.subscription.created
   📬 Received event: invoice.payment_succeeded
   ```

---

## 🐛 Troubleshooting

### Webhook not receiving events

**Problem:** No events showing in Render logs

**Solutions:**
1. Verify endpoint URL is correct in Stripe Dashboard
2. Check that backend is deployed and running
3. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
4. Check Render logs for any errors

### Signature verification failed

**Problem:** Logs show "Webhook signature verification failed"

**Solutions:**
1. Verify you copied the correct signing secret from Stripe
2. Make sure you revealed and copied the **live mode** secret, not test mode
3. Redeploy backend after adding the secret
4. Check for extra spaces in the environment variable

### Events timing out

**Problem:** Webhook times out before responding

**Solutions:**
1. Make sure webhook handler returns quickly (< 5 seconds)
2. Don't do heavy processing in the webhook handler
3. Consider adding a job queue for long-running tasks

---

## 📊 Monitoring Your Webhooks

### In Stripe Dashboard:

1. Go to **Webhooks** tab
2. Click on your webhook
3. View:
   - **Success rate** - should be close to 100%
   - **Response time** - should be < 1 second
   - **Recent events** - see all received events
   - **Failures** - any failed deliveries

### In Render Dashboard:

1. Go to your backend service
2. Click **"Logs"** tab
3. Filter for webhook events:
   ```
   📬 Received event
   ```

---

## ✅ Success Checklist

- [ ] Backend deployed successfully
- [ ] Webhook endpoint registered in Stripe
- [ ] Webhook signing secret added to Render
- [ ] Backend redeployed with secret
- [ ] Test webhook sent from Stripe Dashboard
- [ ] Test webhook shows in Render logs
- [ ] Real subscription creates webhook events
- [ ] All events have 200 response in Stripe

---

## 🎉 Once Complete

Your webhook system is now live! This means:

✅ You'll be notified of all subscription changes
✅ You can track payment successes and failures
✅ You can respond to cancellations automatically
✅ Your logs will show all customer actions
✅ You're ready to add database integration

---

## 📚 Next Steps After Webhooks

1. **Set up email notifications** - alert customers of failed payments
2. **Add customer portal** - let customers manage subscriptions
3. **Implement database** - store subscription status
4. **Add feature gating** - control access based on subscription

See `WHATS_NEXT.md` for the complete roadmap!

---

**Need help?** Check `WEBHOOKS_SETUP.md` for more detailed implementation guides.

**Built with 🦙 by Llama, Inc.**

