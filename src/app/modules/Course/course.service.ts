import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Review } from "../Review/review.model";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourseFromDB = async () => {
  const result = await Course.find();
  return result;
};

const getCourseByIdWithReviewFromDB = async (id: string) => {
  const getCourse = await Course.findById(id).lean();
  const getReview = await Review.find({ courseId: id }).lean();

  return { getCourse, getReview };
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { tags, details, ...remainingField } = payload;

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
      { new: true, runValidators: true }
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
      { new: true, runValidators: true }
    );

    if (!newTagsCourses) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
    }
  }

  const updateCourse = await Course.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return updateCourse;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCourseFromDB,
  getCourseByIdWithReviewFromDB,
  updateCourseIntoDB,
};
