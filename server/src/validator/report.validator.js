import { z } from "zod";

export const createReportSchema = z.object({
  reason: z.enum([
    "inappropriate-content",
    "misleading-information",
    "fraud",
    "harassment",
    "escort-sexual-services",
    "spam",
    "other",
  ]),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional(),
});