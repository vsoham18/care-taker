import { z } from "zod";

export const slotSchema = z.object({
  day: z.enum([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]),

  from: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid start time (HH:MM)"
    ),

  to: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid end time (HH:MM)"
    ),
});

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

  availability: z
    .array(slotSchema)
    .default([]),

  isCurrentlyAvailable: z.coerce
    .boolean()
    .optional(),

  status: z
    .enum(["active", "paused"])
    .optional(),
});

export const updateCaretakerProfileSchema =
    createCaretakerProfileSchema.partial();