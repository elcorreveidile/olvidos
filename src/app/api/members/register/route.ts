import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { stripe, MEMBERSHIP_PRICES } from "@/lib/stripe";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email no valido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  plan: z.enum(["STANDARD", "COLLABORATOR", "HONORARY"]),
});

function getAppUrl(req: Request) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const data = registerSchema.parse(rawBody);

    const allowRegistrationsConfig = await db.siteConfig.findUnique({
      where: { key: "members.allowRegistrations" },
      select: { value: true },
    });

    const allowRegistrations =
      (allowRegistrationsConfig?.value || "true") === "true";

    if (!allowRegistrations) {
      return NextResponse.json(
        { error: "Las inscripciones estan desactivadas temporalmente" },
        { status: 403 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        password: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "Ya existe una cuenta con ese email. Inicia sesion para continuar.",
        },
        { status: 409 }
      );
    }

    const priceId =
      data.plan === "COLLABORATOR"
        ? MEMBERSHIP_PRICES.COLLABORATOR
        : data.plan === "HONORARY"
          ? MEMBERSHIP_PRICES.HONORARY
          : MEMBERSHIP_PRICES.STANDARD;

    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "El plan seleccionado no esta configurado en Stripe. Contacta con administracion.",
        },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const created = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: "MEMBER",
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          membershipLevel: data.plan,
          status: "PENDING",
        },
      });

      return { user, member };
    });

    const customer = await stripe.customers.create({
      email: created.user.email,
      name: created.user.name || undefined,
      metadata: {
        memberId: created.member.id,
        userId: created.user.id,
      },
    });

    await db.member.update({
      where: { id: created.member.id },
      data: {
        stripeCustomerId: customer.id,
      },
    });

    const appUrl = getAppUrl(req);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        memberId: created.member.id,
        userId: created.user.id,
        membershipLevel: data.plan,
      },
      success_url: `${appUrl}/login?registro=ok`,
      cancel_url: `${appUrl}/registro-socio?cancelado=1`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "No se pudo crear la sesion de pago" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Datos no validos" },
        { status: 400 }
      );
    }

    console.error("Error in member registration:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al registrar socio",
      },
      { status: 500 }
    );
  }
}

