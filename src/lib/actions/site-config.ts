"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const siteConfigSchema = z.object({
  siteName: z.string().min(2, "El nombre del sitio es obligatorio").max(120),
  siteTagline: z.string().max(200).optional(),
  contactEmail: z
    .string()
    .email("El email de contacto no es valido")
    .optional()
    .or(z.literal("")),
  contactPhone: z.string().max(40).optional(),
  contactAddress: z.string().max(300).optional(),
  seoDefaultTitle: z.string().max(60, "El titulo SEO no puede superar 60 caracteres").optional(),
  seoDefaultDescription: z
    .string()
    .max(160, "La descripcion SEO no puede superar 160 caracteres")
    .optional(),
  instagramUrl: z.string().url("La URL de Instagram no es valida").optional().or(z.literal("")),
  facebookUrl: z.string().url("La URL de Facebook no es valida").optional().or(z.literal("")),
  allowRegistrations: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
});

export type SiteConfigInput = z.infer<typeof siteConfigSchema>;

const SITE_CONFIG_KEYS = {
  siteName: "site.name",
  siteTagline: "site.tagline",
  contactEmail: "contact.email",
  contactPhone: "contact.phone",
  contactAddress: "contact.address",
  seoDefaultTitle: "seo.defaultTitle",
  seoDefaultDescription: "seo.defaultDescription",
  instagramUrl: "social.instagram",
  facebookUrl: "social.facebook",
  allowRegistrations: "members.allowRegistrations",
  maintenanceMode: "system.maintenanceMode",
} as const;

const DEFAULT_SITE_CONFIG: SiteConfigInput = {
  siteName: "Olvidos de Granada",
  siteTagline: "Revista cultural y literaria",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  seoDefaultTitle: "Olvidos de Granada",
  seoDefaultDescription: "Asociacion cultural y revista literaria de Granada.",
  instagramUrl: "",
  facebookUrl: "",
  allowRegistrations: true,
  maintenanceMode: false,
};

async function checkConfigPermission() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("No autenticado");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    throw new Error("No tienes permisos para configurar el sitio");
  }
}

function normalizeValue(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function getSiteConfig(): Promise<SiteConfigInput> {
  await checkConfigPermission();

  const entries = await db.siteConfig.findMany({
    where: {
      key: {
        in: Object.values(SITE_CONFIG_KEYS),
      },
    },
  });

  const byKey = new Map(entries.map((entry) => [entry.key, entry.value]));

  return {
    siteName:
      byKey.get(SITE_CONFIG_KEYS.siteName) || DEFAULT_SITE_CONFIG.siteName,
    siteTagline:
      byKey.get(SITE_CONFIG_KEYS.siteTagline) || DEFAULT_SITE_CONFIG.siteTagline,
    contactEmail: byKey.get(SITE_CONFIG_KEYS.contactEmail) || "",
    contactPhone: byKey.get(SITE_CONFIG_KEYS.contactPhone) || "",
    contactAddress: byKey.get(SITE_CONFIG_KEYS.contactAddress) || "",
    seoDefaultTitle:
      byKey.get(SITE_CONFIG_KEYS.seoDefaultTitle) ||
      DEFAULT_SITE_CONFIG.seoDefaultTitle,
    seoDefaultDescription:
      byKey.get(SITE_CONFIG_KEYS.seoDefaultDescription) ||
      DEFAULT_SITE_CONFIG.seoDefaultDescription,
    instagramUrl: byKey.get(SITE_CONFIG_KEYS.instagramUrl) || "",
    facebookUrl: byKey.get(SITE_CONFIG_KEYS.facebookUrl) || "",
    allowRegistrations:
      (byKey.get(SITE_CONFIG_KEYS.allowRegistrations) || "true") === "true",
    maintenanceMode:
      (byKey.get(SITE_CONFIG_KEYS.maintenanceMode) || "false") === "true",
  };
}

export async function updateSiteConfig(data: SiteConfigInput) {
  try {
    await checkConfigPermission();

    const parsed = siteConfigSchema.parse({
      ...data,
      siteName: normalizeValue(data.siteName),
      siteTagline: normalizeValue(data.siteTagline),
      contactEmail: normalizeValue(data.contactEmail),
      contactPhone: normalizeValue(data.contactPhone),
      contactAddress: normalizeValue(data.contactAddress),
      seoDefaultTitle: normalizeValue(data.seoDefaultTitle),
      seoDefaultDescription: normalizeValue(data.seoDefaultDescription),
      instagramUrl: normalizeValue(data.instagramUrl),
      facebookUrl: normalizeValue(data.facebookUrl),
    });

    await db.$transaction(
      Object.entries(SITE_CONFIG_KEYS).map(([field, key]) =>
        db.siteConfig.upsert({
          where: { key },
          update: {
            value: String(parsed[field as keyof SiteConfigInput] ?? ""),
          },
          create: {
            key,
            value: String(parsed[field as keyof SiteConfigInput] ?? ""),
          },
        })
      )
    );

    revalidatePath("/admin/configuracion");
    revalidatePath("/");

    return { success: true as const };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.errors[0]?.message || "Datos no validos" };
    }

    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Error al guardar configuracion",
    };
  }
}

export async function getPublicSiteFlags() {
  const entries = await db.siteConfig.findMany({
    where: {
      key: {
        in: [
          SITE_CONFIG_KEYS.allowRegistrations,
          SITE_CONFIG_KEYS.maintenanceMode,
        ],
      },
    },
  });

  const byKey = new Map(entries.map((entry) => [entry.key, entry.value]));

  return {
    allowRegistrations:
      (byKey.get(SITE_CONFIG_KEYS.allowRegistrations) || "true") === "true",
    maintenanceMode:
      (byKey.get(SITE_CONFIG_KEYS.maintenanceMode) || "false") === "true",
  };
}
