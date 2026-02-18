import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  slug: z.string().min(1, "El slug es requerido").max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  parentId: z.string().cuid().optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;
