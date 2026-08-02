import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DigitalCard from "@/components/members/DigitalCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default async function MemberCardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const member = await db.member.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!member) {
    redirect("/hazte-socio");
  }

  const isActive = member.status === "ACTIVE";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-tinta">Carné digital</h2>
        <p className="mt-1 font-editorial text-tinta/70">
          Tu carné de socio de la Asociación Cultural Olvidos de Granada.
        </p>
      </div>

      {/* Aviso si aún no está activo: se muestra igualmente el carné (marcado como
          "Pendiente") para que el socio vea cómo quedará. */}
      {!isActive && (
        <Card className="border-coral/30 bg-coral/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tinta">
              <AlertCircle className="h-5 w-5 text-coral" />
              Carné pendiente de activación
            </CardTitle>
            <CardDescription className="text-tinta/70">
              Tu carné se activa al completar el pago de la cuota. Mientras tanto,
              así es como quedará.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/hazte-socio"
              className="inline-block rounded-sm bg-coral px-6 py-3 font-bold text-white transition-colors hover:bg-coral-dark"
            >
              Completar pago
            </a>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Carné de socio</CardTitle>
          <CardDescription>
            Preséntalo en los encuentros y actividades de la asociación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DigitalCard member={member} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del carné</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="mb-2 font-bold text-tinta">Lo que incluye tu carné:</h4>
            <ul className="space-y-1 text-tinta/70">
              <li>• Invitación a los encuentros, con asiento reservado para socios</li>
              <li>• Acceso al área de socios de la web</li>
              <li>• La edición del año de la revista, en digital</li>
              <li>• Voz y voto en la Asamblea</li>
            </ul>
          </div>

          <div className="border-t border-acero-light/40 pt-4">
            <h4 className="mb-2 font-bold text-tinta">¿Cómo usarlo?</h4>
            <ul className="space-y-1 text-tinta/70">
              <li>• Muestra el código QR en la entrada de los encuentros</li>
              <li>• La organización lo escanea para verificar tu membresía</li>
              <li>• Puedes imprimirlo o guardarlo en el móvil</li>
            </ul>
          </div>

          <div className="border-t border-acero-light/40 pt-4">
            <h4 className="mb-2 font-bold text-tinta">¿Algún problema?</h4>
            <p className="text-tinta/70">
              Si tienes cualquier problema con tu carné, escríbenos a{" "}
              <a
                href="mailto:olvidosdegranada@gmail.com"
                className="text-coral hover:underline"
              >
                olvidosdegranada@gmail.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
