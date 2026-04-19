import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[STRIPE_WEBHOOK_ERROR]`, message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    // TODO: use session.subscription when Stripe is wired up

    if (userId) {
      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: session.customer,
          subscription_tier: 'pro',
        })
        .eq('id', userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const customer = event.data.object as Stripe.Subscription;
    await supabase
      .from('profiles')
      .update({
        subscription_tier: 'free',
      })
      .eq('stripe_customer_id', customer.customer);
  }

  return new NextResponse('OK', { status: 200 });
}
