/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Review } from "../Review/review.model";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";
import mongoose from "mongoose";
import { CourseQuery } from "../../interface/queryTypes";

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);

  return result;
};

const getAllCourseFromDB = async (query: CourseQuery) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "startDate",
    sortOrder = "asc",
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = query;

  const filters: Record<string, any> = {};

  // Apply filters
  if (minPrice !== undefined || maxPrice !== undefined) {
    filters.price = {};
    if (minPrice !== undefined) filters.price.$gte = minPrice;
    if (maxPrice !== undefined) filters.price.$lte = maxPrice;
  }

  if (tags) filters["tags.name"] = tags;

  if (startDate) filters.startDate = { $gte: startDate };
  if (endDate) filters.endDate = { $lte: endDate };

  if (language) filters.language = language;
  if (provider) filters.provider = provider;

  if (durationInWeeks !== undefined) filters.durationInWeeks = durationInWeeks;

  if (level) filters["details.level"] = level;

  // Get total count of documents that match the filters
  const totalCount = await Course.countDocuments(filters);

  // Retrieve paginated data
  const result = await Course.find(filters)
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: result,
    meta: {
      page,
      limit,
      total: totalCount,
    },
  };
};

const getCourseByIdWithReviewFromDB = async (id: string) => {
  const getCourse = await Course.findById(id).lean();
  const getReview = await Review.find(
    { courseId: id },
    { _id: 0, __v: 0 }
  ).lean();

  return { getCourse, getReview };
};

const getBestCourseFromDB = async () => {
  const bestCourseData = await Course.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "courseId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    { $limit: 1 },
    {
      $project: {
        reviews: 0,
      },
    },
  ]);
  const bestCourse = bestCourseData[0];
  const formattedAverageRating = Number(bestCourse?.averageRating?.toFixed(1));
  const reviewCount = bestCourse.reviewCount;

  return { bestCourse, formattedAverageRating, reviewCount };
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const {
    tags,
    details,
    startDate,
    endDate,
    durationInWeeks,
    ...remainingField
  } = payload;

  // Check if user want to update durationInWeeks directly
  if (durationInWeeks !== undefined) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot update durationInWeeks directly"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // update primitive and non primitive data
    const modifiedUpdatedData: Record<string, unknown> = {
      ...remainingField,
    };

    if (details && Object.keys(details).length) {
      for (const [key, value] of Object.entries(details)) {
        modifiedUpdatedData[`details.${key}`] = value;
      }
    }

    if (!modifiedUpdatedData) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
    }

    // Calculate durationInWeeks based on startDate and endDate
    if (startDate && endDate) {
      const timeDifference =
        new Date(endDate).getTime() - new Date(startDate).getTime();
      modifiedUpdatedData["durationInWeeks"] = Math.ceil(
        timeDifference / (1000 * 3600 * 24 * 7)
      );
      modifiedUpdatedData["startDate"] = new Date(startDate)
        .toISOString()
        .substr(0, 10);
      modifiedUpdatedData["endDate"] = new Date(endDate)
        .toISOString()
        .substr(0, 10);
    }

    // check there have any pre tag fields
    if (tags && tags.length > 0) {
      // filter out the deleted field
      const deletedTags = tags
        .filter((el) => el?.name && el.isDeleted)
        .map((el) => el.name);

      const deletedTagsCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            tags: { name: { $in: deletedTags } },
          },
        },
        { session, new: true, runValidators: true }
      );

      if (!deletedTagsCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
      }

      // filter out the deleted field
      const newPreTags = tags?.filter((el) => el?.name && !el.isDeleted);

      // Check if any of the new tags already exist
      const existingTags = await Course.findOne({
        _id: id,
        "tags.name": { $in: newPreTags.map((el) => el.name) },
      });

      if (existingTags) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Tag with the same name already exists"
        );
      }
      const newTagsCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { tags: { $each: newPreTags } },
        },
        { session, new: true, runValidators: true }
      );

      if (!newTagsCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
      }
    }

    const updateCourse = await Course.findByIdAndUpdate(
      id,
      modifiedUpdatedData,
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    await session.commitTransaction();
    await session.endSession();

    return updateCourse;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
  }
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCourseFromDB,
  getCourseByIdWithReviewFromDB,
  updateCourseIntoDB,
  getBestCourseFromDB,
};
