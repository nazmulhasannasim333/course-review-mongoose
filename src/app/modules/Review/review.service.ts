import { TReview } from "./review.interface";
import { Review } from "./review.model";

const createReviewIntoDB = async (payload: TReview) => {
  const result = (await Review.create(payload)).populate({
    path: "createdBy",
    select: "_id username email role",
  });
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
};
