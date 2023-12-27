import httpStatus from "http-status";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppError";

const createUserIntoDB = async (payload: TUser) => {
  // check username
  const existUsername = await User.findOne({
    username: payload.username,
  });

  if (existUsername) {
    throw new AppError(httpStatus.BAD_REQUEST, "This username already exists!");
  }

  // check email
  const existEmail = await User.findOne({
    email: payload.email,
  });

  if (existEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, "This email already exists!");
  }

  const newUser = await User.create(payload);
  return newUser;
};

export const UserServices = {
  createUserIntoDB,
};
