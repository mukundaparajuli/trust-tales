import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(10, { message: "Content must be at least 10 characters!" })
    .max(300, { message: "Can't have more than 300 characters" }),
  name: z
    .string()
    .min(1, { message: "Name is required!" }),
  project: z
    .string()
    .min(1, { message: "Project is required" }),
  photo: z
    .instanceof(File)
    .refine(file => file.size > 0, { message: "File must not be empty!" }),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating cannot be more than 5" }),
});
