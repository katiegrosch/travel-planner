# Stripe Checkout Integration Setup

This document explains how to use and test the Stripe Checkout integration for LlamaTrip.

## 🎯 Overview

The integration includes:
- ✅ Monthly subscription for $1/month
- ✅ Secure checkout flow using Stripe Checkout
- ✅ Success and cancel pages
- ✅ Backend API for session creation
- ✅ Environment-based configuration

## 📦 Product Details

**Product ID:** `prod_TKdA2rRyiveWwg`  
**Price ID:** `price_1SNxufCjsf6yCGkxwczjXinG`  
**Amount:** $1.00 USD per month  
**Type:** Recurring subscription

## 🔧 Setup Instructions

### 1. Environment Variables

The `.env` file is already configured with your test keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PRICE_ID=price_1SNxufCjsf6yCGkxwczjXinG
VITE_APP_URL=http://localhost:8080
```

⚠️ **Important:** Never commit the `.env` file to version control (it's already in `.gitignore`).

### 2. Get Your Publishable Key

To complete the setup, you need to add your **Stripe Publishable Key**:

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your "Publishable key" (starts with `pk_test_`)
3. Update `.env` with the correct publishable key

### 3. Running the Application

You have two servers to run:

#### Option A: Run Both Servers Together (Recommended)
```bash
npm run dev:all
```

This runs:
- Frontend dev server on http://localhost:8080
- Backend API server on http://localhost:3001

#### Option B: Run Servers Separately
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend API
npm run server
```

## 🧪 Testing the Integration

### Testing Successful Payment

1. Click the "Subscribe for $1/month" button on the homepage
2. Use Stripe's test card:
   - **Card Number:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., 12/34)
   - **CVC:** Any 3 digits (e.g., 123)
   - **ZIP:** Any 5 digits (e.g., 12345)
3. You'll be redirected to the success page with subscription details

### Testing Failed Payment

Use this card to test a declined payment:
- **Card Number:** `4000 0000 0000 0002`
- Everything else the same as above

### Testing Cancelled Checkout

1. Click "Subscribe for $1/month"
2. On the Stripe Checkout page, click the back arrow or close the tab
3. You'll be redirected to the cancel page

## 📁 File Structure

```
├── server/
│   └── index.js              # Backend API with Stripe endpoints
├── src/
│   ├── components/
│   │   └── SubscribeButton.tsx  # Reusable subscribe button component
│   ├── pages/
│   │   ├── Success.tsx       # Post-purchase success page
│   │   └── Cancel.tsx        # Checkout cancellation page
│   └── App.tsx               # Routes configuration
├── .env                      # Environment variables (DO NOT COMMIT)
├── .env.example              # Template for environment variables
└── STRIPE_SETUP.md           # This file
```

## 🔐 Security Best Practices

✅ **What we did:**
- Secret key is stored server-side only (never exposed to frontend)
- All checkout sessions are created server-side
- CORS is configured to only allow requests from your app URL
- Environment variables are used for all sensitive data

⚠️ **Before going to production:**
1. Replace test keys with live keys
2. Add webhook handlers for subscription events
3. Implement proper error logging and monitoring
4. Add rate limiting to API endpoints
5. Set up proper HTTPS for both frontend and backend

## 🎨 Customization

### Changing the Price

1. Update the price in Stripe Dashboard or via API
2. Update `VITE_STRIPE_PRICE_ID` in `.env` with the new price ID

### Modifying Success/Cancel Pages

Edit these files:
- `src/pages/Success.tsx` - Customize the success experience
- `src/pages/Cancel.tsx` - Customize the cancellation experience

### Adding More Products

1. Create new product and price in Stripe
2. Add new button using the `SubscribeButton` component:

```tsx
<SubscribeButton priceId="price_xxxxx">
  Subscribe to Premium Plan
</SubscribeButton>
```

## 🐛 Troubleshooting

### "Failed to create checkout session"
- Ensure the backend server is running on port 3001
- Check that your Stripe secret key is valid
- Verify the price ID exists in your Stripe account

### "Confirming your subscription" spinner never stops
- Check that the session ID is in the URL
- Verify the backend can retrieve session details
- Check browser console for errors

### CORS errors
- Ensure `VITE_APP_URL` in `.env` matches your frontend URL
- Restart both servers after changing environment variables

## 📚 Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Testing Cards](https://stripe.com/docs/testing#cards)
- [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
- [Stripe API Reference](https://stripe.com/docs/api)

## 🎉 Success!

Your Stripe integration is ready for testing! The subscribe button is now live on your homepage.

---

**Built with 🦙 by Llama, Inc.**

