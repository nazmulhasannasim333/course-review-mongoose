/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  passwordHistory?: { password: string; timestamp: Date }[];
  role?: "user" | "admin";
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserFind(username: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
