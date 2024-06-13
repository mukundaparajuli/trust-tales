import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must have atleast 2 characters")
  .max(16, "username can't have more than 16 characters")
  .regex(/^[a-z0-9]+$/, "You can't use any special characters or Uppercase");

export const signUpValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must have at least 8 characters" }),
});
