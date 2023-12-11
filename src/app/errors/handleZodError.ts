import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../interface/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorMessage = err.issues
    .map((issue: ZodIssue) => `${issue.path.join(".")} is ${issue.message}`)
    .join(". ");
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessage,
    errorDetails: err,
  };
};

export default handleZodError;
