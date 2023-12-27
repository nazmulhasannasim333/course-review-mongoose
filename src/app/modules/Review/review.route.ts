import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewControllers } from "./review.controller";
import { ReviewValidations } from "./review.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.user),
  validateRequest(ReviewValidations.createReviewValidationSchema),
  ReviewControllers.createReview
);

export const ReviewRoutes = router;
