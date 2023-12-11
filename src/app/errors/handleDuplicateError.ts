import { TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/{[^}]*"(.*?)"/);
  const extractedMessage = match && match[1];
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessage: `${extractedMessage} already exist!`,
    errorDetails: err,
  };
};

export default handleDuplicateError;
