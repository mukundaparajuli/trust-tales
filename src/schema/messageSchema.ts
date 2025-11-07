import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(10, { message: "Content must be at least 10 characters!" })
    .max(300, { message: "Can't have more than 300 characters" }),
  name: z
    .string()
    .optional(),
  project: z
    .string()
    .optional(),
  photo: z
    .instanceof(File)
    .optional(),
  rating: z
    .number()
    .min(0)
    .max(5)
    .optional(),
});
