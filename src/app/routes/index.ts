import express from "express";
import { CategoryRoutes } from "../modules/Category/category.route";
import { CourseRoutes } from "../modules/Course/course.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
