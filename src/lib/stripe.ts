import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const MEMBERSHIP_PRICES = {
  STANDARD: process.env.STRIPE_PRICE_STANDARD,
  COLLABORATOR: process.env.STRIPE_PRICE_COLLABORATOR,
  HONORARY: process.env.STRIPE_PRICE_HONORARY,
} as const;
