"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLES, ROLE_LABELS } from "@/lib/roles";

const RoleSchema = z.enum(ROLES);

/** Solo un ADMIN (comprobado contra la base de datos) puede cambiar roles. */
async function checkAdminOnly() {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!user || user.role !== "ADMIN") throw new Error("Solo un administrador puede cambiar roles");
  return session.user.id;
}

/**
 * Cambia el rol de un usuario. Un administrador no puede cambiar su propio rol
 * ni dejar la web sin ningún administrador.
 */
export async function updateUserRole(userId: string, role: string) {
  try {
    const adminId = await checkAdminOnly();
    const parsed = RoleSchema.safeParse(role);
    if (!parsed.success) return { success: false, error: "Rol desconocido" };
    const newRole = parsed.data;

    if (userId === adminId) {
      return { success: false, error: "No puedes cambiar tu propio rol; pídeselo a otro administrador." };
    }
    const target = await db.user.findUnique({ where: { id: userId }, select: { id: true, role: true, email: true } });
    if (!target) return { success: false, error: "El usuario no existe" };
    if (target.role === newRole) return { success: true };

    if (target.role === "ADMIN" && newRole !== "ADMIN") {
      const admins = await db.user.count({ where: { role: "ADMIN" } });
      if (admins <= 1) return { success: false, error: "No se puede dejar la web sin administradores." };
    }

    await db.user.update({ where: { id: userId }, data: { role: newRole } });

    revalidatePath("/admin/usuarios");
    revalidatePath("/admin");
    return { success: true, message: `${target.email} ahora es ${ROLE_LABELS[newRole]}.` };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Error al cambiar el rol" };
  }
}
