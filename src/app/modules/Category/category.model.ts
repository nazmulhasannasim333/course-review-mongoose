import mongoose, { Schema } from "mongoose";
import { TCategory } from "./category.interface";

const categorySchema = new Schema<TCategory>({
  name: { type: String, unique: true, required: [true, "Name is required"] },
});

export const Category = mongoose.model<TCategory>("Category", categorySchema);
