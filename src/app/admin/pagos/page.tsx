import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPayments } from "@/lib/actions/payments";
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
  Download,
} from "lucide-react";
import { Pagination } from "@/components/shared/Pagination";

interface PageProps {
  searchParams?: {
    memberId?: string;
    status?: string;
    type?: string;
    page?: string;
  };
}

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
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

  const memberId = searchParams?.memberId || "";
  const status = searchParams?.status || "all";
  const type = searchParams?.type || "all";
  const page = parseInt(searchParams?.page || "1");
  const limit = 20;

  const result = await getPayments({
    memberId,
    status,
    type,
    page,
    limit,
  });

  const payments = result.success ? result.payments : [];
  const pagination = result.success ? result.pagination : null;

  const statusLabels = {
    PENDING: "Pendiente",
    COMPLETED: "Completado",
    FAILED: "Fallido",
    REFUNDED: "Reembolsado",
    CANCELLED: "Cancelado",
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-700",
    CANCELLED: "bg-gray-100 text-gray-700",
  };

  const typeLabels = {
    MEMBERSHIP_FEE: "Cuota",
    EVENT_TICKET: "Entrada",
    DONATION: "Donación",
    OTHER: "Otro",
  };

  // Calculate totals
  const totalAmount = payments
    .filter((p: any) => p.status === "COMPLETED")
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Registro de Pagos</h2>
        <p className="text-gray-600 mt-1">
          Gestiona y consulta todos los pagos realizados
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(totalAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter((p: any) => p.status === "COMPLETED").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter((p: any) => p.status === "PENDING").length}
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
          <form className="grid gap-4 md:grid-cols-4">
            {/* Search by member ID */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="memberId"
                  type="text"
                  placeholder="ID de socio..."
                  defaultValue={memberId}
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
                <option value="COMPLETED">Completados</option>
                <option value="FAILED">Fallidos</option>
                <option value="REFUNDED">Reembolsados</option>
                <option value="CANCELLED">Cancelados</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <select
                name="type"
                defaultValue={type}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Todos los tipos</option>
                <option value="MEMBERSHIP_FEE">Cuotas</option>
                <option value="EVENT_TICKET">Entradas</option>
                <option value="DONATION">Donaciones</option>
                <option value="OTHER">Otros</option>
              </select>
            </div>

            {/* Submit */}
            <div className="md:col-span-4">
              <Button type="submit" className="w-full md:w-auto">
                Aplicar Filtros
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron pagos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Socio</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(
                          payment.paidAt || payment.createdAt
                        ).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {payment.member.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            #{payment.member.memberNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{typeLabels[payment.type]}</TableCell>
                      <TableCell>
                        {payment.description || "-"}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: payment.currency,
                        }).format(Number(payment.amount))}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[payment.status]
                          }`}
                        >
                          {statusLabels[payment.status]}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.stripeInvoiceId && (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            title="Ver factura en Stripe"
                          >
                            <a
                              href={`https://dashboard.stripe.com/invoices/${payment.stripeInvoiceId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
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
                basePath="/admin/pagos"
                searchParams={{
                  memberId,
                  status,
                  type,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
