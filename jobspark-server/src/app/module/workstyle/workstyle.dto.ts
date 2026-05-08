import { z } from "zod";

export const createWorkStyleSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export type CreateWorkStyleDto = z.infer<typeof createWorkStyleSchema>;
