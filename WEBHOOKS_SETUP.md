# 🔔 LlamaTrip Webhooks Setup Guide

Webhooks allow Stripe to notify your application when important events happen (payments, cancellations, etc.).

## 🚨 Why Webhooks Are Critical

Without webhooks, you won't know when:
- ❌ A subscription payment fails
- ❌ A customer cancels their subscription
- ❌ A subscription successfully renews
- ❌ A payment method is about to expire
- ❌ A dispute is filed

**This means customers could lose access when they shouldn't, or keep access after cancelling!**

---

## 📋 Step 1: Create Webhook Endpoint

Add this to your backend (`server/index.js`):

```javascript
// Add this near the top with other imports
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Add this BEFORE your other routes (important for raw body parsing)
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  console.log(`Received event: ${event.type}`);

  switch (event.type) {
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('✅ New subscription created:', subscription.id);
      // TODO: Save subscription to your database
      // TODO: Grant customer access to premium features
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log('🔄 Subscription updated:', updatedSubscription.id);
      // TODO: Update subscription status in your database
      break;

    case 'customer.subscription.deleted':
      const cancelledSubscription = event.data.object;
      console.log('❌ Subscription cancelled:', cancelledSubscription.id);
      // TODO: Revoke customer access
      // TODO: Update database
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('💰 Payment succeeded for invoice:', invoice.id);
      // TODO: Send receipt email
      // TODO: Extend subscription access
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('💥 Payment failed for invoice:', failedInvoice.id);
      // TODO: Send payment failure email
      // TODO: Notify customer to update payment method
      break;

    case 'customer.subscription.trial_will_end':
      const trialSub = event.data.object;
      console.log('⏰ Trial ending soon:', trialSub.id);
      // TODO: Send reminder email
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return 200 to acknowledge receipt
  res.json({received: true});
});
```

---

## 📋 Step 2: Update Environment Variables

Add to your `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_...  # You'll get this in Step 3
```

---

## 📋 Step 3: Register Webhook in Stripe Dashboard

### For Production (Render Backend):

1. Go to https://dashboard.stripe.com/webhooks (ensure LIVE mode)
2. Click **"Add endpoint"**
3. Enter your endpoint URL:
   ```
   https://travel-planner-stripe.onrender.com/api/webhook
   ```
4. Select events to listen for:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `customer.subscription.trial_will_end`

5. Click **"Add endpoint"**
6. Click on the webhook to reveal the **Signing secret** (starts with `whsec_`)
7. Copy the signing secret and add it to Render:
   - Go to your backend service settings
   - Add environment variable: `STRIPE_WEBHOOK_SECRET=whsec_...`

### For Local Testing:

Use Stripe CLI to forward webhooks to localhost:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/api/webhook

# Copy the webhook signing secret shown and add to .env
# STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📋 Step 4: Test Your Webhook

### Test in Stripe Dashboard:

1. Go to your webhook in Stripe Dashboard
2. Click **"Send test webhook"**
3. Select an event type (e.g., `customer.subscription.created`)
4. Click **"Send test webhook"**
5. Check your Render logs or local console for the event

### Test with Real Events:

1. Create a test subscription
2. Check your logs to see the `customer.subscription.created` event
3. Cancel the subscription in Stripe Dashboard
4. Check logs for `customer.subscription.deleted` event

---

## 🗄️ Step 5: Add Database (Recommended)

Right now, you're not storing customer or subscription data. You should:

### Option A: Add Postgres Database

1. Create a Postgres database on Render
2. Store:
   - Customer ID
   - Subscription ID
   - Subscription status
   - Email
   - Start date
   - Current period end

### Option B: Use Stripe as Your Database

For simple cases, you can store everything in Stripe using metadata:

```javascript
// When creating checkout session, add metadata:
metadata: {
  userId: 'your_user_id',
  email: 'customer@example.com',
  planType: 'premium'
}
```

Then query Stripe when you need to check subscription status.

---

## 🔒 Step 6: Add Middleware to Check Subscription Status

Create a middleware to protect premium features:

```javascript
// server/middleware/checkSubscription.js
export async function checkSubscription(req, res, next) {
  const customerId = req.user?.stripeCustomerId; // From your auth system
  
  if (!customerId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.status(403).json({ 
        error: 'No active subscription',
        message: 'Please subscribe to access this feature'
      });
    }

    req.subscription = subscriptions.data[0];
    next();
  } catch (error) {
    console.error('Subscription check failed:', error);
    res.status(500).json({ error: 'Failed to verify subscription' });
  }
}

// Use it on protected routes:
app.get('/api/premium/itinerary', checkSubscription, async (req, res) => {
  // This route is now protected
  res.json({ itinerary: 'Premium content here' });
});
```

---

## 📊 Step 7: Monitor Your Webhooks

### In Stripe Dashboard:

1. Go to **Webhooks** tab
2. Click on your webhook endpoint
3. View:
   - Success rate
   - Failed attempts
   - Recent events

### Set Up Alerts:

- Set up Slack/email alerts for failed webhooks
- Monitor for unusual patterns (lots of cancellations, failed payments)

---

## 🧪 Testing Webhook Events

### Test Cards for Different Scenarios:

```bash
# Successful payment (default)
4242 4242 4242 4242

# Payment requires authentication (triggers customer.subscription.created after auth)
4000 0025 0000 3155

# Insufficient funds (triggers invoice.payment_failed)
4000 0000 0000 9995

# Card declined (triggers invoice.payment_failed)
4000 0000 0000 0002
```

---

## 📝 Common Webhook Patterns

### Pattern 1: Successful Subscription Flow
```
1. customer.subscription.created
2. invoice.payment_succeeded
3. (monthly) invoice.payment_succeeded (renewal)
```

### Pattern 2: Failed Payment Flow
```
1. invoice.payment_failed
2. (Stripe retries automatically)
3. invoice.payment_failed (if still failing)
4. customer.subscription.deleted (after max retries)
```

### Pattern 3: Cancellation Flow
```
1. customer.subscription.updated (cancel_at_period_end = true)
2. customer.subscription.deleted (when period ends)
```

---

## 🚨 Error Handling Best Practices

1. **Always return 200**: Even if processing fails, return 200 to Stripe
2. **Log everything**: Log all webhook events for debugging
3. **Idempotency**: Handle duplicate webhook events gracefully
4. **Retry logic**: Stripe will retry failed webhooks automatically
5. **Timeout handling**: Process webhooks quickly (< 5 seconds)

---

## 📚 Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Webhook Event Types](https://stripe.com/docs/api/events/types)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

**Built with 🦙 by Llama, Inc.**

