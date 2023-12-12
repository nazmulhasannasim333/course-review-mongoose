import mongoose, { Schema } from "mongoose";
import { TCategory } from "./category.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const categorySchema = new Schema<TCategory>({
  name: { type: String, unique: true, required: [true, "Name is required"] },
});

categorySchema.pre("save", async function (next) {
  const isCategoryExist = await Category.findOne({
    name: this.name,
  });
  if (isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This category already exists!");
  }
  next();
});

export const Category = mongoose.model<TCategory>("Category", categorySchema);
