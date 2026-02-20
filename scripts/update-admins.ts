/**
 * Script para actualizar administradores
 *
 * 1. Cambiar javier@blablaele.com a ADMIN
 * 2. Crear benitezl@go.ugr.es como ADMIN con contraseña temporal
 * 3. Eliminar admin@olvidosdegranada.es
 */

import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function updateAdmins() {
  console.log("🔧 Actualizando administradores...\n");

  try {
    // 1. Cambiar javier@blablaele.com a ADMIN
    console.log("1. Buscando usuario javier@blablaele.com...");
    const javierUser = await db.user.findUnique({
      where: { email: "javier@blablaele.com" },
    });

    if (javierUser) {
      await db.user.update({
        where: { email: "javier@blablaele.com" },
        data: { role: "ADMIN" },
      });
      console.log("   ✅ javier@blablaele.com actualizado a ADMIN");
    } else {
      console.log("   ❌ Usuario javier@blablaele.com no encontrado");
    }

    // 2. Crear benitezl@go.ugr.es como ADMIN
    console.log("\n2. Creando usuario benitezl@go.ugr.es...");
    const benitezUser = await db.user.findUnique({
      where: { email: "benitezl@go.ugr.es" },
    });

    if (benitezUser) {
      // Si existe, actualizar a ADMIN
      await db.user.update({
        where: { email: "benitezl@go.ugr.es" },
        data: { role: "ADMIN" },
      });
      console.log("   ✅ benitezl@go.ugr.es actualizado a ADMIN");
    } else {
      // Si no existe, crear nuevo con contraseña temporal
      const tempPassword = await bcrypt.hash("temporal123", 10);
      await db.user.create({
        data: {
          email: "benitezl@go.ugr.es",
          name: "Benítez Láinez",
          role: "ADMIN",
          password: tempPassword,
        },
      });
      console.log("   ✅ benitezl@go.ugr.es creado como ADMIN");
      console.log("   ⚠️  Contraseña temporal: temporal123 (debe cambiarla)");
    }

    // 3. Cambiar rol de admin@olvidosdegranada.es a USER
    console.log("\n3. Cambiando rol de admin@olvidosdegranada.es a USER...");
    const adminUser = await db.user.findUnique({
      where: { email: "admin@olvidosdegranada.es" },
    });

    if (adminUser) {
      await db.user.update({
        where: { email: "admin@olvidosdegranada.es" },
        data: { role: "USER" },
      });
      console.log("   ✅ admin@olvidosdegranada.es cambiado a USER (no se eliminó por restricciones de foreign key)");
    } else {
      console.log("   ℹ️  admin@olvidosdegranada.es no existe");
    }

    // 4. Verificar el resultado
    console.log("\n📊 Estado final de administradores:");
    const adminUsers = await db.user.findMany({
      where: { role: "ADMIN" },
      select: {
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });

    if (adminUsers.length === 0) {
      console.log("   ⚠️  No hay administradores");
    } else {
      console.table(
        adminUsers.map((u) => ({
          Email: u.email,
          Nombre: u.name,
          Rol: u.role,
          "Tiene Password": u.password ? "✅" : "❌",
        }))
      );
    }

    console.log("\n✅ Actualización completada");
    console.log("\n⚠️  IMPORTANTE: Los usuarios deben:");
    console.log("   1. Hacer logout y login de nuevo para obtener el nuevo rol");
    console.log("   2. benitezl@go.ugr.es debe cambiar su contraseña temporal");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

updateAdmins()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
