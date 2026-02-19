"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, CreditCard, User, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

function RegistroSocioContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Personal Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Membership Plan
  const [plan, setPlan] = useState<"STANDARD" | "COLLABORATOR" | "HONORARY">("STANDARD");

  const plans = [
    {
      id: "STANDARD",
      name: "Estándar",
      price: "30€",
      period: "/año",
      features: ["Revista digital anual", "Acceso a eventos", "Carnet digital", "Descuentos colaboradores"],
    },
    {
      id: "COLLABORATOR",
      name: "Colaborador",
      price: "60€",
      period: "/año",
      features: [
        "Todo lo del plan Estándar",
        "Revista impresa (2 números)",
        "Entradas gratuitas a eventos",
        "Mención en la web",
        "Descuento del 20% en libros",
      ],
      popular: true,
    },
    {
      id: "HONORARY",
      name: "Honorífico",
      price: "120€",
      period: "/año",
      features: [
        "Todo lo del plan Colaborador",
        "Revista impresa completa",
        "Invitación a eventos VIP",
        "Dedicada en la revista",
      ],
    },
  ];

  const handleSubmitPersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setStep(2);
  };

  const handleSelectPlan = async (selectedPlan: "STANDARD" | "COLLABORATOR" | "HONORARY") => {
    setPlan(selectedPlan);
    setStep(3);
    setError(null);
  };

  const handleConfirmRegistration = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/members/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          plan,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "No se pudo completar el registro.");
        setLoading(false);
        return;
      }

      if (!result.url) {
        setError("No se pudo iniciar el pago en Stripe.");
        setLoading(false);
        return;
      }

      window.location.href = result.url;
    } catch (error) {
      console.error("Error en registro:", error);
      setError("Error al registrar. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 py-4 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? "bg-coral text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-sm font-medium text-azul">Datos Personales</span>
            </div>
            <div className={`h-0.5 w-12 ${step >= 2 ? "bg-coral" : "bg-gray-200"}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? "bg-coral text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {step > 2 ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span className="text-sm font-medium text-azul">Plan</span>
            </div>
            <div className={`h-0.5 w-12 ${step >= 3 ? "bg-coral" : "bg-gray-200"}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 3 ? "bg-coral text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {step > 3 ? <Check className="w-4 h-4" /> : "3"}
              </div>
              <span className="text-sm font-medium text-azul">Confirmar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {searchParams.get("cancelado") === "1" && (
            <div className="mb-6 rounded-sm border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              Has cancelado el pago. Puedes intentarlo de nuevo cuando quieras.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="bg-white rounded-sm shadow-card p-8">
              <h2 className="text-2xl font-bold text-azul mb-6">Información Personal</h2>

              <form onSubmit={handleSubmitPersonalInfo} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-acero mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-acero-light" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-acero mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-acero-light" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-acero mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-acero-light" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-acero mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-acero-light" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Link
                    href="/hazte-socio"
                    className="flex-1 px-6 py-3 border border-azul text-azul text-center font-bold rounded-sm hover:bg-azul hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Select Plan */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-azul mb-2">Elige tu Plan</h2>
                <p className="text-acero">Selecciona el nivel de membresía que deseas</p>
              </div>

              <div className="space-y-4">
                {plans.map((planItem) => (
                  <button
                    key={planItem.id}
                    onClick={() => handleSelectPlan(planItem.id as any)}
                    className={`w-full bg-white rounded-sm shadow-card p-6 text-left transition-all hover:shadow-card-hover relative ${
                      planItem.popular ? "ring-2 ring-coral" : ""
                    }`}
                  >
                    {planItem.popular && (
                      <div className="absolute top-4 right-4 bg-coral text-white text-xs font-bold px-2 py-1 rounded-sm">
                        Popular
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-azul mb-1">{planItem.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-coral">{planItem.price}</span>
                          <span className="text-acero">{planItem.period}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-acero-light" />
                    </div>
                    <ul className="mt-4 space-y-2">
                      {planItem.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-acero">
                          <Check className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-full px-6 py-3 border border-azul text-azul font-bold rounded-sm hover:bg-azul hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="bg-white rounded-sm shadow-card p-8">
              <h2 className="text-2xl font-bold text-azul mb-6">Confirmar Registro</h2>

              <div className="space-y-6 mb-8">
                <div className="p-4 bg-gray-50 rounded-sm">
                  <h3 className="font-bold text-azul mb-3">Datos Personales</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium text-acero w-32">Nombre:</span>
                      <span className="text-acero">{name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-acero w-32">Email:</span>
                      <span className="text-acero">{email}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-coral/10 rounded-sm">
                  <h3 className="font-bold text-azul mb-3">Plan Seleccionado</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-azul">{plans.find((p) => p.id === plan)?.name}</p>
                      <p className="text-sm text-acero">Membresía anual</p>
                    </div>
                    <div className="text-2xl font-black text-coral">
                      {plans.find((p) => p.id === plan)?.price}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-acero bg-yellow-50 border border-yellow-200 rounded-sm p-4">
                  <p className="font-bold text-azul mb-1">Próximo paso</p>
                  <p>Al confirmar, serás redirigido a Stripe para completar el pago de forma segura.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 border border-azul text-azul font-bold rounded-sm hover:bg-azul hover:text-white transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  onClick={handleConfirmRegistration}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  {loading ? "Procesando..." : "Confirmar y Pagar"}
                </button>
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="mt-8 text-center text-sm text-acero-light">
            <p>
              Al registrarte, aceptas nuestros{" "}
              <a href="/terminos-y-condiciones" className="text-coral hover:text-coral/80">
                Términos y Condiciones
              </a>{" "}
              y{" "}
              <a href="/politica-privacidad" className="text-coral hover:text-coral/80">
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistroSocioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-acero">Cargando...</div>
      </div>
    }>
      <RegistroSocioContent />
    </Suspense>
  );
}
