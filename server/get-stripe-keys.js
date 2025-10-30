import Stripe from 'stripe';
import 'dotenv/config';

// This script helps you verify your Stripe keys and get your publishable key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('🦙 LlamaTrip - Stripe Keys Checker\n');
console.log('=' .repeat(50));

// Check if secret key is set
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in .env file');
  process.exit(1);
}

console.log('✅ Secret key is configured');
console.log(`   Key: ${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...`);

// Try to retrieve account info
try {
  const account = await stripe.accounts.retrieve();
  console.log('\n✅ Stripe account connected successfully!');
  console.log(`   Account ID: ${account.id}`);
  console.log(`   Display Name: ${account.business_profile?.name || 'Not set'}`);
  console.log(`   Country: ${account.country}`);
  
  // Get publishable key from Stripe (you need to get this from dashboard)
  console.log('\n📝 To get your publishable key:');
  console.log('   1. Visit: https://dashboard.stripe.com/test/apikeys');
  console.log('   2. Copy the "Publishable key" (starts with pk_test_)');
  console.log('   3. Update VITE_STRIPE_PUBLISHABLE_KEY in your .env file');
  
  // Verify the price exists
  const priceId = process.env.VITE_STRIPE_PRICE_ID;
  if (priceId) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log('\n✅ Price configuration verified');
      console.log(`   Price ID: ${price.id}`);
      console.log(`   Amount: $${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()}`);
      console.log(`   Interval: ${price.recurring?.interval || 'one-time'}`);
    } catch (err) {
      console.error('\n❌ Error retrieving price:', err.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Setup is complete! Run "npm run dev:all" to start.');
  
} catch (error) {
  console.error('\n❌ Error connecting to Stripe:', error.message);
  console.log('\nPlease check:');
  console.log('  1. Your STRIPE_SECRET_KEY is correct');
  console.log('  2. You have internet connection');
  console.log('  3. Your Stripe account is active');
  process.exit(1);
}

