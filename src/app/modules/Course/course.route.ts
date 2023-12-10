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

export const CourseRoutes = router;
