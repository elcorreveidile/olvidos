import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || "info@olvidosdegranada.es";

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Bienvenido a Olvidos de Granada",
    html: `
      <h1>Bienvenido, ${name}</h1>
      <p>Gracias por unirte a la Asociación Cultural Olvidos de Granada.</p>
      <p>Ya puedes acceder a tu área de socio y disfrutar de todos los beneficios.</p>
    `,
  });
}

export async function sendPaymentConfirmation(
  to: string,
  name: string,
  amount: string
) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Confirmación de pago — Olvidos de Granada",
    html: `
      <h1>Pago confirmado</h1>
      <p>Hola ${name}, hemos recibido tu pago de ${amount} €.</p>
      <p>Gracias por tu apoyo a la cultura.</p>
    `,
  });
}
