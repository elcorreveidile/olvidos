import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMember, getMemberPayments } from "@/lib/actions/members";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Phone,
  Calendar,
  User,
  CreditCard,
  Edit,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminMemberDetailPage({ params }: PageProps) {
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

  const result = await getMember(params.id);

  if (!result.success) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost">
          <Link href="/admin/socios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {result.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const member = result.member;

  const paymentsResult = await getMemberPayments(params.id);
  const payments = paymentsResult.success ? paymentsResult.payments : [];

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
    STANDARD: "Socio Estándar",
    COLLABORATOR: "Socio Colaborador",
    HONORARY: "Socio de Honor",
    INSTITUTIONAL: "Socio Institucional",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/admin/socios">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {member.user.name || "Socio"}
            </h2>
            <p className="text-gray-600">Socio #{member.memberNumber}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/socios/${member.id}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Socio
          </Link>
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[member.status]
              }`}
            >
              {statusLabels[member.status]}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {membershipLevelLabels[member.membershipLevel]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(
                payments
                  .filter((p) => p.status === "COMPLETED")
                  .reduce((sum, p) => sum + Number(p.amount), 0)
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renovación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {member.renewalDate
                ? new Date(member.renewalDate).toLocaleDateString()
                : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Nombre completo</p>
                  <p className="font-medium">{member.user.name || "Sin nombre"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{member.user.email}</p>
                </div>
              </div>

              {member.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{member.phone}</p>
                  </div>
                </div>
              )}

              {member.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{member.address}</p>
                  </div>
                </div>
              )}

              {member.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Ciudad</p>
                    <p className="font-medium">{member.city}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de alta</p>
                  <p className="font-medium">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {member.renewalDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Próxima renovación</p>
                    <p className="font-medium">
                      {new Date(member.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">ID de Usuario</p>
                  <p className="font-medium text-sm">{member.userId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">ID de Socio</p>
                  <p className="font-medium text-sm">{member.id}</p>
                </div>
              </div>

              {member.stripeCustomerId && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Stripe Customer</p>
                    <p className="font-medium text-sm">{member.stripeCustomerId}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {member.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Biografía</p>
              <p className="text-gray-900">{member.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Últimos {payments.length} pagos registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Sin pagos registrados</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Concepto</TableHead>
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
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payment.description || payment.type}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: payment.currency,
                      }).format(Number(payment.amount))}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
