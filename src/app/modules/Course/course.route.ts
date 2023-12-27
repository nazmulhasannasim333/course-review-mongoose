import express from "express";
import { CourseController } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/courses",
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse
);
router.get(
  "/courses",
  auth(USER_ROLE.admin, USER_ROLE.user),
  CourseController.getAllCourse
);
router.get(
  "/courses/:id/reviews",
  auth(USER_ROLE.admin, USER_ROLE.user),
  CourseController.getCourseByIdWithReview
);
router.get(
  "/course/best",
  auth(USER_ROLE.admin, USER_ROLE.user),
  CourseController.getBestCourse
);
router.put(
  "/courses/:id",
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse
);

export const CourseRoutes = router;
