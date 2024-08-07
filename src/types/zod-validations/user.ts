import { z } from "zod";

const USER_TYPES = ["admin", "client", "company"] as const;

export const NewUserSchema = z.object({
  email: z
    .string({
      description: "email of user",
      required_error: "email is required",
    })
    .email({ message: "email is not a valid email." }),
  password: z.string({
    description: "password of user",
    required_error: "password is required",
  }),
  user_type: z.enum(USER_TYPES),
});
