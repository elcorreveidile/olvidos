"use server";

import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { readHumanCheck, verifyHumanCheck } from "@/lib/human-check";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Indica al cliente que regenere la operación de verificación. */
  regenerate?: boolean;
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Indica tu nombre.").max(120),
  email: z.string().trim().email("El email no es válido."),
  message: z.string().trim().min(5, "Escribe un mensaje.").max(5000),
});

/**
 * Procesa el formulario de contacto:
 * 1) honeypot anti-bots, 2) verificación humana (operación matemática)
 * REVALIDADA en servidor, 3) validación de campos, 4) envío por Resend.
 */
export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // 1+2) Honeypot (si viene relleno, es bot → fingimos éxito) y verificación
  // humana revalidada en el servidor (no confiamos en el cliente).
  const check = verifyHumanCheck(readHumanCheck(formData));
  if (!check.ok) {
    if (check.reason === "honeypot") {
      return { status: "success" };
    }
    return {
      status: "error",
      message: "La verificación no es correcta. Prueba con la nueva operación.",
      regenerate: true,
    };
  }

  // 3) Validación de campos.
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.errors[0]?.message ?? "Revisa los campos del formulario.",
    };
  }

  // 4) Envío.
  const result = await sendContactEmail(parsed.data);
  if (!result.ok) {
    if (result.reason === "no-resend") {
      return {
        status: "error",
        message:
          "El envío de correo aún no está configurado. Escríbenos directamente a olvidosdegranada@gmail.com.",
        regenerate: true,
      };
    }
    return {
      status: "error",
      message:
        "No se pudo enviar el mensaje en este momento. Inténtalo de nuevo más tarde.",
      regenerate: true,
    };
  }

  return { status: "success" };
}
