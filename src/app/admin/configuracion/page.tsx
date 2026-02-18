import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { getSiteConfig, updateSiteConfig } from "@/lib/actions/site-config";

interface PageProps {
  searchParams?: {
    success?: string;
    error?: string;
  };
}

export default async function AdminConfiguracionPage({ searchParams }: PageProps) {
  const config = await getSiteConfig();
  const hasSuccess = searchParams?.success === "1";
  const error = searchParams?.error;

  async function saveConfig(formData: FormData) {
    "use server";

    const result = await updateSiteConfig({
      siteName: String(formData.get("siteName") || ""),
      siteTagline: String(formData.get("siteTagline") || ""),
      contactEmail: String(formData.get("contactEmail") || ""),
      contactPhone: String(formData.get("contactPhone") || ""),
      contactAddress: String(formData.get("contactAddress") || ""),
      seoDefaultTitle: String(formData.get("seoDefaultTitle") || ""),
      seoDefaultDescription: String(formData.get("seoDefaultDescription") || ""),
      instagramUrl: String(formData.get("instagramUrl") || ""),
      facebookUrl: String(formData.get("facebookUrl") || ""),
      allowRegistrations: formData.get("allowRegistrations") === "on",
      maintenanceMode: formData.get("maintenanceMode") === "on",
    });

    if (!result.success) {
      redirect(`/admin/configuracion?error=${encodeURIComponent(result.error)}`);
    }

    redirect("/admin/configuracion?success=1");
  }

  return (
    <div className="space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuracion</h1>
        <p className="mt-1 text-gray-600">
          Ajustes generales del sitio, contacto, SEO y operacion.
        </p>
      </div>

      {hasSuccess && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Configuracion guardada correctamente.
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={saveConfig} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identidad del sitio</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nombre del sitio</Label>
              <Input
                id="siteName"
                name="siteName"
                required
                maxLength={120}
                defaultValue={config.siteName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteTagline">Subtitulo</Label>
              <Input
                id="siteTagline"
                name="siteTagline"
                maxLength={200}
                defaultValue={config.siteTagline}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contacto</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={config.contactEmail}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefono</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                maxLength={40}
                defaultValue={config.contactPhone}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactAddress">Direccion</Label>
              <Input
                id="contactAddress"
                name="contactAddress"
                maxLength={300}
                defaultValue={config.contactAddress}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO y redes sociales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seoDefaultTitle">Titulo SEO por defecto</Label>
                <Input
                  id="seoDefaultTitle"
                  name="seoDefaultTitle"
                  maxLength={60}
                  defaultValue={config.seoDefaultTitle}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">URL Instagram</Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  type="url"
                  placeholder="https://instagram.com/..."
                  defaultValue={config.instagramUrl}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="seoDefaultDescription">
                  Descripcion SEO por defecto
                </Label>
                <Textarea
                  id="seoDefaultDescription"
                  name="seoDefaultDescription"
                  rows={3}
                  maxLength={160}
                  defaultValue={config.seoDefaultDescription}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="facebookUrl">URL Facebook</Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  type="url"
                  placeholder="https://facebook.com/..."
                  defaultValue={config.facebookUrl}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operacion del sitio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                name="allowRegistrations"
                defaultChecked={config.allowRegistrations}
                className="h-4 w-4 rounded border-gray-300"
              />
              Permitir nuevas inscripciones de socios
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                name="maintenanceMode"
                defaultChecked={config.maintenanceMode}
                className="h-4 w-4 rounded border-gray-300"
              />
              Activar modo mantenimiento
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="inline-flex items-center gap-2">
            <Save className="h-4 w-4" />
            Guardar configuracion
          </Button>
        </div>
      </form>
    </div>
  );
}
