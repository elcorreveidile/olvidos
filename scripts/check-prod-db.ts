/**
 * Script para verificar usuarios en la base de datos de producción
 *
 * Uso:
 *   npx tsx scripts/check-prod-db.ts
 */

import { db } from "../src/lib/db";

async function checkProductionUsers() {
  console.log("🔍 Verificando base de datos de producción...\n");

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`📊 Total de usuarios: ${users.length}\n`);

    if (users.length === 0) {
      console.log("⚠️  No hay usuarios en la base de datos de producción");
      console.log("❗ Debes crear el usuario admin en producción");
      return;
    }

    console.log("👥 Lista de usuarios:\n");
    console.table(
      users.map((u) => ({
        Email: u.email,
        Nombre: u.name,
        Rol: u.role,
        "Has Password": u.password ? "✅" : "❌",
        "Creado": new Date(u.createdAt).toLocaleDateString("es-ES"),
      }))
    );

    const adminUsers = users.filter((u) => u.role === "ADMIN");
    console.log(`\n🔑 Usuarios con rol ADMIN: ${adminUsers.length}`);

    if (adminUsers.length === 0) {
      console.log("❌ No hay usuarios con rol ADMIN en producción");
      console.log("❗ Debes crear un usuario admin o cambiar el rol de un usuario existente");
    } else {
      console.log("\n✅ Usuarios ADMIN encontrados:");
      adminUsers.forEach((u) => {
        console.log(`   - ${u.email} (${u.name})`);
        console.log(`     Has password: ${u.password ? "✅" : "❌"}`);
      });
    }

    const usersWithPassword = users.filter((u) => u.password);
    console.log(`\n🔐 Usuarios con contraseña: ${usersWithPassword.length}`);

    if (usersWithPassword.length === 0) {
      console.log("⚠️  Ningún usuario tiene contraseña establecida");
      console.log("❗ No se puede hacer login con credenciales");
    }
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    console.log("\nPosibles causas:");
    console.log("1. DATABASE_URL no está configurada correctamente");
    console.log("2. La base de datos no es accesible desde aquí");
    console.log("3. Credenciales de base de datos inválidas");
  }
}

checkProductionUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
