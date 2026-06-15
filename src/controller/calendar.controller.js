import express from "express";
import { replaceNullWithEmptyString, sendResponse } from "../utils/helper.js";
import {
  getcalendarEventSchema,
  getcalendarSchema,
  validateRequest,
} from "../utils/validator.js";
import { calendarModel } from "../models/calendar.model.js";

const calendarMdl = new calendarModel();

export const getCalendarInfo = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getcalendarSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }
    let { user_id, from_date, to_date } = validatedData?.value;
    from_date = `${from_date} 00:00:00`;
    to_date = `${to_date} 23:59:59`;
    let result = await calendarMdl.getCalendarInfo({
      user_id,
      from_date,
      to_date,
    });
    let calendarResult = [];
    let calendarMap = {};
    if (result?.data.length > 1) {
      calendarResult = await result?.data;

      for (const row of calendarResult) {
        let current = new Date(
          row.from_date > from_date ? row.from_date : from_date,
        );
        let end = new Date(row.to_date < to_date ? row.to_date : to_date);

        while (current <= end) {
          const dateKey =
            current.getFullYear() +
            "-" +
            String(current.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(current.getDate()).padStart(2, "0");

          if (!calendarMap[dateKey]) {
            calendarMap[dateKey] = {
              meeting_count: 0,
              appointment_count: 0,
              task_count: 0,
            };
          }

          if (row.type === "meeting") {
            calendarMap[dateKey].meeting_count++;
          }

          if (row.type === "appointment") {
            calendarMap[dateKey].appointment_count++;
          }

          if (row.type === "task") {
            calendarMap[dateKey].task_count++;
          }

          current.setDate(current.getDate() + 1);
        }
      }
      calendarMap = [calendarMap];
    }

    let finalResponse = replaceNullWithEmptyString(
      result?.data.length > 1 ? calendarMap : calendarResult,
    );

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Calendar info fetched successfully",
        finalResponse,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to get calendar info",
        [],
        result?.error,
      );
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
export const getTodayEvents = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getcalendarEventSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }
    let { user_id, event_date } = validatedData?.value;

    event_date = event_date === "" ? null : event_date;

    let result;

    if (event_date == null) {
      const today = new Date();
      event_date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    } else {
      event_date = `${event_date}`;
    }

    result = await calendarMdl.getEvent({ user_id, event_date });

    let data = result?.data;
    data = replaceNullWithEmptyString(data);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Event info fetched successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to get Event info",
        [],
        result?.error,
      );
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
