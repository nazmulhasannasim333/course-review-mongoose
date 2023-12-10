import { RequestHandler } from "express";
import { CategoryServices } from "./category.service";

const createCategory: RequestHandler = async (req, res) => {
  try {
    const result = await CategoryServices.createCategoryIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Category not found",
      error: {
        code: 404,
        description: "Category not found!",
        error: error,
      },
    });
  }
};

const getAllCategory: RequestHandler = async (req, res) => {
  try {
    const result = await CategoryServices.getAllCategoryFromDB();
    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Category not found",
      error: {
        code: 404,
        description: "Category not found!",
        error: error,
      },
    });
  }
};

export const CategoryControllers = {
  createCategory,
  getAllCategory,
};
