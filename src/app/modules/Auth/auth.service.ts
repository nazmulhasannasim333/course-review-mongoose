import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";

import { TLoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";
import { User } from "../User/user.model";

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserFind(payload.username);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user._id === undefined) {
    throw new AppError(httpStatus.NOT_FOUND, "User id is undefined");
  }
  if (user.role === undefined) {
    throw new AppError(httpStatus.NOT_FOUND, "User role is undefined");
  }
  if (user.email === undefined) {
    throw new AppError(httpStatus.NOT_FOUND, "User email is undefined");
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //create token and sent to the  client
  const jwtPayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return {
    user,
    accessToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string }
) => {
  // checking if the user is exist
  const user = await User.findById(userData._id);
  // console.log({ user, userData, payload });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found !");
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload.currentPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Current password is incorrect");

  // Check if the new password is unique and not among the last 2 used passwords
  const recentPasswords = user?.passwordHistory || [];
  if (
    recentPasswords.some((entry) =>
      User.isPasswordMatched(payload.newPassword, entry.password)
    )
  ) {
    //   console.log("ami error");
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password change failed. Ensure the new password is unique and not among the last 2 used."
    );
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  // Update the password and password change history
  const updatedUser = await User.findOneAndUpdate(
    { _id: userData._id },
    {
      password: newHashedPassword,
      $push: {
        passwordHistory: {
          password: newHashedPassword,
          timestamp: new Date(),
        },
      },
    }
  );

  return updatedUser;
};

export const AuthServices = {
  loginUser,
  changePassword,
};
