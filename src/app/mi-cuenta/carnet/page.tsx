import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DigitalCard from "@/components/members/DigitalCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  if (member.status !== "ACTIVE") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Carnet Digital</h2>
          <p className="text-gray-600 mt-1">
            Tu carnet digital de socio
          </p>
        </div>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="h-5 w-5" />
              Membresía No Activa
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Tu membresía aún no está activa. Completa el pago para obtener tu
              carnet digital.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Estado:</span>
                  <span>{member.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Número de Socio:</span>
                  <span>#{member.memberNumber}</span>
                </div>
              </div>
              <a
                href="/hazte-socio"
                className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Activar Membresía
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Carnet Digital</h2>
        <p className="text-gray-600 mt-1">
          Tu carnet digital de socio de la Asociación Cultural Olvidos de Granada
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carnet de Socio</CardTitle>
          <CardDescription>
            Presenta este carnet en los eventos y actividades de la asociación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DigitalCard member={member} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Carnet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Beneficios de tu carnet:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Acceso gratuito a todos los eventos de la asociación</li>
              <li>• Descuentos en actividades y talleres</li>
              <li>• Acceso al área privada de la web</li>
              <li>• Revista digital exclusiva</li>
              <li>• Voto en asambleas y elecciones</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold mb-2">¿Cómo usar tu carnet?</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Muestra el código QR en la entrada de los eventos</li>
              <li>• El personal escaneará tu código para verificar tu membresía</li>
              <li>• Puedes imprimirlo o guardarlo en tu móvil</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold mb-2">¿Problemas con tu carnet?</h4>
            <p className="text-gray-600">
              Si tienes algún problema con tu carnet digital, contacta con
              nosotros en{" "}
              <a
                href="mailto:info@olvidosdegranada.com"
                className="text-azul hover:underline"
              >
                info@olvidosdegranada.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
