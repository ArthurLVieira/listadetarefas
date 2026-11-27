import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .trim()
    .max(5000, "Descrição muito longa")
    .optional()
    .transform((v) => (v ? v : undefined)),
  dueDate: z.string().optional(),
  priorityId: z.number().int().positive(),
  categoryId: z.number().int().positive().nullable(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
