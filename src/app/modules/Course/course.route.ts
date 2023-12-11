import express from "express";
import { CourseController } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";

const router = express.Router();

router.post(
  "/course",
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse
);
router.get("/courses", CourseController.getAllCourse);
router.get("/courses/:id/reviews", CourseController.getCourseByIdWithReview);
router.get("/course/best", CourseController.getBestCourse);
router.put("/courses/:id", CourseController.updateCourse);

export const CourseRoutes = router;
