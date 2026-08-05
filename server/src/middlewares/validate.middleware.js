import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);

    req.body = parsedBody;

    next();
  } catch (err) {
      if (err instanceof ZodError) {
      return next(new ApiError(400, err.issues[0].message));
    }

    next(err);
  }
}; 