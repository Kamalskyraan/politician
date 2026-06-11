import express from "express";
import { getReminderSchema, validateRequest } from "../utils/validator.js";
import { replaceNullWithEmptyString, sendResponse } from "../utils/helper.js";
import { reminderModel } from "../models/reminder.model.js";

const reminderMdl = new reminderModel();

export const getReminder = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getReminderSchema);
    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.error,
      );
    }
    let { user_id, status } = validatedData?.value;

    let result = await reminderMdl.getReminder({ user_id });

    const dataResult = replaceNullWithEmptyString(result?.data);
    // console.log(result);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Reminders fetched successfully",
        dataResult,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to fetch reminders", [], "");
    }
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
