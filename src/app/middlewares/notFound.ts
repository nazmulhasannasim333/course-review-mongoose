import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const notFount = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API route not found",
    error: "",
  });
};

export default notFount;
