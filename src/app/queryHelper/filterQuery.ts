import { Query } from "mongoose";
import { CourseQuery } from "../interface/queryTypes";

export const filter = <T>(modelQuery: Query<T[], T>, query: CourseQuery) => {
  const queryObj = { ...query };
  const excludedFields = [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "minPrice",
    "maxPrice",
  ];

  excludedFields.forEach((queryKeyword) => delete queryObj[queryKeyword]);

  const findQuery = modelQuery.find(queryObj);
  return findQuery;
};
