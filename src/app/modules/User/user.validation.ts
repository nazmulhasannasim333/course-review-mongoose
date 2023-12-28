import { z } from "zod";

const createUserValidationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine(
      (data) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d])/.test(data),
      {
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      }
    ),
  role: z.enum(["user", "admin"]).default("user"),
});

export const UserValidations = {
  createUserValidationSchema,
};
