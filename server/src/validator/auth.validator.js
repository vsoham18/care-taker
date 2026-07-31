import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),

  state: z
    .string()
    .trim()
    .min(2, "State is required"),

  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),
});