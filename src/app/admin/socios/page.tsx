import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMembers } from "@/lib/actions/members";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Mail,
  MapPin,
} from "lucide-react";
import { Pagination } from "@/components/shared/Pagination";

interface PageProps {
  searchParams?: {
    status?: string;
    membershipLevel?: string;
    city?: string;
    search?: string;
    page?: string;
  };
}

export default async function AdminMembersPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check admin permissions
  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "MEMBER_ADMIN"
  ) {
    redirect("/admin");
  }

  const status = searchParams?.status || "all";
  const membershipLevel = searchParams?.membershipLevel || "all";
  const city = searchParams?.city || "";
  const search = searchParams?.search || "";
  const page = parseInt(searchParams?.page || "1");
  const limit = 20;

  const result = await getMembers({
    status,
    membershipLevel,
    city,
    search,
    page,
    limit,
  });

  const members = result.success ? result.members : [];
  const pagination = result.success ? result.pagination : null;

  const statusLabels = {
    PENDING: "Pendiente",
    ACTIVE: "Activo",
    EXPIRED: "Caducado",
    SUSPENDED: "Suspendido",
    CANCELLED: "Cancelado",
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACTIVE: "bg-green-100 text-green-700",
    EXPIRED: "bg-red-100 text-red-700",
    SUSPENDED: "bg-orange-100 text-orange-700",
    CANCELLED: "bg-gray-100 text-gray-700",
  };

  const membershipLevelLabels = {
    STANDARD: "Estándar",
    COLLABORATOR: "Colaborador",
    HONORARY: "Honor",
    INSTITUTIONAL: "Institucional",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Socios</h2>
          <p className="text-gray-600 mt-1">
            Administra los socios de la asociación
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/socios/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Socio
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Socios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {members.filter((m: any) => m.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {members.filter((m: any) => m.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caducados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {members.filter((m: any) => m.status === "EXPIRED").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-5">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  type="search"
                  placeholder="Buscar por nombre, email o número..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <select
                name="status"
                defaultValue={status}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="ACTIVE">Activos</option>
                <option value="EXPIRED">Caducados</option>
                <option value="SUSPENDED">Suspendidos</option>
                <option value="CANCELLED">Cancelados</option>
              </select>
            </div>

            {/* Membership Level */}
            <div>
              <select
                name="membershipLevel"
                defaultValue={membershipLevel}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Todos los niveles</option>
                <option value="STANDARD">Estándar</option>
                <option value="COLLABORATOR">Colaborador</option>
                <option value="HONORARY">Honor</option>
                <option value="INSTITUTIONAL">Institucional</option>
              </select>
            </div>

            {/* City */}
            <div>
              <Input
                name="city"
                type="text"
                placeholder="Ciudad"
                defaultValue={city}
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-5">
              <Button type="submit" className="w-full md:w-auto">
                Aplicar Filtros
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Socios</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron socios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Alta</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        #{member.memberNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-azul text-white rounded-full flex items-center justify-center text-sm">
                            {member.user.name?.charAt(0) || "S"}
                          </div>
                          {member.user.name || "Sin nombre"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {member.user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {membershipLevelLabels[member.membershipLevel]}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[member.status]
                          }`}
                        >
                          {statusLabels[member.status]}
                        </span>
                      </TableCell>
                      <TableCell>
                        {member.city ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {member.city}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/socios/${member.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/socios/${member.id}/editar`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath="/admin/socios"
                searchParams={{
                  status,
                  membershipLevel,
                  city,
                  search,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
