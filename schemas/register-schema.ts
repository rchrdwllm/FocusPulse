import * as z from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      message: "Please enter a valid email",
    })
    .email({
      message: "Please enter a valid email",
    }),
  password: z.string({}).min(8, {
    message: "Password must be at least 8 characters",
  }),
});
