import ApiError from "../utils/ApiError";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === "CastError") {
    error = new ApiError("Resource not found", 404);
  }

  if (err.name === "JsonWebTokenError") {
    error = new ApiError("JsonWebTokenError", 401);
  }

  if (err.code === 11000) {
    error = new ApiError("Duplicate field value entered", 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    error = new ApiError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
