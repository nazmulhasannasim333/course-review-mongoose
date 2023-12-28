import { z } from "zod";

const loginValidationSchema = z.object({
  username: z.string({ required_error: "username is required." }),
  password: z.string({ required_error: "Password is required" }),
});

const changePasswordValidationSchema = z.object({
  currentPassword: z.string({
    required_error: "Current password is required",
  }),
  newPassword: z
    .string()
    .min(8)
    .refine(
      (data) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d])/.test(data),
      {
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      }
    ),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
