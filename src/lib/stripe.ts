import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
    }
    _stripe = new Stripe(key, {
      // @ts-expect-error type override
      apiVersion: '2023-10-16',
      appInfo: {
        name: 'TechStackEngine',
        version: '0.1.0',
      },
    });
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead — kept for backwards compatibility */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
