import ApiError from "../utils/ApiError";

const validateRequest = (req, next, schema) => {
  const options = {
    abortEarly: false, // include all errors
    allowKnown: false, // ignore unknown values
    stripUnknown: true, // remove unknown props
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next(
      new ApiError(
        `Validation Error: ${error.details
          .map((x) => x.message)
          .join(", ")}`.replace,
        400
      )
    );
  }

  req.body = value;

  next();
};

export default validateRequest;
