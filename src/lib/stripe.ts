import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

/**
 * Niveles de cuota (todos "socios de número"). El precio se crea al vuelo con
 * `price_data`, así NO hace falta crear productos/precios en el panel de Stripe:
 * basta con la clave API. HONORARY = "Mecenas" (nombre visible).
 * Importes en céntimos de euro.
 */
export const MEMBERSHIP_PLANS = {
  STANDARD: { label: "Socio Estándar", amount: 5000 }, // 50 €/año
  HONORARY: { label: "Socio Mecenas", amount: 12000 }, // 120 €/año
  INSTITUTIONAL: { label: "Socio Institucional", amount: 25000 }, // 250 €/año
} as const;

export type MembershipPlan = keyof typeof MEMBERSHIP_PLANS;

export function isMembershipPlan(v: unknown): v is MembershipPlan {
  return typeof v === "string" && v in MEMBERSHIP_PLANS;
}

/** Línea de compra (suscripción anual) para un nivel de cuota, con precio al vuelo. */
export function membershipLineItem(
  plan: MembershipPlan
): Stripe.Checkout.SessionCreateParams.LineItem {
  const p = MEMBERSHIP_PLANS[plan];
  return {
    price_data: {
      currency: "eur",
      product_data: { name: `${p.label} · Olvidos de Granada` },
      unit_amount: p.amount,
      recurring: { interval: "year" },
    },
    quantity: 1,
  };
}
