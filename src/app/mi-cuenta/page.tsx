import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MEMBERSHIP_LABELS, MEMBER_STATUS_LABELS } from "@/types/member";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  CreditCard,
  User,
  CheckCircle,
  AlertCircle,
  Settings,
  Phone,
  Target,
} from "lucide-react";

export default async function MemberDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get member data
  const member = await db.member.findUnique({
    where: { userId: session.user.id },
    include: {
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!member) {
    redirect("/hazte-socio");
  }

  // Get latest payment
  const latestPayment = member.payments[0];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-black text-tinta">
          Hola, {session.user.name || "Socio"}
        </h2>
        <p className="mt-1 font-editorial text-tinta/70">
          Gestiona tu membresía y accede a todo lo de socio.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Membership Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado de Membresía
            </CardTitle>
            {member.status === "ACTIVE" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-tinta">
              {MEMBER_STATUS_LABELS[member.status]}
            </div>
            <p className="text-xs text-tinta/60 mt-1">
              Socio {MEMBERSHIP_LABELS[member.membershipLevel]}
            </p>
            {member.renewalDate && (
              <p className="text-xs text-gray-500 mt-2">
                Renovación: {new Date(member.renewalDate).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Member Number */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Número de Socio
            </CardTitle>
            <User className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{member.memberNumber}</div>
            <p className="text-xs text-gray-600 mt-1">
              Desde {new Date(member.joinDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Latest Payment */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Último Pago
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            {latestPayment ? (
              <>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: latestPayment.currency,
                  }).format(Number(latestPayment.amount))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(latestPayment.paidAt || latestPayment.createdAt).toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-400">-</div>
                <p className="text-xs text-gray-500 mt-1">Sin pagos registrados</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link href="/mi-cuenta/carnet">
                <CreditCard className="mr-2 h-4 w-4" />
                Ver Carnet Digital
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/mi-cuenta/objetivos">
                <Target className="mr-2 h-4 w-4" />
                Ver Objetivos
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/mi-cuenta/perfil">
                <Settings className="mr-2 h-4 w-4" />
                Actualizar Perfil
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/mi-cuenta/pagos">
                <CreditCard className="mr-2 h-4 w-4" />
                Historial de Pagos
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>
              Tu información actual en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">{session.user.name || "Sin nombre"}</p>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
            </div>
            {member.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-sm">{member.phone}</p>
              </div>
            )}
            {member.city && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-sm">{member.city}</p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <p className="text-sm">
                Alta: {new Date(member.joinDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      {member.status === "PENDING" && (
        <Card className="border-coral/30 bg-coral/5">
          <CardHeader>
            <CardTitle className="text-tinta">
              Membresía pendiente de activación
            </CardTitle>
            <CardDescription className="text-tinta/70">
              Completa el pago para activar tu membresía y disfrutar de todo lo
              de socio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-coral hover:bg-coral-dark">
              <Link href="/hazte-socio">Completar pago</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
