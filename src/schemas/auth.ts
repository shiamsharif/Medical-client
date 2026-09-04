import { z } from "zod";

const password = z.string().min(8, "Use at least 8 characters").regex(/\d/, "Add at least one number").regex(/[^A-Za-z0-9]/, "Add at least one special character");
export const loginSchema = z.object({ email: z.email("Enter a valid email"), password: z.string().min(1, "Enter your password") });
export const registerSchema = z.object({ name: z.string().trim().min(2, "Enter your full name"), email: z.email("Enter a valid email"), password, role: z.enum(["patient", "doctor"]), accept: z.boolean().refine(Boolean, "Please accept the terms") });
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
