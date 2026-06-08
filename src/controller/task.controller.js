import express from "express";
import { formatDateForSQL, sendResponse } from "../utils/helper.js";
import {
  addTaskSchema,
  deleteTaskSchema,
  updateTaskSchema,
  validateRequest,
} from "../utils/validator.js";
import { taskModel } from "../models/task.model.js";

const taskMdl = new taskModel();

export const addTask = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addTaskSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    let {
      user_id,
      title,
      descp,
      t_priority,
      from_date,
      to_date,
      media_id,
      attnds_id,
      is_remind,
      remind_tenure,
      snooze_at,
    } = validatedData?.value;

    media_id = media_id === "" ? null : media_id;
    remind_tenure = remind_tenure === "" ? null : Number(remind_tenure);
    snooze_at = snooze_at === "" ? null : Number(snooze_at);

    let status = "pending";

    const sts_date = new Date(from_date);
    const today = new Date();

    if (
      sts_date.getFullYear() > today.getFullYear ||
      sts_date.getMonth() > today.getMonth() ||
      sts_date.getDate() > today.getDate()
    ) {
      status = "upcoming";
    }

    let remind_at = null;
    let nxt_snooze_at = null;
    from_date = new Date(from_date);
    to_date = new Date(to_date);
    from_date.setSeconds(0, 0);
    to_date.setSeconds(0, 0);

    if (is_remind === 1 && remind_tenure) {
      remind_at = from_date.getTime() - remind_tenure * 1000;
      if (snooze_at != undefined) {
        nxt_snooze_at = remind_at + snooze_at * 1000;
        nxt_snooze_at = new Date(nxt_snooze_at);
        nxt_snooze_at.setSeconds(0, 0);
        nxt_snooze_at = formatDateForSQL(nxt_snooze_at);
      }
      remind_at = new Date(remind_at);
      remind_at.setSeconds(0, 0);
      remind_at = formatDateForSQL(remind_at);
    }

    const result = await taskMdl.addTask({
      user_id,
      title,
      descp,
      t_priority,
      from_date,
      to_date,
      media_id,
      attnds_id,
      status,
      is_remind,
      remind_tenure,
      remind_at,
      snooze_at,
      nxt_snooze_at,
    });

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Task added successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to add task", [], "");
    }
  } catch (error) {
    return sendResponse(res, 500, "Internal server error", [], error.message);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteTaskSchema);
    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }
    const { id } = validatedData?.value;

    const result = await taskMdl.deleteTask({ id });

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Task deleted successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to delete task", [], "");
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

export const updateTask = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateTaskSchema);
    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }
    let {
      id,
      title,
      descp,
      t_priority,
      from_date,
      to_date,
      media_id,
      attnds_id,
      is_remind,
      remind_tenure,
      snooze_at,
    } = validatedData?.value;

    media_id = media_id === "" ? null : media_id;
    remind_tenure = remind_tenure === "" ? null : Number(remind_tenure);
    snooze_at = snooze_at === "" ? null : Number(snooze_at);

    let upt_cols = [];
    let params = [];

    if (title != undefined) {
      upt_cols.push("title = ?");
      params.push(title);
    }
    if (descp != undefined) {
      upt_cols.push("descp = ?");
      params.push(descp);
    }
    if (t_priority != undefined) {
      upt_cols.push("t_priority = ?");
      params.push(t_priority);
    }
    if (to_date != undefined) {
      to_date = new Date(to_date);
      to_date.setSeconds(0, 0);
      to_date = formatDateForSQL(to_date);

      upt_cols.push("to_date = ?");
      params.push(to_date);
    }

    let status = "pending";
    let remind_at = null;
    let nxt_snooze_at = null;
    if (from_date != undefined && is_remind === 0) {
      from_date = new Date(from_date);
      from_date.setSeconds(0, 0);
      from_date = formatDateForSQL(from_date);
      let sts_date = from_date;
      let today = new Date();

      if (
        sts_date.getFullYear() > today.getFullYear ||
        sts_date.getMonth() > today.getMonth() ||
        sts_date.getDate() > today.getDate()
      ) {
        status = "upcoming";
      }

      upt_cols.push(
        "from_date = ?, t_status = ?, is_remind = ?, remind_tenure = ?, remind_at = ?, snooze_at = ?, nxt_snooze_at = ?",
      );
      params.push(
        from_date,
        status,
        is_remind,
        remind_tenure,
        remind_at,
        snooze_at,
        nxt_snooze_at,
      );
    }

    if (from_date != undefined && is_remind === 1) {
      from_date = new Date(from_date);
      let sts_date = from_date;
      let today = new Date();
      if (
        sts_date.getFullYear() > today.getFullYear ||
        sts_date.getMonth() > today.getMonth() ||
        sts_date.getDate() > today.getDate()
      ) {
        status = "upcoming";
      }
      remind_at = from_date.getTime() - remind_tenure * 1000;
      if (snooze_at != undefined) {
        nxt_snooze_at = remind_at + snooze_at * 1000;
      }

      remind_at = new Date(remind_at);
      nxt_snooze_at = new Date(nxt_snooze_at);

      from_date.setSeconds(0, 0);
      remind_at.setSeconds(0, 0);
      nxt_snooze_at.setSeconds(0, 0);

      from_date = formatDateForSQL(from_date);
      remind_at = formatDateForSQL(remind_at);
      nxt_snooze_at = formatDateForSQL(nxt_snooze_at);

      upt_cols.push(
        "from_date = ?, t_status = ?, is_remind = ?, remind_tenure = ?, remind_at = ?, snooze_at = ?, nxt_snooze_at = ?",
      );
      params.push(
        from_date,
        status,
        is_remind,
        remind_tenure,
        remind_at,
        snooze_at,
        nxt_snooze_at,
      );
    }

    if (media_id != undefined) {
      upt_cols.push("media_id = ?");
      params.push(media_id);
    }
    if (attnds_id != undefined) {
      upt_cols.push("attnds_id = ?");
      params.push(attnds_id);
    }

    upt_cols.push("id = ?");
    params.push(id);

    const result = await taskMdl.updateTask({ upt_cols, params });

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Task added successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to add task", [], result?.error);
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
