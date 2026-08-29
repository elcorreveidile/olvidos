import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email no válido"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });

    // Always return success message to prevent user enumeration
    const successResponse = NextResponse.json({
      success: true,
      message: "Si existe una cuenta con ese correo, te enviaremos instrucciones para restablecer la contraseña.",
    });

    if (!user || !user.password) {
      return successResponse;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Solo se limpian/crean tokens de reset (no se pisa un enlace mágico en curso).
    await db.verificationToken.deleteMany({
      where: { identifier: email, type: "PASSWORD_RESET" },
    });
    await db.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
        type: "PASSWORD_RESET",
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/restablecer-contrasena?token=${rawToken}&email=${encodeURIComponent(email)}`;

    await sendPasswordResetEmail(email, user.name || "", resetUrl);

    return successResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Datos no válidos" }, { status: 400 });
    }

    console.error("Error requesting password reset:", error);
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 });
  }
}
