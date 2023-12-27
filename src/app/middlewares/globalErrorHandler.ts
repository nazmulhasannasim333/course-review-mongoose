/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from "express";
import config from "../config";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleValidationError from "../errors/handleValidationError";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { JsonWebTokenError } from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || "Something went wrong";
  let errorMessage = "Internal server error";
  let errorDetails = err;
  let stack = config.NODE_ENV === "development" ? err?.stack : null;

  if (err instanceof ZodError) {
    const zodValidationError = handleZodError(err);
    statusCode = zodValidationError.statusCode;
    message = zodValidationError.message;
    errorMessage = zodValidationError.errorMessage;
    errorDetails = zodValidationError.errorDetails;
  } else if (err?.name === "CastError") {
    const castValidationError = handleCastError(err);
    statusCode = castValidationError.statusCode;
    message = castValidationError.message;
    errorMessage = castValidationError.errorMessage;
    errorDetails = castValidationError.errorDetails;
  } else if (err?.code === 11000) {
    const duplicateKeyError = handleDuplicateError(err);
    statusCode = duplicateKeyError.statusCode;
    message = duplicateKeyError.message;
    errorMessage = duplicateKeyError.errorMessage;
    errorDetails = duplicateKeyError.errorDetails;
  } else if (err?.name === "ValidationError") {
    const validationError = handleValidationError(err);
    statusCode = validationError.statusCode;
    message = validationError.message;
    errorMessage = validationError.errorMessage;
    errorDetails = validationError.errorDetails;
  } else if (err.statusCode === httpStatus.UNAUTHORIZED) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = err.message;
    errorMessage =
      "You do not have the necessary permissions to access this resource.";
    errorDetails = null;
    stack = null;
  } else if (
    err instanceof JsonWebTokenError &&
    err.name === "JsonWebTokenError"
  ) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Unauthorized Access";
    errorMessage =
      "You do not have the necessary permissions to access this resource.";
    errorDetails = null;
    stack = null;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessage = err?.message;
    errorDetails = err;
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessage = err?.message;
    errorDetails = err;
  }

  // actual return
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack,
  });
};

export default globalErrorHandler;
