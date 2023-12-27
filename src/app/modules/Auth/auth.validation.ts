import { z } from "zod";

const loginValidationSchema = z.object({
  username: z.string({ required_error: "username is required." }),
  password: z.string({ required_error: "Password is required" }),
});

const changePasswordValidationSchema = z.object({
  currentPassword: z.string({
    required_error: "Current password is required",
  }),
  newPassword: z.string({ required_error: "Password is required" }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
