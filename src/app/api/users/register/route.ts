import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const registerUserSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const data = registerUserSchema.parse(rawBody);

    const existingUser = await db.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email. Inicia sesión para continuar." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      { success: true, message: "Cuenta creada correctamente" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Datos no válidos" },
        { status: 400 }
      );
    }

    console.error("Error in user registration:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al registrar usuario",
      },
      { status: 500 }
    );
  }
}
