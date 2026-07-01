import express from "express";
import {
  getReminderSchema,
  getUpcomingReminderschema,
  updateReminderSchema,
  validateRequest,
} from "../utils/validator.js";
import {
  formatDateForSQL,
  replaceNullWithEmptyString,
  sendResponse,
} from "../utils/helper.js";
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

    status = status === "" ? null : status;
    let result;

    if (status != null) {
      result = await reminderMdl.getReminder({ user_id, status });
    } else {
      result = await reminderMdl.getReminder({ user_id });
    }

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
export const updateReminder = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateReminderSchema);

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

    const { id, type, is_remind, snooze_at } = validatedData?.value;
    let update_column = [];
    let params = [];
    let table_name;

    if (type === "meeting") {
      table_name = "meeting";
    } else if (type === "appointment") {
      table_name = "appointments";
    } else if (type === "task") {
      table_name = "tasks";
    } else {
      table_name = "travels";
    }

    if (is_remind === 1) {
      let next_snooze_at = new Date().getTime() + Number(snooze_at) * 1000;
      next_snooze_at = new Date(next_snooze_at);
      next_snooze_at.setSeconds(0, 0);
      next_snooze_at = formatDateForSQL(next_snooze_at);

      update_column.push(
        `UPDATE ${table_name} SET remind_status = ?, nxt_snooze_at = ? WHERE id = ?`,
      );
      params.push("snoozed", next_snooze_at, id);
    } else if (is_remind === 2) {
      update_column.push(
        `UPDATE ${table_name} SET remind_status = ? WHERE id = ?`,
      );
      params.push("completed", id);
    }

    const result = await reminderMdl.reminder(update_column, params);
    if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update reminder status",
        [],
        result?.error,
      );
    } else if (result?.success === 1) {
      return sendResponse(res, 200, 1, "reminder updated successfully", [], "");
    }
  } catch (error) {
    return sendResponse(res, 500, 0, "Internal server error", [], "");
  }
};
export const upcomingReminder = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getUpcomingReminderschema);

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

    const { user_id } = validatedData?.value;

    const result = await reminderMdl.getUpcomingReminder(user_id);
    // console.log(result);
    const dataResult = result?.data;

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Upcoming Reminders fetched successfully",
        dataResult,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch upcoming reminders",
        [],
        "",
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
