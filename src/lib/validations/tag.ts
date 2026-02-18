import { z } from "zod";

export const tagSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50, "Máximo 50 caracteres"),
  slug: z.string().min(1, "El slug es requerido").max(50, "Máximo 50 caracteres"),
});

export type TagInput = z.infer<typeof tagSchema>;
