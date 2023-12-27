import { Types } from "mongoose";

export interface TReview {
  courseId: Types.ObjectId;
  rating: number;
  review: string;
  createdBy: Types.ObjectId;
}
