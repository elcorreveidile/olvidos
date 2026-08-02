/**
 * Prueba del helper real de envío del formulario de contacto.
 * Ejercita src/lib/email.ts → sendContactEmail (la misma ruta que usa la web).
 *
 * Uso (con remitente de pruebas y destino permitido en modo test):
 *   EMAIL_FROM=onboarding@resend.dev CONTACT_TO=javier@blablaele.com \
 *     npx tsx --env-file=.env.local scripts/test-contact-send.ts
 */
import { sendContactEmail } from "../src/lib/email";

async function main() {
  const res = await sendContactEmail({
    name: "Prueba de contacto",
    email: "remitente@example.com",
    message: "Mensaje de prueba enviado por el helper real.",
  });
  console.log("Resultado:", res);
  process.exit(res.ok ? 0 : 1);
}

main();
