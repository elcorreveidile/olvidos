import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Remitente de los correos automáticos. Debe ser una dirección de un dominio
// verificado en Resend (p. ej. no-reply@olvidos.es), NO un gmail.
const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@olvidos.es";
const FROM = `Olvidos de Granada <${EMAIL_FROM}>`;

// Buzones de administración donde llegan los mensajes del formulario de
// contacto. Admite varios separados por coma en CONTACT_TO.
const CONTACT_TO = (process.env.CONTACT_TO || "olvidosdegranada@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface EmailButton {
  label: string;
  url: string;
}

/**
 * Plantilla HTML de marca para los correos automáticos. Todo en estilos inline y
 * tablas para máxima compatibilidad con clientes de correo (Gmail, Apple Mail…).
 * Colores de Olvidos: coral #ff6261, tinta #141414.
 */
function renderEmailHtml(opts: {
  heading: string;
  paragraphs: string[];
  button?: EmailButton;
}): string {
  const body = opts.paragraphs
    .map(
      (p) =>
        `<p style="font-size:15px;line-height:1.6;color:#333333;margin:0 0 14px;">${p}</p>`
    )
    .join("");

  const button = opts.button
    ? `<div style="margin:8px 0 20px;"><a href="${opts.button.url}" style="background:#ff6261;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 24px;border-radius:4px;display:inline-block;">${escapeHtml(
        opts.button.label
      )}</a></div>`
    : "";

  return `
  <div style="background:#f4f4f4;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ececec;border-radius:8px;">
      <tr>
        <td style="padding:28px 32px 4px;">
          <div style="font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1;">
            <span style="color:#ff6261;">[</span><span style="color:#141414;">olvidos</span>
          </div>
          <div style="font-size:12px;color:#9a9a9a;margin-top:4px;">Revista de acciones culturales</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px 4px;">
          <h1 style="font-size:20px;color:#141414;margin:0 0 14px;font-weight:800;">${escapeHtml(
            opts.heading
          )}</h1>
          ${body}
          ${button}
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px 26px;border-top:1px solid #f0f0f0;">
          <p style="font-size:12px;line-height:1.5;color:#9a9a9a;margin:0;">
            Asociación Cultural Olvidos de Granada · ISSN 2605-4515<br/>
            Este es un correo automático. Si necesitas ayuda, escríbenos a
            <a href="mailto:olvidosdegranada@gmail.com" style="color:#ff6261;">olvidosdegranada@gmail.com</a>.
          </p>
        </td>
      </tr>
    </table>
  </div>`;
}

type ContactEmailResult =
  | { ok: true; id?: string }
  | { ok: false; reason: "no-resend" | "send-error"; error?: string };

/**
 * Envía a la asociación un mensaje del formulario de contacto.
 * `replyTo` se fija al email de quien escribe para poder responderle directamente.
 */
export async function sendContactEmail(params: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactEmailResult> {
  if (!resend) {
    return { ok: false, reason: "no-resend" };
  }

  const { name, email, message } = params;
  const result = await resend.emails.send({
    from: FROM,
    to: CONTACT_TO,
    replyTo: email,
    subject: `Contacto web — ${name}`,
    html: renderEmailHtml({
      heading: "Nuevo mensaje desde la web",
      paragraphs: [
        `<strong>Nombre:</strong> ${escapeHtml(name)}`,
        `<strong>Email:</strong> ${escapeHtml(email)}`,
        `<strong>Mensaje:</strong>`,
        `<span style="white-space:pre-wrap;">${escapeHtml(message)}</span>`,
      ],
    }),
  });

  if (result.error) {
    return { ok: false, reason: "send-error", error: result.error.message };
  }
  return { ok: true, id: result.data?.id };
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  memberNumber?: number
) {
  if (!resend) return null;

  const paragraphs = [
    "Gracias por unirte a la Asociación Cultural Olvidos de Granada. Tu membresía ya está activa.",
  ];
  if (memberNumber) {
    paragraphs.push(`Tu número de socio es <strong>#${memberNumber}</strong>.`);
  }
  paragraphs.push(
    "Desde tu área de socio tienes el carné digital, los documentos de la asociación y las novedades de esta etapa."
  );

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Bienvenido a Olvidos de Granada",
    html: renderEmailHtml({
      heading: `¡Bienvenido/a, ${escapeHtml(name)}!`,
      paragraphs,
      button: {
        label: "Ir a mi cuenta",
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://olvidos.es"}/mi-cuenta`,
      },
    }),
  });
}

export async function sendPaymentConfirmation(
  to: string,
  name: string,
  amount: string
) {
  if (!resend) return null;

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Confirmación de pago — Olvidos de Granada",
    html: renderEmailHtml({
      heading: "Pago confirmado",
      paragraphs: [
        `Hola ${escapeHtml(name)}, hemos recibido tu pago de <strong>${escapeHtml(
          amount
        )} €</strong>.`,
        "Gracias por tu apoyo a la memoria cultural de Granada.",
      ],
    }),
  });
}

/**
 * Envía el enlace mágico de acceso (login sin contraseña). Si Resend no está
 * configurado, registra la URL en el log para poder probarlo en desarrollo.
 */
export async function sendMagicLinkEmail(to: string, name: string, url: string) {
  if (!resend) {
    console.info("[magic-link] URL:", url);
    return null;
  }

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Tu enlace para entrar — Olvidos de Granada",
    html: renderEmailHtml({
      heading: "Entra en Olvidos de Granada",
      paragraphs: [
        `Hola ${escapeHtml(name)}, usa este enlace para acceder a tu cuenta sin contraseña:`,
        "El enlace caduca en 1 hora y solo puede usarse una vez.",
        "Si no has solicitado este acceso, puedes ignorar este correo.",
      ],
      button: { label: "Entrar en Olvidos", url },
    }),
  });
}

/** Enlace para restablecer la contraseña. */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  url: string
) {
  if (!resend) {
    console.info("[forgot-password] Reset URL:", url);
    return null;
  }

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Restablece tu contraseña — Olvidos de Granada",
    html: renderEmailHtml({
      heading: "Restablece tu contraseña",
      paragraphs: [
        `Hola ${escapeHtml(name)}, hemos recibido una solicitud para restablecer tu contraseña.`,
        "Este enlace caduca en 1 hora. Si no lo has pedido, puedes ignorar este correo.",
      ],
      button: { label: "Crear nueva contraseña", url },
    }),
  });
}
