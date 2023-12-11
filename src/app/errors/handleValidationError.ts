import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interface/error";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorMessage = ` ${err.message}`;
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessage,
    errorDetails: err,
  };
};

export default handleValidationError;
