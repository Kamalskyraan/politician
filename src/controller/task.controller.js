import express from "express";
import {
  formatDateForSQL,
  replaceNullWithEmptyString,
  sendResponse,
} from "../utils/helper.js";
import {
  addTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
  updateTaskSchema,
  validateRequest,
} from "../utils/validator.js";
import { taskModel } from "../models/task.model.js";
import { sourceModel } from "../models/source.model.js";
import { meetingModel } from "../models/meeting.model.js";

const taskMdl = new taskModel();
const sourceMdl = new sourceModel();
const meetingMdl = new meetingModel();

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

    let status = "inprogress";

    const sts_date = new Date(from_date);
    const today = new Date();

    if (
      sts_date.getFullYear() > today.getFullYear ||
      sts_date.getMonth() > today.getMonth() ||
      sts_date.getDate() > today.getDate()
    ) {
      status = "pending";
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
    from_date = formatDateForSQL(from_date);
    to_date = formatDateForSQL(to_date);

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

    const data = {
      id: result?.data?.insertId,
      title: title,
      descp: descp,
      t_priority: 1,
      from_date: from_date,
      to_date: to_date,
      t_status: status,
      is_remind: 0,
      remind_status: "pending",
      remind_tenure:
        remind_tenure === null ? remind_tenure : String(remind_tenure),
      remind_at: remind_at,
      snooze_at: snooze_at === null ? snooze_at : String(snooze_at),
      nxt_snooze_at: nxt_snooze_at,
      media_result: [],
      attnds_with_roles: [],
    };

    if (media_id != null) {
      const id = media_id.split(",");
      const result = await sourceMdl.getMedia(id);
      data.media_result = result?.data;
    }
    if (attnds_id != null) {
      const id = attnds_id.split(",");
      const result = await meetingMdl.getattnds(id);
      data.attnds_with_roles = result?.data;

      const attndsWithRoles = await Promise.all(
        data.attnds_with_roles.map(async (attendee) => {
          const id = attendee?.role_id;
          let role_name_result = await meetingMdl.getRole(id);
          let role_name = role_name_result?.data[0]?.role_name;
          const { role_id, ...rest } = attendee;
          return { ...rest, role_name, role_id };
        }),
      );
      data.attnds_with_roles = attndsWithRoles;
    }

    const response = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Task added successfully",
        [response],
        "",
      );
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

    if (title !== undefined) {
      upt_cols.push("title = ?");
      params.push(title);
    }
    if (descp !== undefined) {
      upt_cols.push("descp = ?");
      params.push(descp);
    }
    if (t_priority !== undefined) {
      upt_cols.push("t_priority = ?");
      params.push(t_priority);
    }
    if (to_date !== undefined) {
      to_date = new Date(to_date);
      to_date.setSeconds(0, 0);
      to_date = formatDateForSQL(to_date);

      upt_cols.push("to_date = ?");
      params.push(to_date);
    }

    let status = "inprogress";
    let remind_at = null;
    let nxt_snooze_at = null;

    if (from_date !== undefined && is_remind === 0) {
      from_date = new Date(from_date);
      let sts_date = from_date;
      from_date.setSeconds(0, 0);
      from_date = formatDateForSQL(from_date);
      let today = new Date();

      if (
        sts_date.getFullYear() > today.getFullYear ||
        sts_date.getMonth() > today.getMonth() ||
        sts_date.getDate() > today.getDate()
      ) {
        status = "pending";
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

    if (from_date !== undefined && is_remind === 1) {
      from_date = new Date(from_date);
      let sts_date = from_date;
      let today = new Date();
      if (
        sts_date.getFullYear() > today.getFullYear ||
        sts_date.getMonth() > today.getMonth() ||
        sts_date.getDate() > today.getDate()
      ) {
        status = "pending";
      }
      remind_at = from_date.getTime() - remind_tenure * 1000;
      if (snooze_at !== undefined && snooze_at !== null) {
        nxt_snooze_at = remind_at + snooze_at * 1000;
        nxt_snooze_at = new Date(nxt_snooze_at);
        nxt_snooze_at.setSeconds(0, 0);
        nxt_snooze_at = formatDateForSQL(nxt_snooze_at);
      }

      remind_at = new Date(remind_at);

      from_date.setSeconds(0, 0);
      remind_at.setSeconds(0, 0);

      from_date = formatDateForSQL(from_date);
      remind_at = formatDateForSQL(remind_at);

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

    if (media_id !== undefined) {
      upt_cols.push("media_id = ?");
      params.push(media_id);
    }
    if (attnds_id !== undefined) {
      upt_cols.push("attnds_id = ?");
      params.push(attnds_id);
    }

    params.push(id);

    const result = await taskMdl.updateTask({ upt_cols, params });

    const data = {
      id: result?.data?.insertId,
      title: title,
      descp: descp,
      t_priority: 1,
      from_date: from_date,
      to_date: to_date,
      t_status: status,
      is_remind: 0,
      remind_status: "pending",
      remind_tenure:
        remind_tenure === null ? remind_tenure : String(remind_tenure),
      remind_at: remind_at,
      snooze_at: snooze_at === null ? snooze_at : String(snooze_at),
      nxt_snooze_at: nxt_snooze_at,
      media_result: [],
      attnds_with_roles: [],
    };

    if (media_id != null) {
      const id = media_id.split(",");
      const result = await sourceMdl.getMedia(id);
      data.media_result = result?.data;
    }
    if (attnds_id != null) {
      const id = attnds_id.split(",");
      const result = await meetingMdl.getattnds(id);
      data.attnds_with_roles = result?.data;

      const attndsWithRoles = await Promise.all(
        data.attnds_with_roles.map(async (attendee) => {
          const id = attendee?.role_id;
          let role_name_result = await meetingMdl.getRole(id);
          let role_name = role_name_result?.data[0]?.role_name;
          const { role_id, ...rest } = attendee;
          return { ...rest, role_name, role_id };
        }),
      );
      data.attnds_with_roles = attndsWithRoles;
    }
    const response = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Task updated successfully",
        [response],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update task",
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
export const getTask = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getTaskSchema);
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
    let { user_id, status } = validatedData?.value;

    status = status === "" ? null : status.split(",");
    let result;
    // console.log(status);
    if (status != null) {
      // if status has value
      result = await taskMdl.getTask({ user_id, status });
    } else {
      // if status has not value
      result = await taskMdl.getTask({ user_id, status });
    }

    let data = result?.data;
    // console.log(data);

    const response = await Promise.all(
      data?.map(async (obj) => {
        let media_result;
        let attnds_result;

        if (obj.media_id != null) {
          let media_id = obj.media_id.split(",");
         
          media_result = await sourceMdl.getMedia(media_id);
          media_result = media_result?.data;
          
        }
        let attnds_with_roles = [];
        if (obj.attnds_id != null) {
          let attnds_id = obj.attnds_id.split(",");
          attnds_result = await meetingMdl.getattnds(attnds_id);
          attnds_result = attnds_result?.data;
          // console.log(attnds_result);
          try {
            attnds_with_roles = await Promise.all(
              attnds_result.map(async (attnd_obj) => {
                const id = attnd_obj.role_id;
                let role_name = await meetingMdl.getRole(id);
                role_name = role_name?.data[0]?.role_name;
                const { role_id, ...rest } = attnd_obj;
                return { ...rest, role_name, role_id };
              }),
            );
          } catch (error) {
            attnds_with_roles = attnds_result.map(({ role_id, ...rest }) => ({
              ...rest,
              role_name: null,
            }));
          }
        }
        // console.log(media_result)
        const { media_id, attnds_id, ...rest } = obj;
        return { ...rest, media_result, attnds_with_roles };
      }),
    );

    const finalResponse = replaceNullWithEmptyString(response);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Task fetched successfully",
        finalResponse,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to fetch task", [], "");
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
