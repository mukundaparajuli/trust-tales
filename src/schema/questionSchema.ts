import { z } from "zod";

export const questionSchema = z.object({
    question: z
        .string()
        .min(10, { message: "Question must be at least of 10 characters!" })
        .max(300, { message: "Can't have more than 300 characters" }),
});
