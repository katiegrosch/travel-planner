# 🧪 LlamaTrip Stripe Testing Guide

This guide helps you thoroughly test your Stripe subscription integration to ensure it works seamlessly for all customers worldwide.

## 🎯 Testing Goals

- ✅ Verify successful subscription flows
- ✅ Test payment failures and edge cases
- ✅ Ensure international customer support
- ✅ Validate 3D Secure authentication
- ✅ Test cancellation and refund flows

## 🌍 International Testing Scenarios

### Test Cards for Different Countries

Stripe provides localized test cards to simulate international payments:

| Country | Card Number | Use Case |
|---------|-------------|----------|
| **US** | `4242 4242 4242 4242` | Standard successful payment |
| **UK** | `4000 0082 6000 0000` | UK Visa card |
| **Brazil** | `4000 0076 4000 0002` | Brazilian card |
| **Mexico** | `4000 0484 0000 0008` | Mexican card |
| **India** | `4000 0356 0000 0008` | Indian card (requires 3DS) |
| **France** | `4000 0025 0000 0003` | French card |
| **Germany** | `4000 0027 6000 0016` | German card |
| **Australia** | `4000 0003 6000 0006` | Australian card |
| **Canada** | `4000 0012 4000 0000` | Canadian card |
| **Japan** | `4000 0392 0000 0003` | Japanese card |

**For all cards above:**
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any valid format for the country

## 💳 Payment Failure Scenarios

### Common Decline Reasons

Test these scenarios to ensure proper error handling:

| Scenario | Card Number | Expected Result |
|----------|-------------|-----------------|
| **Generic Decline** | `4000 0000 0000 0002` | Payment declined |
| **Insufficient Funds** | `4000 0000 0000 9995` | Card has insufficient funds |
| **Lost Card** | `4000 0000 0000 9987` | Card reported lost |
| **Stolen Card** | `4000 0000 0000 9979` | Card reported stolen |
| **Expired Card** | `4000 0000 0000 0069` | Card expired |
| **Incorrect CVC** | `4000 0000 0000 0127` | CVC check fails |
| **Processing Error** | `4000 0000 0000 0119` | Generic processing error |
| **Card Velocity Exceeded** | `4000 0000 0000 0259` | Too many attempts |

### Testing Payment Failures

```bash
# Use these cards at checkout to see how your app handles errors
# All cards work with any future expiry and any 3-digit CVC
```

## 🔐 3D Secure Authentication

Test Strong Customer Authentication (SCA) required in Europe and other regions:

| Card Number | Behavior |
|-------------|----------|
| `4000 0027 6000 3184` | Requires 3DS authentication (always succeeds) |
| `4000 0082 6000 3178` | Requires 3DS authentication (always succeeds) - UK |
| `4000 0002 5000 3155` | Requires 3DS authentication (can succeed or fail) |
| `4000 0082 6000 0016` | Declines with `authentication_required` error |

**Testing 3DS Flow:**
1. Use one of the 3DS test cards
2. Complete the subscription form
3. A test authentication modal will appear
4. Click "Complete" to pass or "Fail" to test failure
5. Verify your app handles both cases correctly

## 🧪 Automated Test Scenarios

### Critical Paths to Test

#### 1. Successful Subscription Flow ✅
```
User Journey:
1. Click "Subscribe for $1/month"
2. Fill in test card: 4242 4242 4242 4242
3. Submit payment
4. Redirected to success page
5. Subscription active in Stripe Dashboard

Expected: Customer receives confirmation, subscription shows as "active"
```

#### 2. Declined Payment Flow ❌
```
User Journey:
1. Click "Subscribe for $1/month"
2. Fill in decline card: 4000 0000 0000 0002
3. Submit payment
4. See error message
5. Remain on checkout page

Expected: Clear error message, user can try again
```

#### 3. International Customer (3DS) 🌍
```
User Journey:
1. Use card: 4000 0027 6000 3184
2. Complete subscription form
3. 3DS challenge appears
4. Complete authentication
5. Subscription succeeds

Expected: Smooth auth flow, subscription active
```

#### 4. Insufficient Funds 💰
```
User Journey:
1. Use card: 4000 0000 0000 9995
2. Submit payment
3. See "insufficient funds" error

Expected: Helpful error message suggesting another payment method
```

## 🔄 Subscription Lifecycle Testing

### Test Subscription States

