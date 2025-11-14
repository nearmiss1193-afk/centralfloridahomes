import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn('[Stripe] Secret key not configured');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const SUBSCRIPTION_PLANS = {
  starter: { name: 'Starter', price: 19900, leadsPerMonth: 10 },
  professional: { name: 'Professional', price: 29900, leadsPerMonth: 30 },
  premium: { name: 'Premium', price: 44900, leadsPerMonth: 100 },
};

export async function createCustomer(data: any) {
  try {
    return await stripe.customers.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
    });
  } catch (error) {
    console.error('[Stripe] Error creating customer:', error);
    throw error;
  }
}

export async function createPaymentIntent(data: any) {
  try {
    return await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency || 'usd',
      customer: data.customerId,
      description: data.description,
    });
  } catch (error) {
    console.error('[Stripe] Error creating payment intent:', error);
    throw error;
  }
}
