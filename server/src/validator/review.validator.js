import { z } from "zod";

export const createReviewSchema = z.object({

    rating: z.coerce
        .number()
        .min(1, "Minimum rating is 1.")
        .max(5, "Maximum rating is 5."),

    comment: z
        .string()
        .trim()
        .max(1000)
        .optional()

});