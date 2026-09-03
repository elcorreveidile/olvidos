import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UserRoleSelect } from "@/components/admin/UserRoleSelect";
import { ROLE_COLORS, ROLE_LABELS, isRoleName, isStaffRole } from "@/lib/roles";

const roleLabels: Record<string, string> = ROLE_LABELS;
const roleColors: Record<string, string> = ROLE_COLORS;

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // El listado expone nombre, email, rol y estado de socio de TODAS las cuentas:
  // se restringe a ADMIN/MEMBER_ADMIN, igual que socios/pagos/contabilidad
  // (antes solo comprobaba la sesión, así que un EDITOR veía todo el directorio).
  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "MEMBER_ADMIN"
  ) {
    redirect("/admin");
  }

  const users = await db.user.findMany({
    include: {
      member: {
        select: {
          id: true,
          memberNumber: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalUsers = users.length;
  const totalMembers = users.filter((u) => !!u.member).length;
  const totalStaff = users.filter((u) => isStaffRole(u.role)).length;
  // Solo un ADMIN puede cambiar roles; el admin de socios ve las etiquetas.
  const canEditRoles = session.user.role === "ADMIN";

  return (
    <div className="space-y-6 px-6 py-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Usuarios</h2>
        <p className="text-gray-600 mt-1">
          Listado de cuentas registradas y su estado de membresía.
          {canEditRoles
            ? " Cambia el rol desde la columna «Rol»: Equipo Olvidos publica artículos; Admin de socios gestiona socios y pagos; Administrador puede todo."
            : ""}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Socios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No hay usuarios registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Socio</TableHead>
                    <TableHead>Alta</TableHead>
                    <TableHead className="text-right">Accion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || "Sin nombre"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {canEditRoles && isRoleName(user.role) ? (
                          <UserRoleSelect userId={user.id} role={user.role} isSelf={user.id === session.user.id} />
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              roleColors[user.role] || roleColors.USER
                            }`}
                          >
                            {roleLabels[user.role] || user.role}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.member ? (
                          <span className="text-sm text-gray-700">
                            #{user.member.memberNumber} ({user.member.status})
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.member ? (
                          <Link
                            href={`/admin/socios/${user.member.id}`}
                            className="text-sm text-coral hover:text-coral-dark font-medium"
                          >
                            Ver socio
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
