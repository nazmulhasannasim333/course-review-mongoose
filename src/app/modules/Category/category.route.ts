import express from "express";
import { CategoryControllers } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidations } from "./category.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/categories",
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory
);
router.get(
  "/categories",
  auth(USER_ROLE.admin, USER_ROLE.user),
  CategoryControllers.getAllCategory
);

export const CategoryRoutes = router;
