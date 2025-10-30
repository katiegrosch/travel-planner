/**
 * LlamaTrip Stripe API Tests
 * 
 * These tests verify the subscription checkout flow works correctly
 * for various payment scenarios including international customers.
 */

import request from 'supertest';
import Stripe from 'stripe';

// Mock Stripe to avoid hitting real API in tests
jest.mock('stripe');

describe('Stripe Checkout API', () => {
  let app;
  let mockStripeCheckoutSessions;
  
  beforeAll(async () => {
    // Import app after mocks are set up
    const appModule = await import('../index.js');
    app = appModule.default;
  });
  
  beforeEach(() => {
    // Reset mocks before each test
    mockStripeCheckoutSessions = {
      create: jest.fn(),
      retrieve: jest.fn(),
    };
    
    Stripe.mockImplementation(() => ({
      checkout: {
        sessions: mockStripeCheckoutSessions,
      },
    }));
  });

  describe('POST /api/create-checkout-session', () => {
    
    it('should create a checkout session with valid price ID', async () => {
      const mockSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/test',
      };
      
      mockStripeCheckoutSessions.create.mockResolvedValue(mockSession);
      
      const response = await request(app)
        .post('/api/create-checkout-session')
        .send({ priceId: 'price_1SNxufCjsf6yCGkxwczjXinG' })
        .expect(200);
      
      expect(response.body).toEqual({
        sessionId: 'cs_test_123',
        url: 'https://checkout.stripe.com/test',
      });
      
      expect(mockStripeCheckoutSessions.create).toHaveBeenCalledWith({
        mode: 'subscription',
        line_items: [{
          price: 'price_1SNxufCjsf6yCGkxwczjXinG',
          quantity: 1,
        }],
        success_url: expect.stringContaining('/success'),
        cancel_url: expect.stringContaining('/cancel'),
        billing_address_collection: 'auto',
        metadata: {
          product: 'LlamaTrip Travel Planning',
        },
      });
    });

    it('should return 400 if price ID is missing', async () => {
      const response = await request(app)
        .post('/api/create-checkout-session')
        .send({})
        .expect(400);
      
      expect(response.body.error).toBe('Price ID is required');
    });

    it('should handle Stripe API errors gracefully', async () => {
      mockStripeCheckoutSessions.create.mockRejectedValue(
        new Error('Invalid price ID')
      );
      
      const response = await request(app)
        .post('/api/create-checkout-session')
        .send({ priceId: 'invalid_price' })
        .expect(500);
      
      expect(response.body.error).toBe('Failed to create checkout session');
    });
  });

  describe('GET /api/checkout-session/:sessionId', () => {
    
    it('should retrieve session details', async () => {
      const mockSession = {
        id: 'cs_test_123',
        status: 'complete',
        customer_details: {
          email: 'test@example.com',
        },
        amount_total: 100,
        currency: 'usd',
        subscription: 'sub_123',
      };
      
      mockStripeCheckoutSessions.retrieve.mockResolvedValue(mockSession);
      
      const response = await request(app)
        .get('/api/checkout-session/cs_test_123')
        .expect(200);
      
      expect(response.body).toEqual({
        status: 'complete',
        customer_email: 'test@example.com',
        amount_total: 100,
        currency: 'usd',
        subscription: 'sub_123',
      });
    });

    it('should handle invalid session ID', async () => {
      mockStripeCheckoutSessions.retrieve.mockRejectedValue(
        new Error('No such checkout session')
      );
      
      const response = await request(app)
        .get('/api/checkout-session/invalid_session')
        .expect(500);
      
      expect(response.body.error).toBe('Failed to retrieve session');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toEqual({
        status: 'ok',
        service: 'LlamaTrip Payments API',
      });
    });
  });
});

/*
 * Integration Test Scenarios
 * 
 * These tests should be run manually with real Stripe test cards:
 * 
 * 1. Successful Subscription (US):
 *    Card: 4242 4242 4242 4242
 *    Expected: Checkout succeeds, subscription created
 * 
 * 2. Generic Decline:
 *    Card: 4000 0000 0000 0002
 *    Expected: Payment declined gracefully
 * 
 * 3. Insufficient Funds:
 *    Card: 4000 0000 0000 9995
 *    Expected: Clear error about insufficient funds
 * 
 * 4. 3D Secure (International - India):
 *    Card: 4000 0356 0000 0008
 *    Expected: 3DS modal appears, completes after auth
 * 
 * 5. International (UK):
 *    Card: 4000 0082 6000 0000
 *    Expected: Subscription succeeds
 * 
 * 6. International (Brazil):
 *    Card: 4000 0076 4000 0002
 *    Expected: Subscription succeeds
 */

