import Stripe from 'stripe';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import * as Sentry from '@sentry/node';

// Initialize Sentry BEFORE creating the Express app
Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0, // Capture 100% of transactions
  // Performance monitoring
  integrations: [
    // Enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // Enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
});

const app = express();

// RequestHandler creates a separate execution context using domains
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:8080'
}));

// Webhook endpoint needs raw body - must come BEFORE express.json()
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  console.log(`📬 Received event: ${event.type} [${event.id}]`);

  try {
    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log('✅ New subscription created:', subscription.id);
        console.log('   Customer:', subscription.customer);
        console.log('   Status:', subscription.status);
        // TODO: Save subscription to your database
        // TODO: Grant customer access to premium features
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('🔄 Subscription updated:', subscription.id);
        console.log('   Status:', subscription.status);
        console.log('   Current period end:', new Date(subscription.current_period_end * 1000));
        // TODO: Update subscription status in your database
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('❌ Subscription cancelled:', subscription.id);
        console.log('   Customer:', subscription.customer);
        // TODO: Revoke customer access
        // TODO: Update database to mark subscription as cancelled
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('💰 Payment succeeded for invoice:', invoice.id);
        console.log('   Amount:', `$${invoice.amount_paid / 100} ${invoice.currency.toUpperCase()}`);
        console.log('   Customer:', invoice.customer);
        // TODO: Send receipt email
        // TODO: Extend subscription access
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('💥 Payment failed for invoice:', invoice.id);
        console.log('   Customer:', invoice.customer);
        console.log('   Amount due:', `$${invoice.amount_due / 100} ${invoice.currency.toUpperCase()}`);
        // TODO: Send payment failure email to customer
        // TODO: Notify customer to update payment method
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object;
        console.log('⏰ Trial ending soon for subscription:', subscription.id);
        console.log('   Trial ends:', new Date(subscription.trial_end * 1000));
        // TODO: Send reminder email
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('💳 Payment intent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('❌ Payment intent failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`⚪ Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt of event
    res.json({received: true, eventType: event.type});
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Still return 200 to prevent Stripe from retrying
    res.status(200).json({received: true, error: error.message});
  }
});

// All other routes use JSON middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LlamaTrip Payments API' });
});

// Sentry test endpoint
app.get('/api/sentry-test', (req, res) => {
  // This will be caught by Sentry's error handler
  throw new Error('🦙 Backend Sentry Test Error - This is intentional!');
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

// The Sentry error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional: Add custom error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🦙 LlamaTrip Payments API running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.SENTRY_DSN_BACKEND) {
    console.log('✅ Sentry initialized for backend');
  } else {
    console.warn('⚠️  Sentry DSN not configured for backend');
  }
});

