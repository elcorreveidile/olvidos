"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createEvent, updateEvent } from "@/lib/actions/events";

interface EventFormProps {
  event?: any;
}

const EVENT_TYPES = [
  { value: "BOOK_PRESENTATION", label: "Presentación de Libro" },
  { value: "RECITAL", label: "Recital" },
  { value: "CONFERENCE", label: "Conferencia" },
  { value: "WORKSHOP", label: "Taller" },
  { value: "EXHIBITION", label: "Exposición" },
  { value: "SCREENING", label: "Proyección" },
  { value: "CONCERT", label: "Concierto" },
  { value: "MEETING", label: "Reunión" },
  { value: "OTHER", label: "Otro" },
];

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const isEditing = !!event;

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);

    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      shortDesc: formData.get("shortDesc") as string,
      coverImage: formData.get("coverImage") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      eventType: formData.get("eventType") as any,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      capacity: formData.get("capacity") ? parseInt(formData.get("capacity") as string) : undefined,
      membersOnly: formData.get("membersOnly") === "true",
      price: formData.get("price") ? parseFloat(formData.get("price") as string) : 0,
      status: formData.get("status") as any,
    };

    const result = isEditing
      ? await updateEvent(event.id, data)
      : await createEvent(data);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/actividades");
        router.refresh();
      }, 1000);
    } else {
      setErrors({ general: result.error || "Error al guardar el evento" });
    }

    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    if (!isEditing) {
      const slugInput = document.getElementById("slug") as HTMLInputElement;
      if (slugInput) {
        slugInput.value = generateSlug(slug);
      }
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-100 text-red-800 rounded-sm">
          {errors.general}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-sm">
          {isEditing ? "Evento actualizado correctamente" : "Evento creado correctamente"}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-azul mb-2">
            Título del Evento *
          </label>
          <input
            type="text"
            name="title"
            defaultValue={event?.title || ""}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
            placeholder="Ej: Presentación del libro 'Los Olvidos de Granada'"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-azul mb-2">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={event?.slug || ""}
            className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral font-mono text-sm"
            placeholder="ej: presentacion-libro-olvidos-granada"
            pattern="^[a-z0-9-]+$"
            required
          />
          <p className="text-xs text-acero-light mt-1">
            Solo letras minúsculas, números y guiones. Se genera automáticamente.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-azul mb-2">
            Tipo de Evento *
          </label>
          <select
            name="eventType"
            defaultValue={event?.eventType || "CONFERENCE"}
            className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral bg-white"
            required
          >
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-azul mb-2">
            Descripción Corta
          </label>
          <input
            type="text"
            name="shortDesc"
            defaultValue={event?.shortDesc || ""}
            maxLength={300}
            className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
            placeholder="Breve descripción para listados (máx. 300 caracteres)"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-azul mb-2">
            Descripción Completa *
          </label>
          <textarea
            name="description"
            defaultValue={event?.description || ""}
            rows={8}
            className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
            placeholder="Descripción detallada del evento. Puedes usar HTML para dar formato."
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-azul mb-2">
            Imagen de Portada
          </label>
          <input
            type="url"
            name="coverImage"
            defaultValue={event?.coverImage || ""}
            className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <p className="text-xs text-acero-light mt-1">URL de la imagen (opcional)</p>
        </div>
      </div>

      {/* Date and Time */}
      <div className="border-t border-acero-light pt-6">
        <h3 className="text-lg font-bold text-azul mb-4">Fecha y Hora</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-azul mb-2">
              Fecha y Hora de Inicio *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              defaultValue={
                event?.startDate
                  ? new Date(event.startDate).toISOString().slice(0, 16)
                  : ""
              }
              className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-azul mb-2">
              Fecha y Hora de Fin
            </label>
            <input
              type="datetime-local"
              name="endDate"
              defaultValue={
                event?.endDate
                  ? new Date(event.endDate).toISOString().slice(0, 16)
                  : ""
              }
              className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
            />
            <p className="text-xs text-acero-light mt-1">Opcional</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="border-t border-acero-light pt-6">
        <h3 className="text-lg font-bold text-azul mb-4">Ubicación</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-azul mb-2">
              Nombre del Lugar
            </label>
            <input
              type="text"
              name="location"
              defaultValue={event?.location || ""}
              className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
              placeholder="Ej: Casa de los Tiros"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-azul mb-2">
              Dirección Completa
            </label>
            <input
              type="text"
              name="address"
              defaultValue={event?.address || ""}
              className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
              placeholder="Ej: C. Periodista Rafael Gómez, 2, 18009 Granada"
            />
          </div>
        </div>
      </div>

      {/* Capacity and Pricing */}
      <div className="border-t border-acero-light pt-6">
        <h3 className="text-lg font-bold text-azul mb-4">Capacidad y Precio</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-azul mb-2">
              Aforo Máximo
            </label>
            <input
              type="number"
              name="capacity"
              defaultValue={event?.capacity || ""}
              min="1"
              className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
              placeholder="Ej: 50"
            />
            <p className="text-xs text-acero-light mt-1">Dejar vacío para ilimitado</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-azul mb-2">
              Precio (€)
            </label>
            <input
              type="number"
              name="price"
              defaultValue={event?.price || 0}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
              placeholder="0"
            />
            <p className="text-xs text-acero-light mt-1">0 = gratuito</p>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="membersOnly"
                defaultChecked={event?.membersOnly || false}
                className="w-5 h-5 text-coral border-acero-light rounded focus:ring-coral"
              />
              <span className="text-sm font-bold text-azul">
                Solo para socios
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="border-t border-acero-light pt-6">
        <h3 className="text-lg font-bold text-azul mb-4">Publicación</h3>
        <div>
          <label className="block text-sm font-bold text-azul mb-2">
            Estado
          </label>
          <select
            name="status"
            defaultValue={event?.status || "DRAFT"}
            className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral bg-white"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-acero-light">
        <Link
          href="/admin/actividades"
          className="px-6 py-2 text-azul font-bold hover:text-azul/80"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-acero text-azul font-bold rounded-sm hover:bg-acero/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Guardar Borrador"}
        </button>
        <button
          type="submit"
          disabled={loading}
          onClick={() => {
            const statusInput = document.querySelector('[name="status"]') as HTMLSelectElement;
            if (statusInput) statusInput.value = "PUBLISHED";
          }}
          className="px-6 py-2 bg-coral text-white font-bold rounded-sm hover:bg-coral/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}
