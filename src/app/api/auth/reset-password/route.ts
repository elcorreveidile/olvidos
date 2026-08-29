import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const resetPasswordSchema = z.object({
  email: z.string().email("Email no válido"),
  token: z.string().min(1, "Token inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, token, password } = resetPasswordSchema.parse(body);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const verificationToken = await db.verificationToken.findFirst({
      where: {
        identifier: email,
        token: hashedToken,
        type: "PASSWORD_RESET",
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "El enlace es inválido o ha caducado" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Cambiar la contraseña e invalidar las sesiones JWT ya emitidas: subir
    // tokenVersion hace que el callback jwt cierre las sesiones antiguas.
    // (La sesión es JWT: `session.deleteMany` no borraba nada, era un no-op.)
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });

    await db.verificationToken.deleteMany({
      where: { identifier: email, type: "PASSWORD_RESET" },
    });

    return NextResponse.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Datos no válidos" }, { status: 400 });
    }

    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "No se pudo restablecer la contraseña" }, { status: 500 });
  }
}
