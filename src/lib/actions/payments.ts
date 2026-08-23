"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const PaymentSchema = z.object({
  memberId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default("EUR"),
  type: z.enum(["MEMBERSHIP_FEE", "EVENT_TICKET", "DONATION", "OTHER"]),
  description: z.string().optional(),
  periodStart: z.date().optional(),
  periodEnd: z.date().optional(),
});

export type PaymentInput = z.infer<typeof PaymentSchema>;

// Check if user has admin permission
async function checkAdminPermission() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autenticado");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "MEMBER_ADMIN")) {
    throw new Error("No tienes permiso para realizar esta acción");
  }

  return session.user.id;
}

// Create payment manually (admin only)
export async function createPayment(data: PaymentInput) {
  try {
    await checkAdminPermission();

    // Validate data
    const validatedData = PaymentSchema.parse(data);

    // Check if member exists
    const member = await db.member.findUnique({
      where: { id: validatedData.memberId },
    });

    if (!member) {
      throw new Error("El socio no existe");
    }

    // Create payment
    const payment = await db.payment.create({
      data: {
        memberId: validatedData.memberId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        type: validatedData.type,
        description: validatedData.description,
        periodStart: validatedData.periodStart,
        periodEnd: validatedData.periodEnd,
        status: "COMPLETED",
        paidAt: new Date(),
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    // Update member status if needed
    if (member.status !== "ACTIVE") {
      await db.member.update({
        where: { id: validatedData.memberId },
        data: {
          status: "ACTIVE",
        },
      });
    }

    revalidatePath("/admin/pagos");
    revalidatePath(`/admin/socios/${validatedData.memberId}`);

    return { success: true, payment };
  } catch (error) {
    console.error("Error creating payment:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear el pago",
    };
  }
}

// Get payments by member
export async function getMemberPayments(memberId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("No autenticado");
    }

    // Check if user is the member or an admin
    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { user: true },
    });

    if (!member) {
      throw new Error("Socio no encontrado");
    }

    const isAdmin =
      session.user.role === "ADMIN" ||
      session.user.role === "MEMBER_ADMIN";

    if (member.userId !== session.user.id && !isAdmin) {
      throw new Error("No tienes permiso para ver estos pagos");
    }

    const payments = await db.payment.findMany({
      where: { memberId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, payments };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener los pagos",
    };
  }
}

// Get all payments with filters (admin only)
export async function getPayments(filters?: {
  memberId?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await checkAdminPermission();

    const memberId = filters?.memberId;
    const status = filters?.status;
    const type = filters?.type;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (memberId) {
      where.memberId = memberId;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (type && type !== "all") {
      where.type = type;
    }

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.payment.count({ where }),
    ]);

    return {
      success: true,
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener los pagos",
    };
  }
}

// Get payment by ID
export async function getPayment(id: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("No autenticado");
    }

    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payment) {
      throw new Error("Pago no encontrado");
    }

    // Check permissions
    const isAdmin =
      session.user.role === "ADMIN" ||
      session.user.role === "MEMBER_ADMIN";

    if (payment.member.userId !== session.user.id && !isAdmin) {
      throw new Error("No tienes permiso para ver este pago");
    }

    return { success: true, payment };
  } catch (error) {
    console.error("Error fetching payment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener el pago",
    };
  }
}

// Refund payment (admin only)
export async function refundPayment(id: string) {
  try {
    await checkAdminPermission();

    const payment = await db.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new Error("Pago no encontrado");
    }

    if (payment.status === "REFUNDED") {
      throw new Error("El pago ya está reembolsado");
    }

    // Refund in Stripe if it's a Stripe payment
    if (payment.stripePaymentId) {
      await stripe.refunds.create({
        payment_intent: payment.stripePaymentId,
      });
    }

    // Update payment status
    const updatedPayment = await db.payment.update({
      where: { id },
      data: {
        status: "REFUNDED",
      },
    });

    revalidatePath("/admin/pagos");
    revalidatePath(`/admin/socios/${payment.memberId}`);

    return { success: true, payment: updatedPayment };
  } catch (error) {
    console.error("Error refunding payment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al reembolsar el pago",
    };
  }
}
