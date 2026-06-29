import express from "express";
import { executeQuery } from "../utils/helper.js";

export class taskModel {
  async addTask({
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
  }) {
    let query = `INSERT INTO tasks (user_id, title, descp, t_priority, from_date, to_date, media_id, attnds_id, t_status, is_remind, remind_tenure, remind_at, snooze_at, nxt_snooze_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let params = [
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
    ];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async deleteTask({ id }) {
    let query = `DELETE FROM tasks WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async updateTask({ upt_cols, params }) {
    let query = `UPDATE tasks SET ${upt_cols.join(", ")} WHERE id = ?`;

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      console.log(result?.error);
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async getTask({ user_id, status, page, limit = 10 }) {
    const offset = (page - 1) * limit;
    let query;
    let params = [];
    let countQuery;
    let countParams = [];
    if (status != null) {
      const placeholders = status.map(() => "?").join(",");

      countQuery = `SELECT COUNT(*) AS total FROM tasks WHERE user_id = ? AND t_status IN (${placeholders})`;
      countParams.push(user_id, ...status);

      query = `SELECT id, title, descp, t_priority, from_date, to_date, media_id, attnds_id, t_status, is_remind, remind_status, remind_tenure, remind_at, snooze_at, nxt_snooze_at FROM tasks WHERE user_id = ? AND t_status IN (${placeholders}) LIMIT ? OFFSET ?`;
      params.push(user_id, ...status, limit, offset);
    } else {
      countQuery = `SELECT FROM tasks WHERE user_id = ? LIMIT ? OFFSET ?`;
      countParams.push(user_id);

      query = `SELECT id, title, descp, t_priority, from_date, to_date, media_id, attnds_id, t_status, is_remind, remind_status, remind_tenure, remind_at, snooze_at, nxt_snooze_at FROM tasks WHERE user_id = ?`;
      params.push(user_id, limit, offset);
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult?.data[0]?.total;

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          total_pages: Math.ceil(total / limit),
        },
      };
    } else if (result?.success === 0) {
      console.log(result?.error);
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async getTaskInfo(id) {
    let query = `SELECT from_date, user_id FROM tasks WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);
    // console.log(result);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async getTodayTasks(today) {
    let query = `SELECT id, user_id FROM tasks WHERE DATE(from_date) = ?`;
    let params = [today];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async getOverdueTasks(today) {
    let query = `SELECT id, user_id FROM tasks WHERE DATE(to_date) < ? AND status = ?`;
    let params = [today, "inprogress"];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
}