Use Stripe's Test Clocks to simulate time-based events:

1. **Trial Period** - Subscription during trial
2. **Active** - Paid and active subscription
3. **Past Due** - Failed renewal payment
4. **Canceled** - User canceled subscription
5. **Incomplete** - Initial payment failed

### Testing Renewals

```bash
# In Stripe Dashboard:
# 1. Go to Developers > Test Clocks
# 2. Create a test clock
# 3. Advance time to test renewals without waiting 30 days
```

## 📊 Test Checklist

Use this checklist before shipping:

### Basic Functionality
- [ ] Successful subscription with US card (`4242...`)
- [ ] Subscribe button loads Stripe Checkout
- [ ] Success page shows after payment
- [ ] Cancel page shows when user backs out
- [ ] Subscription appears in Stripe Dashboard

### Error Handling
- [ ] Generic decline handled gracefully (`4000 0000 0000 0002`)
- [ ] Insufficient funds shows clear message (`4000 0000 0000 9995`)
- [ ] Expired card error handled (`4000 0000 0000 0069`)
- [ ] Network errors don't crash the app

### International Support
- [ ] UK customer can subscribe (`4000 0082 6000 0000`)
- [ ] Brazilian customer can subscribe (`4000 0076 4000 0002`)
- [ ] Indian customer completes 3DS (`4000 0356 0000 0008`)
- [ ] Australian customer can subscribe (`4000 0003 6000 0006`)
- [ ] Currency displays correctly (USD)

### 3D Secure
- [ ] 3DS modal appears for appropriate cards
- [ ] Successful 3DS auth completes subscription
- [ ] Failed 3DS auth shows error
- [ ] User can retry after failed auth

### Edge Cases
- [ ] Multiple rapid subscribe attempts handled
- [ ] Network timeout doesn't leave zombie subscriptions
- [ ] Browser back button doesn't cause issues
- [ ] Refresh during payment handled safely

### Production Readiness
- [ ] All test cards removed from documentation
- [ ] Environment variables set for production
- [ ] Error messages are user-friendly
- [ ] Success emails working (check spam folder)
- [ ] Webhook endpoints configured
- [ ] SSL/HTTPS enabled

## 🔧 Running Automated Tests

```bash
# Backend API tests
npm run test:api

# Frontend component tests  
npm run test:frontend

# End-to-end tests
npm run test:e2e

# Run all tests
npm test
```

## 📝 Manual Testing Script

Follow this script for thorough manual testing:

### Session 1: Happy Path (15 min)
1. Open production site
2. Click subscribe button
3. Use card: `4242 4242 4242 4242`
4. Complete checkout
5. ✅ Verify success page
6. ✅ Check Stripe Dashboard for subscription

### Session 2: Error Handling (20 min)
1. Test each decline card from the table above
2. ✅ Verify error messages are clear
3. ✅ Confirm user can retry
4. ✅ Check no subscriptions created in Stripe

### Session 3: International (20 min)
1. Test 3 cards from different countries
2. ✅ Complete 3DS flow where required
3. ✅ Verify all complete successfully

### Session 4: Edge Cases (15 min)
1. Click back button during checkout
2. Refresh page mid-payment
3. Try subscribing twice quickly
4. ✅ Confirm no duplicate subscriptions
5. ✅ Verify graceful error handling

## 🚨 Common Issues & Solutions

### Issue: "Failed to create checkout session"
**Solution:** Check backend environment variables, verify API keys are set correctly

### Issue: CORS error
**Solution:** Ensure `VITE_APP_URL` on backend matches frontend URL

### Issue: 3DS modal doesn't appear
**Solution:** Check that you're using 3DS test cards, not regular ones

### Issue: Webhook not firing
**Solution:** Verify webhook endpoint URL is accessible, check signing secret

## 📚 Additional Resources

- [Stripe Testing Docs](https://docs.stripe.com/testing)
- [Test Card Numbers](https://docs.stripe.com/testing#cards)
- [3D Secure Testing](https://docs.stripe.com/testing#regulatory-cards)
- [Test Clocks](https://docs.stripe.com/billing/testing/test-clocks)
- [Webhook Testing](https://docs.stripe.com/webhooks/test)

## 🦙 Ship with Confidence!

By following this guide and completing the test checklist, you can be confident that your Stripe integration will work smoothly for customers worldwide. Happy testing! ✨

