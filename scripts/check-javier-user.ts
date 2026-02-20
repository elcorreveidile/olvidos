import { db } from "../src/lib/db";

async function checkUser() {
  const user = await db.user.findUnique({
    where: { email: "javier@blablaele.com" },
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
