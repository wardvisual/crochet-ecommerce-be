import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError";

export const isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) next(new ApiError(errors.array()[0].msg, 400));

  next();
};
