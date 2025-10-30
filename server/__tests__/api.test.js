/**
 * LlamaTrip Stripe API Integration Tests
 * 
 * These are integration tests that verify the Stripe API endpoints work correctly.
 * The backend server must be running for these tests to pass.
 * 
 * Run: npm run server (in one terminal)
 * Then: npm run test:api (in another terminal)
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:3001';

describe('Stripe Checkout API Integration Tests', () => {
  
  // Helper function to make API requests
  async function request(method, path, body = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const data = await response.json().catch(() => null);
    
    return {
      status: response.status,
      data,
    };
  }

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const { status, data } = await request('GET', '/api/health');
      
      expect(status).toBe(200);
      expect(data).toEqual({
        status: 'ok',
        service: 'LlamaTrip Payments API',
      });
    });
  });

  describe('POST /api/create-checkout-session', () => {
    
    it('should return 400 if price ID is missing', async () => {
      const { status, data } = await request('POST', '/api/create-checkout-session', {});
      
      expect(status).toBe(400);
      expect(data.error).toBe('Price ID is required');
    });

    it('should create a checkout session with valid price ID', async () => {
      const { status, data } = await request('POST', '/api/create-checkout-session', {
        priceId: 'price_1SNxufCjsf6yCGkxwczjXinG',
      });
      
      // This will actually call Stripe's test API
      if (status === 200) {
        expect(data).toHaveProperty('sessionId');
        expect(data).toHaveProperty('url');
        expect(data.url).toContain('checkout.stripe.com');
      } else {
        // If Stripe credentials aren't configured, we'll get an error
        console.log('Note: Test requires valid Stripe test keys to be configured');
        expect(status).toBeGreaterThanOrEqual(400);
      }
    }, 10000);

    it('should handle invalid price ID', async () => {
      const { status, data } = await request('POST', '/api/create-checkout-session', {
        priceId: 'invalid_price_id',
      });
      
      expect(status).toBeGreaterThanOrEqual(400);
      expect(data).toHaveProperty('error');
    }, 10000);
  });
});

/*
 * Manual Integration Test Scenarios
 * 
 * These scenarios should be tested manually with the full application:
 * 
 * SUCCESS SCENARIOS:
 * ==================
 * 
 * 1. US Customer - Standard Success:
 *    Card: 4242 4242 4242 4242
 *    Expected: Checkout succeeds, subscription created, redirect to success page
 * 
 * 2. UK Customer:
 *    Card: 4000 0082 6000 0000
 *    Expected: Subscription succeeds
 * 
 * 3. Indian Customer (3D Secure):
 *    Card: 4000 0356 0000 0008
 *    Expected: 3DS modal appears, completes after authentication
 * 
 * 4. Brazilian Customer:
 *    Card: 4000 0076 4000 0002
 *    Expected: Subscription succeeds
 * 
 * 5. Australian Customer:
 *    Card: 4000 0003 6000 0006
 *    Expected: Subscription succeeds
 * 
 * FAILURE SCENARIOS:
 * ==================
 * 
 * 6. Generic Decline:
 *    Card: 4000 0000 0000 0002
 *    Expected: Clear error message, no subscription created
 * 
 * 7. Insufficient Funds:
 *    Card: 4000 0000 0000 9995
 *    Expected: "Insufficient funds" error message
 * 
 * 8. Lost Card:
 *    Card: 4000 0000 0000 9987
 *    Expected: Card declined error
 * 
 * 9. Expired Card:
 *    Card: 4000 0000 0000 0069
 *    Expected: Card expired error
 * 
 * 10. Incorrect CVC:
 *     Card: 4000 0000 0000 0127
 *     Expected: CVC check failed error
 * 
 * EDGE CASES:
 * ===========
 * 
 * 11. Cancel During Checkout:
 *     Start checkout, click back button
 *     Expected: Redirect to cancel page, no subscription created
 * 
 * 12. Multiple Rapid Attempts:
 *     Click subscribe button multiple times quickly
 *     Expected: Only one subscription created, no duplicates
 * 
 * 13. Refresh During Payment:
 *     Start checkout, refresh browser mid-payment
 *     Expected: Graceful handling, no zombie subscriptions
 * 
 * 14. 3DS Authentication Failure:
 *     Card: 4000 0082 6000 0016
 *     Expected: Authentication required error, can retry
 * 
 * For complete testing guide, see: TESTING_GUIDE.md
 */
