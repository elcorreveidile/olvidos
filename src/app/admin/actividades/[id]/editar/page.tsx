import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getEvent } from "@/lib/actions/events";
import { auth } from "@/lib/auth";
import { EventForm } from "../../../components/EventForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const result = await getEvent(params.id);

  if (!result.success || !result.event) {
    notFound();
  }

  const event = result.event;

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
            <Link href={`/admin/actividades/${event.id}`} className="hover:text-azul">
              {event.title}
            </Link>
            <span>/</span>
            <span>Editar</span>
          </div>
          <h1 className="text-3xl font-bold text-azul">Editar Evento</h1>
          <p className="text-acero mt-1">Actualiza la información del evento</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-sm shadow-card p-8">
          <EventForm event={event} />
        </div>
      </div>
    </div>
  );
}
