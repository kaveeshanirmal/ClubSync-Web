import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.string().optional().default(""),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
