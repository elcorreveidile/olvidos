import { redirect } from "next/navigation";
import Link from "next/link";
import { createEvent } from "@/lib/actions/events";
import { auth } from "@/lib/auth";
import { EventForm } from "../../components/EventForm";

export default async function NewEventPage() {
  const session = await auth();

  if (!session?.user || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-acero/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-acero mb-2">
            <Link href="/admin/actividades" className="hover:text-azul">
              Actividades
            </Link>
            <span>/</span>
            <span>Nuevo Evento</span>
          </div>
          <h1 className="text-3xl font-bold text-azul">Crear Nuevo Evento</h1>
          <p className="text-acero mt-1">Completa el formulario para crear un nuevo evento</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-sm shadow-card p-8">
          <EventForm />
        </div>
      </div>
    </div>
  );
}
