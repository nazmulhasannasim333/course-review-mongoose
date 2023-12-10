import { RequestHandler } from "express";
import { ReviewServices } from "./review.service";

const createReview: RequestHandler = async (req, res) => {
  try {
    const result = await ReviewServices.createReviewIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Reviw not found",
      error: {
        code: 404,
        description: "Review not found!",
        error: error,
      },
    });
  }
};

export const ReviewControllers = {
  createReview,
};
