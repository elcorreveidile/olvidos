/**
 * Asigna un rol a una o varias cuentas por correo electrónico.
 *
 *   npx tsx --env-file=.env.local scripts/set-user-role.ts <ROL> <email> [<email>…] [--create]
 *
 *   ROL: USER | MEMBER | EDITOR | MEMBER_ADMIN | ADMIN
 *   --create  Si una cuenta no existe, la crea con una contraseña temporal
 *             aleatoria que se imprime una sola vez (la persona debe cambiarla
 *             al entrar, o entrar con Google/enlace mágico si lo usa).
 *
 * Al terminar imprime las cuentas con rol de equipo (EDITOR, MEMBER_ADMIN, ADMIN).
 * Los cambios de rol se aplican sin cerrar sesión: el JWT relee el rol en cada
 * petición.
 */
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { isRoleName, ROLE_LABELS, STAFF_ROLES } from "../src/lib/roles";

async function main() {
  const args = process.argv.slice(2);
  const create = args.includes("--create");
  const [role, ...emails] = args.filter((a) => !a.startsWith("--"));

  if (!role || !isRoleName(role) || emails.length === 0) {
    console.error("Uso: npx tsx --env-file=.env.local scripts/set-user-role.ts <USER|MEMBER|EDITOR|MEMBER_ADMIN|ADMIN> <email> [<email>…] [--create]");
    process.exit(1);
  }

  for (const raw of emails) {
    const email = raw.trim().toLowerCase();
    const user = await db.user.findUnique({ where: { email }, select: { id: true, role: true, name: true } });
    if (user) {
      if (user.role === role) {
        console.log(`= ${email} ya era ${ROLE_LABELS[role]}`);
        continue;
      }
      await db.user.update({ where: { id: user.id }, data: { role } });
      console.log(`✓ ${email}: ${ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? user.role} → ${ROLE_LABELS[role]}`);
      continue;
    }
    if (!create) {
      console.log(`✗ ${email} no existe (añade --create para crear la cuenta)`);
      continue;
    }
    const tempPassword = randomBytes(9).toString("base64url");
    await db.user.create({
      data: { email, name: email.split("@")[0], role, password: await bcrypt.hash(tempPassword, 10) },
    });
    console.log(`✓ ${email} creada como ${ROLE_LABELS[role]} · contraseña temporal: ${tempPassword}  (cámbiala al entrar)`);
  }

  const staff = await db.user.findMany({
    where: { role: { in: [...STAFF_ROLES] } },
    select: { email: true, name: true, role: true, password: true },
    orderBy: [{ role: "desc" }, { email: "asc" }],
  });
  console.log("\nCuentas del equipo:");
  console.table(
    staff.map((u) => ({
      Correo: u.email,
      Nombre: u.name ?? "",
      Rol: ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] ?? u.role,
      "Con contraseña": u.password ? "sí" : "no (Google / enlace)",
    })),
  );
}

main()
  .catch((e) => {
    console.error("✗", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
