import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";

export const dynamic = "force-dynamic";

async function getUsers() {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return users;
}

export default async function CreateMemberPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const users = await getUsers();

  async function createMember(formData: FormData) {
    "use server";

    const userId = formData.get("userId") as string;
    const membershipLevel = formData.get("membershipLevel") as string;
    const status = formData.get("status") as string;
    const memberNumber = formData.get("memberNumber") as string;
    const city = formData.get("city") as string;
    const bio = formData.get("bio") as string;
    const isPublic = formData.get("isPublic") === "true";

    // redirect() lanza internamente, así que se llama SIEMPRE fuera del try
    // (si no, el catch se tragaría el éxito y acabaría en la página de error).
    if (!userId) {
      redirect("/admin/socios?error=Selecciona un usuario");
    }

    // Solo se asigna número si se ha introducido uno válido; en blanco se deja
    // que actúe el autoincremento (memberNumber es Int NOT NULL con default).
    const parsedNumber = memberNumber ? parseInt(memberNumber, 10) : NaN;

    let outcome: string;
    try {
      // Check if user already has a member record
      const existingMember = await db.member.findFirst({
        where: { userId },
      });

      if (existingMember) {
        outcome = "/admin/socios?error=El usuario ya tiene un registro de socio";
      } else {
        await db.member.create({
          data: {
            userId,
            membershipLevel,
            status,
            city,
            bio,
            isPublic,
            ...(Number.isFinite(parsedNumber)
              ? { memberNumber: parsedNumber }
              : {}),
          },
        });

        // Al convertir un usuario en socio se le asigna el rol MEMBER
        // (coherente con lib/actions/members.ts#createMember).
        await db.user.update({
          where: { id: userId },
          data: { role: "MEMBER" },
        });

        revalidatePath("/admin/socios");
        revalidatePath("/socios");

        outcome = "/admin/socios?success=Socio creado correctamente";
      }
    } catch (error) {
      console.error("Error creating member:", error);
      outcome = "/admin/socios?error=Error al crear socio";
    }

    redirect(outcome);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/socios"
              className="flex items-center gap-2 text-acero hover:text-azul transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </Link>
            <h1 className="text-2xl font-bold text-azul">Crear Nuevo Socio</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form action={createMember} className="bg-white rounded-sm shadow-card p-8 space-y-6">
            {/* Usuario */}
            <div>
              <label htmlFor="userId" className="block text-sm font-bold text-azul mb-2">
                Usuario *
              </label>
              <select
                id="userId"
                name="userId"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
              >
                <option value="">Selecciona un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
              <p className="text-xs text-acero-light mt-1">
                Lista de usuarios registrados en el sistema
              </p>
            </div>

            {/* Nivel de Membresía */}
            <div>
              <label htmlFor="membershipLevel" className="block text-sm font-bold text-azul mb-2">
                Nivel de Membresía *
              </label>
              <select
                id="membershipLevel"
                name="membershipLevel"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
              >
                <option value="">Selecciona el nivel</option>
                <option value="STANDARD">Estándar (50€/año)</option>
                <option value="HONORARY">Mecenas (120€/año)</option>
                <option value="INSTITUTIONAL">Institucional (250€/año)</option>
                <option value="HONOR">Socio de Honor (sin cuota)</option>
              </select>
              <p className="text-xs text-acero-light mt-1">
                Mecenas e Institucional reciben la revista impresa y mención pública en la web.
              </p>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-bold text-azul mb-2">
                Estado *
              </label>
              <select
                id="status"
                name="status"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
              >
                <option value="ACTIVE">Activo</option>
                <option value="PENDING">Pendiente de pago</option>
                <option value="EXPIRED">Expirado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            {/* Número de Socio */}
            <div>
              <label htmlFor="memberNumber" className="block text-sm font-bold text-azul mb-2">
                Número de Socio
              </label>
              <input
                type="number"
                id="memberNumber"
                name="memberNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                placeholder="Opcional: Se generará automáticamente si lo dejas vacío"
              />
              <p className="text-xs text-acero-light mt-1">
                Déjalo vacío para asignar automáticamente el siguiente número
              </p>
            </div>

            {/* Ciudad */}
            <div>
              <label htmlFor="city" className="block text-sm font-bold text-azul mb-2">
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                placeholder="Ej: Granada"
              />
            </div>

            {/* Biografía */}
            <div>
              <label htmlFor="bio" className="block text-sm font-bold text-azul mb-2">
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent resize-none"
                placeholder="Breve descripción del socio (opcional)"
              />
            </div>

            {/* Perfil Público */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                value="true"
                className="w-5 h-5 text-coral rounded-sm focus:ring-2 focus:ring-coral"
              />
              <label htmlFor="isPublic" className="text-sm text-acero">
                Mostrar en el directorio público de socios
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Link
                href="/admin/socios"
                className="flex-1 px-6 py-3 border border-azul text-azul text-center font-bold rounded-sm hover:bg-azul hover:text-white transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Crear Socio
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mt-6">
              <h3 className="font-bold text-azul mb-2 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Información
              </h3>
              <ul className="text-sm text-acero space-y-1">
                <li>• El usuario debe estar registrado en el sistema primero</li>
                <li>• Los socios Mecenas e Institucionales reciben la revista impresa y mención pública en la web</li>
                <li>• El estado &ldquo;Pendiente de pago&rdquo; se usa cuando están esperando confirmación de pago</li>
                <li>• Los socios con perfil público aparecerán en la página /socios</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
