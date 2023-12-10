import express from "express";
import { CategoryControllers } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidations } from "./category.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory
);
router.get("/", CategoryControllers.getAllCategory);

export const CategoryRoutes = router;
