/**
 * Comprueba la cuenta de administrador de Javier.
 * Uso: npx tsx --env-file=.env.local scripts/check-javier-user.ts [email]
 * (por defecto informa@blablaele.com; javier@blablaele.com ya no existe)
 */
import { db } from "../src/lib/db";

async function checkUser() {
  const email = process.argv[2] || "informa@blablaele.com";
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true }
  });

  if (user) {
    console.log("Usuario en BD:");
    console.log("  ID:", user.id);
    console.log("  Email:", user.email);
    console.log("  Nombre:", user.name);
    console.log("  Rol:", user.role);
    console.log("");
    console.log("¿El rol es ADMIN?", user.role === "ADMIN" ? "SÍ" : "NO");
  } else {
    console.log("Usuario NO encontrado en BD");
  }

  await db.$disconnect();
}

checkUser().catch(console.error);
