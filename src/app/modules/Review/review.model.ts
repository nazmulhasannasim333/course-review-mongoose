/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose, { Schema } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    required: [true, "CourseId is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must not exceed 5"],
  },
  review: { type: String, required: [true, "Review is required"] },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: [true, "Creator id is required"],
    ref: "user",
  },
});

export const Review = mongoose.model<TReview>("Review", reviewSchema);
