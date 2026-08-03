import { db } from "@/lib/db";
import Link from "next/link";
import { BadgeCheck, XCircle, AlertTriangle } from "lucide-react";
import { MEMBER_STATUS_LABELS } from "@/types/member";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verificación de carné · Olvidos de Granada",
  robots: { index: false, follow: false },
};

// Mismas etiquetas que el carné digital (DigitalCard), con prefijo "Socio".
const CARD_LEVEL_LABELS: Record<string, string> = {
  STANDARD: "Socio Estándar",
  COLLABORATOR: "Socio Colaborador",
  HONORARY: "Socio Mecenas",
  INSTITUTIONAL: "Socio Institucional",
  HONOR: "Socio de Honor",
};

export default async function VerificarPage({ params }: { params: { id: string } }) {
  const member = await db.member.findUnique({
    where: { id: params.id },
    select: {
      memberNumber: true,
      membershipLevel: true,
      status: true,
      joinDate: true,
      cardImageUrl: true,
      user: { select: { name: true } },
    },
  });

  const activo = member?.status === "ACTIVE";

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-4 py-12">
      {/* Sello de verificación */}
      {!member ? (
        <Sello
          icon={<XCircle className="h-6 w-6" />}
          text="Carné no válido"
          className="bg-red-100 text-red-700"
        />
      ) : activo ? (
        <Sello
          icon={<BadgeCheck className="h-6 w-6" />}
          text="Carné verificado · Socio activo"
          className="bg-green-100 text-green-700"
        />
      ) : (
        <Sello
          icon={<AlertTriangle className="h-6 w-6" />}
          text={`Socio no activo · ${MEMBER_STATUS_LABELS[member.status]}`}
          className="bg-amber-100 text-amber-700"
        />
      )}

      {member ? (
        <>
          {/* Tarjeta (mismo diseño que el carné digital) */}
          <div className="relative mt-6 w-full overflow-hidden rounded-xl shadow-2xl aspect-[1.586/1]">
            <div className="absolute inset-0 bg-gradient-to-br from-tinta via-tinta to-[#3a1417]" />
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-wide text-white">
                    <span className="text-coral">[</span>Olvidos de Granada
                  </h3>
                  <p className="text-xs text-coral">Asociación Cultural</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm">
                  {member.cardImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.cardImageUrl}
                      alt={member.user.name || "Socio"}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {(member.user.name?.charAt(0) || "S").toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/70">Número de Socio</p>
                  <p className="text-3xl font-bold text-white">#{member.memberNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/70">Nombre</p>
                  <p className="text-lg font-medium text-white">{member.user.name || "Socio"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">Nivel</p>
                    <p className="text-sm font-medium text-white">
                      {CARD_LEVEL_LABELS[member.membershipLevel] ?? member.membershipLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">Desde</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(member.joinDate).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!activo && (
            <p className="mt-4 text-center text-sm text-tinta/70">
              La membresía no está activa en este momento.
            </p>
          )}
        </>
      ) : (
        <p className="mt-6 text-center text-tinta/70">
          Este código no corresponde a ningún socio de la asociación.
        </p>
      )}

      <Link
        href="/"
        className="mt-8 text-sm font-bold text-coral transition-colors hover:text-coral-dark"
      >
        ← Olvidos de Granada
      </Link>
    </div>
  );
}

function Sello({
  icon,
  text,
  className,
}: {
  icon: React.ReactNode;
  text: string;
  className: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${className}`}
    >
      {icon}
      {text}
    </div>
  );
}
