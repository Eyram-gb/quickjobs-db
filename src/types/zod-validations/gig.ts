import { z } from "zod";

export const GigSchema = z.object({
  user_id: z.string({
    description: "User ID of the gig creator",
    required_error: "User ID is required",
  }).uuid(),
  employer_id: z.string({
    description: "Company/Employer profile ID of the gig creator",
    required_error: "Company/Employer profile ID is required",
  }).uuid(),
  title: z.string({
    description: "Title of the gig",
    required_error: "Title is required",
  }),
  description: z.string({
    description: "Description of the gig",
    required_error: "Description is required",
  }),
  duration: z.string({
    description: "Duration of the gig in days",
    required_error: "Duration is required",
  }),
  location: z.string().optional(),
  budget_range: z.string(),
  requirements: z.string().array().optional(),
  is_active: z.boolean().default(true),
  is_deleted: z.boolean().default(false).optional(),
  // is_featured: z.boolean().default(false), // Commented out as it's commented in the original schema
});

// export type TGig = z.infer<typeof GigSchema>;
