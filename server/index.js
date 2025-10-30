import Stripe from 'stripe';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:8080'
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LlamaTrip Payments API' });
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId } = req.body;

    // Validate price ID
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.VITE_APP_URL}/?subscribed=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/?subscribed=cancelled`,
      billing_address_collection: 'auto',
      metadata: {
        product: 'LlamaTrip Travel Planning'
      }
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
});

// Retrieve checkout session details (for success page)
app.get('/api/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription']
    });

    res.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
      subscription: session.subscription
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve session',
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🦙 LlamaTrip Payments API running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

