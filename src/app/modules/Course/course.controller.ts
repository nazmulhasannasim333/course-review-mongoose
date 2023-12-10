import { RequestHandler } from "express";
import { CourseServices } from "./course.service";

const createCourse: RequestHandler = async (req, res) => {
  try {
    const result = await CourseServices.createCourseIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Course not found",
      error: {
        code: 404,
        description: "Course not found!",
        error: error,
      },
    });
  }
};

const getAllCourse: RequestHandler = async (req, res) => {
  try {
    const result = await CourseServices.getAllCourseFromDB();
    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Course not found",
      error: {
        code: 404,
        description: "Course not found!",
        error: error,
      },
    });
  }
};

export const CourseController = {
  createCourse,
  getAllCourse,
};
