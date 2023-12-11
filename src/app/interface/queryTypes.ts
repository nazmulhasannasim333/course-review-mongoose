export interface CourseQuery {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  tags?: string;
  startDate?: Date;
  endDate?: Date;
  language?: string;
  provider?: string;
  durationInWeeks?: number;
  level?: string;
}
