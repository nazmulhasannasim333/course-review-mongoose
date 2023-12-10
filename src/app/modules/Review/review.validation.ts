import { z } from "zod";

const createReviewValidationSchema = z.object({
  courseId: z.string(),
  rating: z.number(),
  review: z.string(),
});

export const CategoryValidations = {
  createReviewValidationSchema,
};
