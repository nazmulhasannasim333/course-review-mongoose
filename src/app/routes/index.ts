import express from "express";
import { CategoryRoutes } from "../modules/Category/category.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { ReviewRoutes } from "../modules/Review/review.route";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/api/categories",
    route: CategoryRoutes,
  },
  {
    path: "/api",
    route: CourseRoutes,
  },
  {
    path: "/api/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
