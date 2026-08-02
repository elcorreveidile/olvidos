import { stripe, membershipLineItem, isMembershipPlan } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!isMembershipPlan(plan)) {
      return NextResponse.json(
        { error: "Plan de socio no válido" },
        { status: 400 }
      );
    }

    // Get or create member
    let member = await db.member.findUnique({
      where: { userId: session.user.id },
    });

    // If member doesn't exist, create a pending one
    if (!member) {
      member = await db.member.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
        },
      });
    }

    // Create or get Stripe customer
    let customerId = member.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: session.user.name || undefined,
        metadata: {
          memberId: member.id,
          userId: session.user.id,
        },
      });

      customerId = customer.id;

      // Update member with Stripe customer ID
      await db.member.update({
        where: { id: member.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const membershipLevel = plan;

    // Create checkout session (precio creado al vuelo con price_data)
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [membershipLineItem(plan)],
      metadata: {
        memberId: member.id,
        userId: session.user.id,
        membershipLevel,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/mi-cuenta?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/hazte-socio?canceled=true`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
