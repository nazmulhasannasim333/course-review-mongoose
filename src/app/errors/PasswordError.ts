class PasswordError extends Error {
  public success: boolean;
  public statusCode: number;
  public data: any;

  constructor(errorDetails: {
    success: boolean;
    statusCode: number;
    message: string;
    data: any;
  }) {
    super(errorDetails.message);
    this.success = errorDetails.success;
    this.statusCode = errorDetails.statusCode;
    this.data = errorDetails.data;
  }
}

export default PasswordError;
