/**
 * Roles de usuario de la web: etiquetas, colores y utilidades compartidas por
 * el panel de administración, las acciones de servidor y los scripts.
 *
 *  - USER: cuenta registrada sin más.
 *  - MEMBER: socio de la asociación (tiene ficha en Member).
 *  - EDITOR («Equipo Olvidos»): redacta, edita y publica artículos.
 *  - MEMBER_ADMIN: gestiona socios, pagos y contabilidad; no toca artículos.
 *  - ADMIN: todo, incluida la asignación de roles.
 */
export const ROLES = ["USER", "MEMBER", "EDITOR", "MEMBER_ADMIN", "ADMIN"] as const;
export type RoleName = (typeof ROLES)[number];

export const ROLE_LABELS: Record<RoleName, string> = {
  USER: "Usuario",
  MEMBER: "Socio",
  EDITOR: "Equipo Olvidos",
  MEMBER_ADMIN: "Admin de socios",
  ADMIN: "Administrador",
};

export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  USER: "Cuenta registrada sin permisos especiales.",
  MEMBER: "Socio de la asociación: acceso a Mi cuenta y a los contenidos para socios.",
  EDITOR: "Equipo Olvidos: crea, edita y publica artículos y actividades.",
  MEMBER_ADMIN: "Gestiona socios, pagos y contabilidad. No edita artículos.",
  ADMIN: "Administración completa, incluida la asignación de roles.",
};

export const ROLE_COLORS: Record<RoleName, string> = {
  USER: "bg-gray-100 text-gray-700",
  MEMBER: "bg-green-100 text-green-700",
  EDITOR: "bg-blue-100 text-blue-700",
  MEMBER_ADMIN: "bg-amber-100 text-amber-700",
  ADMIN: "bg-coral-100 text-coral-700",
};

/** Roles del equipo: la ficha de socio nunca los sobrescribe. */
export const STAFF_ROLES: readonly RoleName[] = ["EDITOR", "MEMBER_ADMIN", "ADMIN"];

export function isRoleName(value: unknown): value is RoleName {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function isStaffRole(role: string | null | undefined): boolean {
  return Boolean(role) && (STAFF_ROLES as readonly string[]).includes(role as string);
}

export function roleLabel(role: string | null | undefined): string {
  return isRoleName(role) ? ROLE_LABELS[role] : role || "";
}

/**
 * Rol que corresponde a un usuario según su condición de socio, sin pisar los
 * roles del equipo: un editor que además es socio sigue siendo editor.
 */
export function roleForMemberStatus(currentRole: string | null | undefined, memberActive: boolean): RoleName | null {
  if (isStaffRole(currentRole)) return null;
  return memberActive ? "MEMBER" : "USER";
}
