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

export const NewApplicantSchema = z.object({
  user_id: z.string({
    description: "userId of user",
    required_error: "userId is required",
  }),
  first_name: z.string({
    description: "first name of user",
    required_error: "first name is required",
  }),
  other_name: z.string({
    description: "other name of user",
  }).optional(),
  last_name: z.string({
    description: "last name of user",
    required_error: "last name is required",
  }),
  profile_url: z
    .string({
      description: "Profile image url of user",
    })
    .optional(),
  banner: z
    .string({
      description: "Banner image url of user",
    })
    .optional(),
    industry_id: z.number({
      description: "Industry ID of user",
    }).optional(),
  bio: z.string().max(150).optional(),
  resume_url: z.string().optional(),
  skills: z.string().optional(),
  location: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
});


export const NewEmployerSchema = z.object({
  user_id: z.string({
    description: "userId of user",
    required_error: "userId is required",
  }),
  name: z.string({
    description: "name of employer",
    required_error: "name is required",
  }),
  logo_url: z.string().optional(),
  location: z.string().optional(),
  website_url: z.string().optional(),
  industry: z.string().optional(),
})