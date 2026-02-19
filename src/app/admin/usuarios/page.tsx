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

const roleLabels: Record<string, string> = {
  USER: "Usuario",
  MEMBER: "Socio",
  EDITOR: "Editor",
  MEMBER_ADMIN: "Admin de socios",
  ADMIN: "Administrador",
};

const roleColors: Record<string, string> = {
  USER: "bg-gray-100 text-gray-700",
  MEMBER: "bg-green-100 text-green-700",
  EDITOR: "bg-blue-100 text-blue-700",
  MEMBER_ADMIN: "bg-amber-100 text-amber-700",
  ADMIN: "bg-coral-100 text-coral-700",
};

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
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
  const totalAdmins = users.filter(
    (u) => u.role === "ADMIN" || u.role === "MEMBER_ADMIN"
  ).length;

  return (
    <div className="space-y-6 px-6 py-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Usuarios</h2>
        <p className="text-gray-600 mt-1">
          Listado de cuentas registradas y su estado de membresia.
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
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdmins}</div>
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            roleColors[user.role] || roleColors.USER
                          }`}
                        >
                          {roleLabels[user.role] || user.role}
                        </span>
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
