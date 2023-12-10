/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = 500;
  const message = "Something went wrong";
  const error = err;
  // actual return
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export default globalErrorHandler;
