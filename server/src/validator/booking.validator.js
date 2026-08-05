import { z } from "zod";

export const createBookingSchema = z.object({

    servicePeriod: z.object({

        from: z.coerce.date(),

        to: z.coerce.date(),

    }).refine(
        ({ from, to }) => to >= from,
        {
            message: "End date must be after start date.",
            path: ["to"],
        }
    ),

    preferredTime: z
        .string()
        .trim()
        .max(100, "Preferred time cannot exceed 100 characters.")
        .optional(),

    message: z
        .string()
        .trim()
        .max(500, "Message cannot exceed 500 characters.")
        .optional(),

});