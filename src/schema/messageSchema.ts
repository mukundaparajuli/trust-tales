import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters!" })
    .max(300, { message: "Can't have more than 300 characters" }),
  name: z
    .string()
    .min(1, { message: "Name is required!" }),
  photo: z
    .instanceof(File)
    .refine(file => file.size > 0, { message: "File must not be empty!" })
});
