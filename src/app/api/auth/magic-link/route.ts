import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db } from "@/lib/db";
import { readHumanCheck, verifyHumanCheck } from "@/lib/human-check";
import { sendMagicLinkEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Indica tu nombre.").max(120),
  email: z.string().trim().toLowerCase().email("El email no es válido."),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 1) Verificación humana (honeypot + operación matemática) en servidor.
    const check = verifyHumanCheck(readHumanCheck(formData));
    if (!check.ok) {
      // Honeypot: probable bot → fingimos éxito y no hacemos nada.
      if (check.reason === "honeypot") {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: "challenge" }, { status: 400 });
    }

    // 2) Datos.
    const parsed = schema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Datos no válidos" },
        { status: 400 }
      );
    }
    const { name, email } = parsed.data;

    // 3) Alta sin contraseña: crea el usuario (rol USER) si no existe.
    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      user = await db.user.create({ data: { email, name, role: "USER" } });
    } else if (!user.name && name) {
      user = await db.user.update({ where: { id: user.id }, data: { name } });
    }

    // 4) Token de un solo uso (1 hora), guardado hasheado (SHA-256).
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await db.verificationToken.deleteMany({ where: { identifier: email } });
    await db.verificationToken.create({
      data: { identifier: email, token: hashedToken, expires },
    });

    // 5) Envío del enlace.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicUrl = `${appUrl}/login/magico?token=${rawToken}&email=${encodeURIComponent(
      email
    )}`;
    await sendMagicLinkEmail(email, user.name || name, magicUrl);

    // Respuesta genérica (no revela si el email existía).
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[magic-link] error:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud" },
      { status: 500 }
    );
  }
}
