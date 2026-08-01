import { ApiError } from "../utils/ApiError.js";

export const parseFormData = (req, res, next) => {
  try {

    if (req.body.careType) {
      req.body.careType = JSON.parse(req.body.careType);
    }

    if (req.body.availability) {
      req.body.availability = JSON.parse(req.body.availability);
    } 

    next();
  } catch (err) {
    next(new ApiError(400, "Invalid JSON format in form data."));
  }
};