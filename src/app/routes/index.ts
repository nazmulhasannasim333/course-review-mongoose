import express from "express";
import { CategoryRoutes } from "../modules/Category/category.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { ReviewRoutes } from "../modules/Review/review.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "",
    route: CourseRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
