import { TGenericErrorResponse } from "../interface/error";
import mongoose from "mongoose";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorMessage = `${err.value} is not a valid ID!`;
  const statusCode = 400;
  return {
    statusCode,
    message: "Invalid ID",
    errorMessage,
    errorDetails: err,
  };
};

export default handleCastError;
