# 🚀 LlamaTrip: Production Migration Guide

This guide walks you through switching from Stripe Test Mode to Production (Live) Mode.

## ⚠️ Important Warnings

- **Back up your current configuration** before making changes
- Test thoroughly before going live
- Ensure you have production Stripe keys ready
- Real money will be charged in production mode!

## 📋 Pre-Flight Checklist

Before you start, gather these items:

- [ ] Production Stripe Publishable Key (`pk_live_...`)
- [ ] Production Stripe Secret Key (`sk_live_...`)
- [ ] Verified Stripe account (no restrictions)
- [ ] Production product & price ready in Stripe

---

## 🔐 Step 1: Get Your Production Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Toggle from "Test mode" to "Live mode" (top right)
3. Copy your **Publishable key** (starts with `pk_live_`)
4. Click "Create secret key" or reveal existing **Secret key** (starts with `sk_live_`)

**⚠️ Keep these keys secure! Never commit them to version control.**

---

## 📦 Step 2: Create Production Product & Price

### Option A: Use Your Sandbox Product (if it exists in production)

If you already created a product in production Stripe:

1. Go to https://dashboard.stripe.com/products (ensure Live mode is on)
2. Find your product and copy the **Product ID** (`prod_...`)
3. Click on the product to see prices
4. Copy the **Price ID** (`price_...`)

### Option B: Create New Product via MCP (Recommended)

1. First, update your MCP config with live keys (see Step 3)
2. Then create a production product:

```bash
# This will be done via MCP tools with your live key
# Product: LlamaTrip Travel Planning
# Price: $1/month recurring
```

---

## 🔧 Step 3: Update All Environment Variables

You need to update keys in **4 places**:

### 3.1 Local `.env` File

Update your local `.env` file:

```bash
# OLD (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PRICE_ID=price_1SNxufCjsf6yCGkxwczjXinG

# NEW (Production Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
VITE_STRIPE_PRICE_ID=price_YOUR_LIVE_PRICE_ID

# Keep these the same
VITE_APP_URL=http://localhost:8080  # For local dev
VITE_API_URL=http://localhost:3001  # For local dev
```

### 3.2 MCP Configuration (Optional - for managing production via MCP)

Update `~/.cursor/mcp.json`:

**Current (Test):**
```json
"stripe": {
  "url": "https://mcp.stripe.com",
  "headers": {
    "Authorization": "Bearer sk_test_51SNxDNCjsf6yCGkxMj..."
  }    
}
```

**Updated (Production):**
```json
"stripe": {
  "url": "https://mcp.stripe.com",
  "headers": {
    "Authorization": "Bearer sk_live_YOUR_LIVE_SECRET_KEY"
  }    
}
```

⚠️ **Note:** If you want to keep test mode access, consider creating a separate MCP profile.

### 3.3 Render Backend Service (travel-planner-stripe)

Update environment variables in Render Dashboard:

1. Go to https://dashboard.render.com/web/srv-d41omf3e5dus73asijug
2. Click "Environment" in the left sidebar
3. Update these variables:
   ```
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
   VITE_APP_URL=https://travel-planner-mv5b.onrender.com
   ```

### 3.4 Render Frontend Service (travel-planner)

Update environment variables in Render Dashboard:

1. Go to https://dashboard.render.com/static/srv-d41n7truibrs73aoidog
2. Click "Environment" in the left sidebar
3. Update these variables:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
   VITE_STRIPE_PRICE_ID=price_YOUR_LIVE_PRICE_ID
   VITE_API_URL=https://travel-planner-stripe.onrender.com
   ```

---

## 🧪 Step 4: Test in Production

### Local Testing First (Recommended)

1. Update your local `.env` with production keys
2. Restart your servers:
   ```bash
   npm run dev:all
   ```
3. Test with a real card (start with a small amount!)
4. Verify the subscription appears in your Stripe Dashboard (Live mode)

### Testing Checklist

- [ ] Checkout session creates successfully
- [ ] Payment processes (use a real card or saved payment method)
- [ ] Success page loads with correct details
- [ ] Subscription appears in Stripe Dashboard (Live mode)
- [ ] Success toast appears on homepage redirect
- [ ] Cancel flow works correctly

---

## 🚀 Step 5: Deploy to Production

After local testing succeeds:

1. **Commit** (if you changed any code, but NOT `.env`!):
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Update Render Environment Variables** (Steps 3.3 & 3.4 above)

3. **Deploy**:
   - Render will auto-deploy, or
   - Manually trigger deploy from dashboard

4. **Verify Live Site**:
   - Go to https://travel-planner-mv5b.onrender.com
   - Click "Subscribe Now"
   - Complete a test transaction with a real card
   - Verify in Stripe Dashboard (Live mode)

---

## 🔄 Rollback Plan

If something goes wrong, you can quickly rollback:

### Quick Rollback Steps

1. **Render Services**: Change environment variables back to `sk_test_` and `pk_test_`
2. **Local `.env`**: Revert to test keys
3. **MCP**: Revert to test key (if changed)
4. **Redeploy** services

Keep a backup of your test configuration:

```bash
# Backup your test .env
cp .env .env.test.backup
```

---

## ✅ Post-Production Checklist

After going live:

- [ ] Monitor Stripe Dashboard for incoming subscriptions
- [ ] Set up Stripe webhooks for subscription lifecycle events
- [ ] Configure email notifications for failed payments
- [ ] Set up proper error logging and monitoring
- [ ] Add rate limiting to backend API
- [ ] Review and update Terms of Service / Privacy Policy
- [ ] Set up customer support system for payment issues
- [ ] Monitor backend logs for errors
- [ ] Set up billing alert notifications

---

## 🛡️ Security Reminders

✅ **Production Best Practices:**

1. **Never commit** `.env` files to git
2. **Rotate keys** if they're ever exposed
3. **Enable 2FA** on your Stripe account
4. **Monitor** unusual activity in Stripe Dashboard
5. **Set up webhooks** to handle subscription events properly
6. **Implement logging** for all payment-related errors
7. **Use HTTPS** everywhere (Render provides this automatically)

---

## 📞 Need Help?

- **Stripe Support**: https://support.stripe.com/
- **Stripe Documentation**: https://stripe.com/docs
- **Render Support**: https://render.com/docs/support
- **Test Cards** (for testing): https://stripe.com/docs/testing

---

## 🎉 You're Ready!

Once you complete all steps and testing, your LlamaTrip subscription will be live and processing real payments!

Remember: Start with a small test transaction using a real card to verify everything works before announcing to customers.

**Built with 🦙 by Llama, Inc.**

