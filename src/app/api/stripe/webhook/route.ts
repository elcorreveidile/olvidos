import { stripe, MEMBERSHIP_PLANS, type MembershipPlan } from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendWelcomeEmail } from "@/lib/email";
import { recordPaymentInLedger } from "@/lib/ledger";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Webhook de Stripe.
 *
 * Stripe reintenta la entrega si no respondemos 2xx y puede enviar el mismo
 * evento más de una vez, así que cada `event.id` se **reclama** en la tabla
 * `StripeEvent` antes de procesarlo: si ya estaba, se responde 200 sin hacer
 * nada. Si el procesado falla, se libera la reclamación y se responde 500 para
 * que Stripe lo reintente. Pago y apunte contable se guardan en la misma
 * transacción; el correo de bienvenida solo se envía cuando el socio pasa a
 * ACTIVE (no en renovaciones ni en reintentos).
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature provided" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Deduplicación por event.id: createMany + skipDuplicates es atómico.
  const claimed = await db.stripeEvent.createMany({
    data: { id: event.id, type: event.type },
    skipDuplicates: true,
  });
  if (claimed.count === 0) {
    console.log(`Stripe event ${event.id} (${event.type}) ya procesado; se ignora`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  console.log(`Processing webhook event: ${event.type} (${event.id})`);

  try {
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
    console.error(`Error processing webhook ${event.id}:`, error);
    // Liberamos la reclamación para que el reintento de Stripe vuelva a procesarlo.
    await db.stripeEvent.deleteMany({ where: { id: event.id } }).catch((e) => {
      console.error("No se pudo liberar el evento de Stripe:", e);
    });
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 });
  }
}

/** Crea el pago y su apunte contable juntos. No hace nada si el pago ya existe. */
async function createPaymentWithLedger(data: Prisma.PaymentUncheckedCreateInput): Promise<boolean> {
  return db.$transaction(async (tx) => {
    const existing = await tx.payment.findUnique({
      where: { stripePaymentId: data.stripePaymentId as string },
      select: { id: true },
    });
    if (existing) return false;
    const payment = await tx.payment.create({ data });
    await recordPaymentInLedger(payment, tx);
    return true;
  });
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
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
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

  const before = await db.member.findUnique({
    where: { id: memberId },
    select: { status: true },
  });
  if (!before) {
    console.error(`Member ${memberId} not found for checkout session`);
    return;
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

  // Correo de bienvenida solo en el alta (no en renovaciones). No hace nada si
  // falta Resend. La deduplicación por event.id evita reenviarlo en reintentos.
  if (before.status === "ACTIVE") return;
  try {
    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { user: { select: { email: true, name: true } } },
    });
    if (member) {
      await sendWelcomeEmail(member.user.email, member.user.name || "Socio", member.memberNumber);
    }
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

  // Get member from Stripe customer
  const customer = await stripe.customers.retrieve(paymentIntent.customer as string);
  const memberId = (customer as any).metadata?.memberId;

  if (memberId) {
    await createPaymentWithLedger({
      memberId,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: "COMPLETED",
      type: "MEMBERSHIP_FEE",
      stripePaymentId: paymentIntent.id,
      paidAt: new Date(paymentIntent.created * 1000),
    });
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log(`Subscription created: ${subscription.id}`);

  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const memberId = (customer as any).metadata?.memberId;

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

  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const memberId = (customer as any).metadata?.memberId;

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
  const memberId = (customer as any).metadata?.memberId;

  if (memberId && invoice.payment_intent) {
    await createPaymentWithLedger({
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
    });

    // Update renewal date
    await db.member.update({
      where: { id: memberId },
      data: {
        renewalDate: new Date(invoice.period_end * 1000),
      },
    });
  }
}
