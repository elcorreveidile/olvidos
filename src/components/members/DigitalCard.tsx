"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Member } from "@prisma/client";

interface DigitalCardProps {
  member: Member & {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    };
  };
}

export default function DigitalCard({ member }: DigitalCardProps) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      if (qrRef.current) {
        // Create verification data
        const verificationData = JSON.stringify({
          memberId: member.id,
          memberNumber: member.memberNumber,
          email: member.user.email,
        });

        try {
          const url = await QRCode.toCanvas(qrRef.current, verificationData, {
            width: 120,
            margin: 1,
            color: {
              dark: "#013559",
              light: "#ffffff",
            },
          });
        } catch (error) {
          console.error("Error generating QR code:", error);
        }
      }
    };

    generateQR();
  }, [member]);

  const membershipLevelLabels = {
    STANDARD: "Socio Estándar",
    COLLABORATOR: "Socio Colaborador",
    HONORARY: "Socio de Honor",
    INSTITUTIONAL: "Socio Institucional",
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Front of Card */}
      <div className="relative w-full aspect-[1.586/1] rounded-xl overflow-hidden shadow-2xl">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-azul via-azul-dark to-azul" />

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-bold text-lg tracking-wide">
                Olvidos de Granada
              </h3>
              <p className="text-coral text-xs">Asociación Cultural</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              {member.user.image ? (
                <Image
                  src={member.user.image}
                  alt={member.user.name || "Socio"}
                  width={48}
                  height={48}
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <span className="text-white text-xl font-bold">
                  {member.user.name?.charAt(0) || "S"}
                </span>
              )}
            </div>
          </div>

          {/* Member Info */}
          <div className="space-y-2">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">
                Número de Socio
              </p>
              <p className="text-white text-3xl font-bold">
                #{member.memberNumber}
              </p>
            </div>

            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">
                Nombre
              </p>
              <p className="text-white text-lg font-medium">
                {member.user.name || "Socio"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider">
                  Nivel
                </p>
                <p className="text-white text-sm font-medium">
                  {membershipLevelLabels[member.membershipLevel]}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider">
                  Desde
                </p>
                <p className="text-white text-sm font-medium">
                  {new Date(member.joinDate).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-coral opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-coral opacity-10 rounded-full blur-3xl" />
      </div>

      {/* Back of Card with QR */}
      <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Carnet Digital
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Escanea este código para verificar tu membresía
          </p>

          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white rounded-lg border-2 border-azul">
              <canvas ref={qrRef} />
            </div>
          </div>

          <div className="space-y-1 text-xs text-gray-500">
            <p>
              <strong>ID:</strong> {member.id}
            </p>
            <p>
              <strong>Email:</strong> {member.user.email}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                className={`px-2 py-0.5 rounded-full ${
                  member.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {member.status === "ACTIVE" ? "Activo" : "Pendiente"}
              </span>
            </p>
          </div>

          {member.status === "ACTIVE" && member.renewalDate && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Válido hasta:{" "}
                <strong className="text-gray-900">
                  {new Date(member.renewalDate).toLocaleDateString()}
                </strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Download/Print Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex-1 px-4 py-2 bg-azul text-white rounded-lg hover:bg-azul-dark transition-colors font-medium"
        >
          Imprimir Carnet
        </button>
        <button
          onClick={() => {
            if (qrRef.current) {
              const link = document.createElement("a");
              link.download = `carnet-${member.memberNumber}.png`;
              link.href = qrRef.current.toDataURL();
              link.click();
            }
          }}
          className="flex-1 px-4 py-2 border border-azul text-azul rounded-lg hover:bg-azual hover:bg-azul/5 transition-colors font-medium"
        >
          Descargar QR
        </button>
      </div>
    </div>
  );
}
