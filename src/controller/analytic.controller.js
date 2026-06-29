import { analyticsModel } from "../models/analytic.model.js";
import { replaceNullWithEmptyString, sendResponse } from "../utils/helper.js";
import {
  fetchAnalyticsSchema,
  validateRequest,
  validateRequests,
} from "../utils/validator.js";

const analytics = new analyticsModel();

export const getAnalyticsData = async (req, res) => {
  try {
    const {
      user_id,
      c_status,
      type,
      page = 1,
      limit = 10,
    } = validateRequests(req.body, fetchAnalyticsSchema);

    const [analyticsData, analyticsCount] = await Promise.all([
      analytics.fetchAnalytics({
        user_id,
        c_status,
        type,
        page,
        limit,
      }),
      analytics.fetchAnalticCount({
        user_id,
        type,
      }),
    ]);

    return sendResponse(
      res,
      200,
      1,
      "Analytics fetched successfully",
      [
        {
          counts: replaceNullWithEmptyString(analyticsCount.data),
          list: replaceNullWithEmptyString(analyticsData.list),
          pagination: replaceNullWithEmptyString(analyticsData.pagination),
        },
      ],
      [],
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal Server Error",
      [],
      error.message,
    );
  }
};
