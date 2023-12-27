import { CourseServices } from "./course.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCourse = catchAsync(async (req, res) => {
  req.body.createdBy = req.user._id;
  const result = await CourseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

const getAllCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCourseFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrieved successfully",
    data: { courses: result.data, meta: result.meta },
  });
});

const getCourseByIdWithReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getCourseByIdWithReviewFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course and Reviews retrieved successfully",
    data: { course: result.getCourse, reviews: result.getReview },
  });
});

const getBestCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getBestCourseFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best course retrieved successfully",
    data: {
      course: {
        ...result.bestCourse,
        averageRating: result.formattedAverageRating,
        reviewCount: result.reviewCount,
        createdBy: result.createdBy,
      },
    },
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourse,
  getCourseByIdWithReview,
  updateCourse,
  getBestCourse,
};
