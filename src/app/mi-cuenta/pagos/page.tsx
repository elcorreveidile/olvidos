import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMemberPayments } from "@/lib/actions/payments";
import { MEMBER_STATUS_LABELS } from "@/types/member";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";

export default async function MemberPaymentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const member = await db.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    redirect("/hazte-socio");
  }

  const result = await getMemberPayments(member.id);

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black text-tinta">Historial de pagos</h2>
          <p className="text-gray-600 mt-1">
            Consulta y gestiona tus pagos
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {result.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payments = result.payments || [];

  const statusLabels = {
    PENDING: "Pendiente",
    COMPLETED: "Completado",
    FAILED: "Fallido",
    REFUNDED: "Reembolsado",
    CANCELLED: "Cancelado",
  };

  const statusColors = {
    PENDING: "text-yellow-600 bg-yellow-100",
    COMPLETED: "text-green-600 bg-green-100",
    FAILED: "text-red-600 bg-red-100",
    REFUNDED: "text-gray-600 bg-gray-100",
    CANCELLED: "text-gray-600 bg-gray-100",
  };

  const typeLabels = {
    MEMBERSHIP_FEE: "Cuota de Socio",
    EVENT_TICKET: "Entrada de Evento",
    DONATION: "Donación",
    OTHER: "Otro",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-tinta">Historial de pagos</h2>
          <p className="text-gray-600 mt-1">
            Consulta todos tus pagos y suscripciones
          </p>
        </div>
        {member.stripeCustomerId && (
          <form action="/api/stripe/portal" method="POST">
            <Button type="submit" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Gestionar Suscripción
            </Button>
          </form>
        )}
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(
                payments
                  .filter((p) => p.status === "COMPLETED")
                  .reduce((sum, p) => sum + Number(p.amount), 0)
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {payments.filter((p) => p.status === "COMPLETED").length}{" "}
              pagos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.length > 0 ? (
                new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: payments[0].currency,
                }).format(Number(payments[0].amount))
              ) : (
                "-"
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {payments.length > 0 && payments[0].paidAt
                ? new Date(payments[0].paidAt).toLocaleDateString("es-ES")
                : "Sin pagos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MEMBER_STATUS_LABELS[member.status]}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {member.renewalDate
                ? `Renueva: ${new Date(member.renewalDate).toLocaleDateString("es-ES")}`
                : "Sin fecha de renovación"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Pagos</CardTitle>
          <CardDescription>
            Historial completo de tus transacciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay pagos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(
                          payment.paidAt || payment.createdAt
                        ).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        {payment.description || typeLabels[payment.type]}
                      </TableCell>
                      <TableCell>{typeLabels[payment.type]}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader>
          <CardTitle>¿Necesitas ayuda?</CardTitle>
          <CardDescription>
            Si tienes alguna duda sobre tus pagos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Puedes descargar tus facturas y gestionar la suscripción desde
            «Gestionar suscripción» (arriba). Si detectas algún error, escríbenos.
          </p>
          <Button variant="outline" asChild>
            <a href="mailto:olvidosdegranada@gmail.com">Contactar con la asociación</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
