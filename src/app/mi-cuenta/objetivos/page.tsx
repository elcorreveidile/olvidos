import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Newspaper,
  CalendarClock,
  HeartHandshake,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Objetivos",
  description:
    "La hoja de ruta de la Asociación Cultural Olvidos de Granada: el libro de las editoriales de Mariano Maresca y la vuelta a la revista impresa.",
};

const HITOS = [
  {
    icon: BookOpen,
    titulo: "El libro de las editoriales de Mariano",
    plazo: "En preparación",
    texto:
      "Una edición que reúne las editoriales que Mariano Maresca escribió para Imaginarias, el programa cultural de Canal Sur. Recuperamos esos textos y los reunimos por primera vez en un volumen.",
  },
  {
    icon: Newspaper,
    titulo: "La primera revista impresa",
    plazo: "Prevista para diciembre de 2027",
    texto:
      "Volvemos al papel. La primera edición impresa recopilará todo lo publicado en la web durante el curso 2026-2027 (de septiembre de 2026 a agosto de 2027): un número que deja constancia en papel del trabajo de todo un año.",
  },
  {
    icon: CalendarClock,
    titulo: "Una revista impresa cada curso",
    plazo: "Compromiso anual",
    texto:
      "A partir de ahí, el objetivo es editar cada curso un nuevo número impreso. La cuota de los socios es lo que hace sostenible este compromiso año tras año.",
  },
  {
    icon: Globe,
    titulo: "El archivo, número a número, en la web",
    plazo: "Trabajo en marcha",
    texto:
      "Estamos pasando cada número —hoy en PDF— a formato web (HTML): así se lee mejor, se puede buscar y queda bien indexado en los buscadores. Poco a poco, todo el archivo impreso navegable en línea.",
  },
];

export default function ObjetivosPage() {
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Nuestros objetivos</h2>
        <p className="text-gray-600 mt-1">
          La hoja de ruta de esta etapa. Como socio, esto es lo que tu cuota
          hace posible.
        </p>
      </div>

      {/* Hitos */}
      <div className="grid gap-6 md:grid-cols-2">
        {HITOS.map((hito) => {
          const Icon = hito.icon;
          return (
            <Card key={hito.titulo} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-coral-100 text-coral-700">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{hito.titulo}</CardTitle>
                <CardDescription className="font-semibold text-coral-700">
                  {hito.plazo}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-600">{hito.texto}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Qué recibes según tu nivel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-coral-700" />
            Qué recibirás
          </CardTitle>
          <CardDescription>
            Cómo llegan estas publicaciones a cada nivel de socio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Todos los socios</strong> reciben la edición digital de la
            revista del curso.
          </p>
          <p>
            <strong>Socios Mecenas</strong> reciben además la revista impresa en
            casa y un ejemplar del libro de las editoriales de Mariano cuando se
            publiquen. Los <strong>socios Institucionales</strong> reciben 5
            ejemplares de cada edición para la entidad. Los socios Estándar pueden
            adquirir ambas ediciones impresas a precio de socio.
          </p>
          <p className="text-gray-500">
            Te avisaremos por correo en cuanto cada publicación esté disponible.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
