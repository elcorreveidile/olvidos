/**
 * Verificación humana compartida (operación matemática + honeypot), revalidada
 * SIEMPRE en el servidor: recalcula el resultado y no confía en el cliente.
 * La usan el formulario de contacto y la solicitud de enlace mágico.
 */

export type HumanCheckResult =
  | { ok: true }
  | { ok: false; reason: "honeypot" | "challenge" };

export interface HumanCheckFields {
  chA: unknown;
  chB: unknown;
  chOp: unknown;
  human: unknown;
  company?: unknown;
}

/** Lee los campos del reto (y el honeypot) desde un FormData. */
export function readHumanCheck(formData: FormData): HumanCheckFields {
  return {
    chA: formData.get("chA"),
    chB: formData.get("chB"),
    chOp: formData.get("chOp"),
    human: formData.get("human"),
    company: formData.get("company"),
  };
}

/**
 * Valida el reto. `reason: "honeypot"` cuando el campo trampa viene relleno
 * (probable bot) y `reason: "challenge"` cuando la operación no cuadra.
 */
export function verifyHumanCheck(fields: HumanCheckFields): HumanCheckResult {
  const honeypot = String(fields.company ?? "").trim();
  if (honeypot) return { ok: false, reason: "honeypot" };

  const a = Number(fields.chA);
  const b = Number(fields.chB);
  const op = String(fields.chOp);
  const answer = Number(fields.human);
  const expected = op === "−" ? a - b : a + b;

  const valid =
    Number.isFinite(a) &&
    Number.isFinite(b) &&
    (op === "+" || op === "−") &&
    Number.isFinite(answer) &&
    answer === expected;

  return valid ? { ok: true } : { ok: false, reason: "challenge" };
}
