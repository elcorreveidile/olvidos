"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/lib/actions/users";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_COLORS, isRoleName, type RoleName } from "@/lib/roles";

/**
 * Selector de rol de la página Usuarios (solo lo ve un administrador).
 * Guarda al cambiar; el propio administrador no puede modificar su rol.
 */
export function UserRoleSelect({ userId, role, isSelf }: { userId: string; role: string; isSelf: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useState<RoleName>(isRoleName(role) ? role : "USER");
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const onChange = (next: string) => {
    if (!isRoleName(next) || next === current) return;
    const previous = current;
    setCurrent(next);
    setMessage(null);
    startTransition(async () => {
      const result = await updateUserRole(userId, next);
      if (!result?.success) {
        setCurrent(previous);
        setMessage({ kind: "error", text: result?.error ?? "Error al cambiar el rol" });
        return;
      }
      setMessage({ kind: "ok", text: "Guardado" });
      router.refresh();
    });
  };

  if (isSelf) {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[current]}`}
        title="No puedes cambiar tu propio rol"
      >
        {ROLE_LABELS[current]} (tú)
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
        aria-label="Rol del usuario"
        title={ROLE_DESCRIPTIONS[current]}
        className={`rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900 focus:border-coral focus:outline-none disabled:opacity-60 ${
          isPending ? "cursor-wait" : ""
        }`}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      {message && (
        <span className={`text-xs ${message.kind === "error" ? "text-red-600" : "text-green-700"}`} role="status">
          {message.text}
        </span>
      )}
    </div>
  );
}
