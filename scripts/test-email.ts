/**
 * Prueba de envío con Resend. Uso: npx tsx scripts/test-email.ts [destino]
 * Envía un correo de bienvenida y muestra la respuesta cruda de la API.
 */
import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "info@olvidosdegranada.es";
const to = process.argv[2] || "javier@blablaele.com";

async function main() {
  console.log("RESEND_API_KEY presente:", key ? `sí (${key.slice(0, 6)}…)` : "NO");
  console.log("from:", from);
  console.log("to:  ", to);

  if (!key) {
    console.log("\n❌ No hay clave: Resend no está configurado.");
    process.exit(1);
  }

  const resend = new Resend(key);
  const res = await resend.emails.send({
    from,
    to,
    subject: "Prueba de envío — Olvidos de Granada",
    html: "<p>Esto es una prueba para verificar que Resend funciona. Si lo recibes, funciona ✅.</p>",
  });

  console.log("\nRespuesta de Resend:");
  console.dir(res, { depth: 5 });

  if (res.error) {
    console.log("\n❌ Error de Resend:", res.error.message);
    process.exit(1);
  }
  console.log("\n✅ Enviado. id:", res.data?.id);
}

main().catch((e) => {
  console.error("❌ Excepción:", e);
  process.exit(1);
});
