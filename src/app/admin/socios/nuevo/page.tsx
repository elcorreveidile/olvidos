import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMember } from "@/lib/actions/members";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewMemberPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check admin permissions
  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "MEMBER_ADMIN"
  ) {
    redirect("/admin");
  }

  // Get all users that are not members yet
  const users = await db.user.findMany({
    where: {
      member: null,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost">
          <Link href="/admin/socios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Nuevo Socio</h2>
          <p className="text-gray-600 mt-1">
            Añade un nuevo socio manualmente
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crear Socio</CardTitle>
          <CardDescription>
            Completa el formulario para dar de alta a un nuevo socio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            "use server";
            const result = await createMember({
              userId: formData.get("userId") as string,
              membershipLevel: formData.get("membershipLevel") as any,
              status: formData.get("status") as any,
              bio: formData.get("bio") as string || undefined,
              phone: formData.get("phone") as string || undefined,
              address: formData.get("address") as string || undefined,
              city: formData.get("city") as string || undefined,
              isPublic: formData.get("isPublic") === "true",
            });
            if (result.success) {
              redirect("/admin/socios");
            }
          }} className="space-y-6">
            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="userId">Usuario *</Label>
              <select
                id="userId"
                name="userId"
                required
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Selecciona un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email} ({user.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                El usuario debe estar registrado en el sistema
              </p>
            </div>

            {/* Membership Level */}
            <div className="space-y-2">
              <Label htmlFor="membershipLevel">Nivel de Membresía *</Label>
              <select
                id="membershipLevel"
                name="membershipLevel"
                required
                defaultValue="STANDARD"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="STANDARD">Socio Estándar</option>
                <option value="COLLABORATOR">Socio Colaborador</option>
                <option value="HONORARY">Socio de Honor</option>
                <option value="INSTITUTIONAL">Socio Institucional</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <select
                id="status"
                name="status"
                required
                defaultValue="PENDING"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="PENDING">Pendiente</option>
                <option value="ACTIVE">Activo</option>
                <option value="EXPIRED">Caducado</option>
                <option value="SUSPENDED">Suspendido</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                placeholder="Calle, número, piso"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                name="city"
                placeholder="Granada"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Breve descripción del socio..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Máximo 500 caracteres
              </p>
            </div>

            {/* Is Public */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="isPublic" className="text-base font-medium">
                  Aparecer en el directorio público
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Permite que el socio sea visible en el directorio público
                </p>
              </div>
              <select
                id="isPublic"
                name="isPublic"
                defaultValue="false"
                className="border rounded px-3 py-2"
              >
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button type="submit">Crear Socio</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/socios">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
