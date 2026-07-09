import express from "express";
import { sendResponse } from "../utils/helper.js";
import { travelModel } from "../models/travel.model.js";
const travelMdl = new travelModel();

export const checkTravelDateConflict = async (req, res, next) => {
  try {
    let { id, user_id, from_date, user_accept } = req.body;
    // User already accepted conflict
    if (user_accept === 1) {
      return next();
    }

    // Update API
    if (id) {
      const userResult = await travelMdl.getUserIdFromTravel(id);

      if (userResult.success === 0 || userResult.data.length === 0) {
        return sendResponse(res, 200, 0, "Travel not found", [], "");
      }

      user_id = userResult.data[0].user_id;
    }

    const conflictResult = await travelMdl.checkTravelDateConflict(
      user_id,
      from_date,
      id,
    );

    if (conflictResult.success === 0) {
      return sendResponse(
        res,
        500,
        0,
        "Failed to check Travel conflict",
        [],
        "",
      );
    }

    if (conflictResult?.data?.length > 0) {
      return sendResponse(
        res,
        200,
        4,
        "Travel date conflicts with an existing travel.",
        [],
        "",
      );
    }

    next();
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      error.message,
    );
  }
};
