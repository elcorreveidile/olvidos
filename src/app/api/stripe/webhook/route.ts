import { stripe, MEMBERSHIP_PLANS, type MembershipPlan } from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendWelcomeEmail } from "@/lib/email";
import { recordPaymentInLedger } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { memberId, membershipLevel } = session.metadata;

  if (!memberId) {
    console.error("No memberId in session metadata");
    return;
  }

  // Resolve renewal date safely. In checkout.session.completed, `subscription`
  // may be an ID string (or absent) depending on event payload expansion.
  let renewalDate: Date | null = null;

  if (session.subscription) {
    if (typeof session.subscription === "string") {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );
        renewalDate = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null;
      } catch (error) {
        console.error("Failed to retrieve subscription from checkout session:", error);
      }
    } else if (session.subscription.current_period_end) {
      renewalDate = new Date(session.subscription.current_period_end * 1000);
    }
  }

  // Update member status
  await db.member.update({
    where: { id: memberId },
    data: {
      status: "ACTIVE",
      membershipLevel: membershipLevel || "STANDARD",
      renewalDate,
    },
  });

  console.log(`Member ${memberId} activated from checkout session`);

  // Correo de bienvenida (con plantilla de marca; no hace nada si falta Resend).
  try {
    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { user: true },
    });
    if (member) {
      await sendWelcomeEmail(
        member.user.email,
        member.user.name || "Socio",
        member.memberNumber
      );
    }
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

  // Create payment record if not already exists
  const existingPayment = await db.payment.findUnique({
    where: { stripePaymentId: paymentIntent.id },
  });

  if (existingPayment) {
    return;
  }

  // Get member from Stripe customer
  const customer = await stripe.customers.retrieve(
    paymentIntent.customer as string
  );

  const memberId = (customer as any).metadata.memberId;

  if (memberId) {
    const payment = await db.payment.create({
      data: {
        memberId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: "COMPLETED",
        type: "MEMBERSHIP_FEE",
        stripePaymentId: paymentIntent.id,
        paidAt: new Date(paymentIntent.created * 1000),
      },
    });
    await recordPaymentInLedger(payment);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log(`Subscription created: ${subscription.id}`);

  const customer = await stripe.customers.retrieve(
    subscription.customer as string
  );
  const memberId = (customer as any).metadata.memberId;

  if (memberId) {
    const member = await db.member.findUnique({
      where: { id: memberId },
    });

    if (member) {
      // El precio se crea al vuelo (price_data), así que deducimos el nivel por
      // el importe, o del metadata de la suscripción si está disponible.
      const amount = subscription.items.data[0].price.unit_amount as number;
      const membershipLevel: MembershipPlan =
        (subscription.metadata?.membershipLevel as MembershipPlan) ||
        (Object.keys(MEMBERSHIP_PLANS) as MembershipPlan[]).find(
          (k) => MEMBERSHIP_PLANS[k].amount === amount
        ) ||
        "STANDARD";

      await db.member.update({
        where: { id: memberId },
        data: {
          status: "ACTIVE",
          membershipLevel,
          renewalDate: new Date(subscription.current_period_end * 1000),
        },
      });
    }
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log(`Subscription deleted: ${subscription.id}`);

  const customer = await stripe.customers.retrieve(
    subscription.customer as string
  );
  const memberId = (customer as any).metadata.memberId;

  if (memberId) {
    await db.member.update({
      where: { id: memberId },
      data: {
        status: "EXPIRED",
      },
    });
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log(`Invoice payment succeeded: ${invoice.id}`);

  const customer = await stripe.customers.retrieve(invoice.customer as string);
  const memberId = (customer as any).metadata.memberId;

  if (memberId && invoice.payment_intent) {
    // Check if payment already exists
    const existingPayment = await db.payment.findUnique({
      where: { stripePaymentId: invoice.payment_intent as string },
    });

    if (!existingPayment) {
      const payment = await db.payment.create({
        data: {
          memberId,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency.toUpperCase(),
          status: "COMPLETED",
          type: "MEMBERSHIP_FEE",
          stripePaymentId: invoice.payment_intent as string,
          stripeInvoiceId: invoice.id,
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          paidAt: new Date(invoice.status_transitions.paid_at * 1000),
        },
      });
      await recordPaymentInLedger(payment);
    }

    // Update renewal date
    await db.member.update({
      where: { id: memberId },
      data: {
        renewalDate: new Date(invoice.period_end * 1000),
      },
    });
  }
}
