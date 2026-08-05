import { z } from "zod";

export const createCaretakerProfileSchema = z.object({
  careType: z
    .array(
      z.enum([
        "Both",
        "elderly-care",
        "baby-care",
      ])
    )
    .min(1, "Select at least one care type"),

  about: z
    .string()
    .trim()
    .max(1000, "About cannot exceed 1000 characters")
    .optional(),

  experienceYears: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .default(0),

  address: z
    .string()
    .trim()
    .min(5, "Address is required"),

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

  isCurrentlyAvailable: z.coerce
    .boolean()
    .optional(),

  status: z
    .enum(["active", "paused"])
    .optional(),
});

export const updateCaretakerProfileSchema =
    createCaretakerProfileSchema.partial();