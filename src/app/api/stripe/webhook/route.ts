import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";

// Initialize Resend (optional - only if RESEND_API_KEY is configured)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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
      {
        error: "Error processing webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { memberId, userId, membershipLevel } = session.metadata;

  if (!memberId) {
    console.error("No memberId in session metadata");
    return;
  }

  // Update member status
  await db.member.update({
    where: { id: memberId },
    data: {
      status: "ACTIVE",
      membershipLevel: membershipLevel || "STANDARD",
      renewalDate: new Date(session.subscription.current_period_end * 1000),
    },
  });

  console.log(`Member ${memberId} activated from checkout session`);

  // Send welcome email (if Resend is configured)
  if (resend) {
    try {
      const member = await db.member.findUnique({
        where: { id: memberId },
        include: { user: true },
      });

      if (member) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "noreply@olvidosdegranada.com",
          to: member.user.email,
          subject: "Bienvenido a Olvidos de Granada",
          html: `
            <h1>¡Bienvenido a Olvidos de Granada!</h1>
            <p>Hola ${member.user.name || "Socio"},</p>
            <p>Tu membresía ha sido activada exitosamente. Ya eres parte de la Asociación Cultural Olvidos de Granada.</p>
            <p>Número de socio: <strong>${member.memberNumber}</strong></p>
            <p>Puedes acceder a tu área privada en:</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/mi-cuenta">Mi Cuenta</a></p>
            <p>¡Gracias por tu apoyo!</p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }
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
    await db.payment.create({
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
      // Determine membership level from price
      const priceId = subscription.items.data[0].price.id;
      const membershipLevel =
        priceId === process.env.STRIPE_PRICE_COLLABORATOR
          ? "COLLABORATOR"
          : "STANDARD";

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
      await db.payment.create({
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
