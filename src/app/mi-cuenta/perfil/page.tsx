import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateMember } from "@/lib/actions/members";
import { MEMBERSHIP_LABELS, MEMBER_STATUS_LABELS } from "@/types/member";
import { CardPhotoUpload } from "@/components/members/CardPhotoUpload";

export default async function MemberProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const member = await db.member.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
    },
  });

  if (!member) {
    redirect("/hazte-socio");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-tinta">Mi perfil</h2>
        <p className="mt-1 font-editorial text-tinta/70">
          Actualiza tus datos y tu visibilidad en el directorio.
        </p>
      </div>

      {/* Foto del carné */}
      <Card>
        <CardHeader>
          <CardTitle>Foto del carné</CardTitle>
          <CardDescription>
            Sube tu foto para el carné digital. La eliges tú (no se toma de
            Google ni de GitHub).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardPhotoUpload current={member.cardImageUrl} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Actualiza tus datos personales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => {
              "use server";
              const result = await updateMember(member.id, {
                bio: formData.get("bio") as string || undefined,
                phone: formData.get("phone") as string || undefined,
                address: formData.get("address") as string || undefined,
                city: formData.get("city") as string || undefined,
                isPublic: formData.get("isPublic") === "true",
              });
              if (result.success) {
                redirect("/mi-cuenta/perfil?success=true");
              }
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={session.user.name || ""}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">
                  Contacta con el admin para cambiar tu nombre
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={session.user.email || ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={member.phone || ""}
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={member.address || ""}
                  placeholder="Calle, número, piso"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={member.city || ""}
                  placeholder="Granada"
                />
              </div>

              <Button type="submit" className="w-full">
                Guardar Cambios
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Public Profile & Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil Público</CardTitle>
            <CardDescription>
              Configura tu visibilidad en el directorio de socios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => {
              "use server";
              const result = await updateMember(member.id, {
                bio: formData.get("bio") as string || undefined,
                isPublic: formData.get("isPublic") === "true",
              });
              if (result.success) {
                redirect("/mi-cuenta/perfil?success=true");
              }
            }} className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isPublic" className="text-base font-medium">
                    Aparecer en el directorio público
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Permite que otros socios te encuentren
                  </p>
                </div>
                <select
                  id="isPublic"
                  name="isPublic"
                  defaultValue={member.isPublic ? "true" : "false"}
                  className="border rounded px-3 py-2"
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={member.bio || ""}
                  placeholder="Cuéntanos brevemente sobre ti..."
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Máximo 500 caracteres. Solo visible si tu perfil es público.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Vista previa</p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{session.user.name || "Tu nombre"}</p>
                  {member.city && <p className="text-gray-600">{member.city}</p>}
                  {member.membershipLevel && (
                    <span className="inline-block px-2 py-1 bg-coral/10 text-coral rounded text-xs font-bold">
                      Socio {MEMBERSHIP_LABELS[member.membershipLevel]}
                    </span>
                  )}
                  {member.bio && (
                    <p className="text-gray-600 mt-2 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Actualizar Perfil Público
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>
            Detalles de tu membresía
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-600">Número de Socio</dt>
              <dd className="text-lg font-semibold">#{member.memberNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Nivel de socio</dt>
              <dd className="text-lg font-semibold">
                {MEMBERSHIP_LABELS[member.membershipLevel]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Estado</dt>
              <dd className="text-lg font-semibold">
                {MEMBER_STATUS_LABELS[member.status]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Fecha de Alta</dt>
              <dd className="text-lg font-semibold">
                {new Date(member.joinDate).toLocaleDateString("es-ES")}
              </dd>
            </div>
            {member.renewalDate && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Próxima Renovación</dt>
                <dd className="text-lg font-semibold">
                  {new Date(member.renewalDate).toLocaleDateString("es-ES")}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
