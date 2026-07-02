import express from "express";
import { executeQuery, sendResponse } from "../utils/helper.js";

export class reminderModel {
  async getReminder({ user_id, status }) {
    let query;
    let params;

    if (status != null) {
      query = `SELECT id, "meeting" AS type, title, descp AS description, address, lat, lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM meeting WHERE user_id = ? AND is_remind = ? AND status IN ("upcoming", "pending") AND remind_status = ? UNION ALL 
    SELECT id, "appointment" AS type, title, notes AS description, address, lat, lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM appointments WHERE user_id = ? AND is_remind = ? AND status IN ("upcoming", "pending") AND remind_status = ? UNION ALL 
    SELECT id, "task" AS type, title, descp AS description, "" AS address, "" AS lat, "" AS lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM tasks WHERE user_id = ? AND is_remind = ? AND t_status IN ("inprogress", "pending") AND remind_status = ? UNION ALL 
    SELECT id, "travel" AS type, title, descp AS description, travel_to, to_lat, to_lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM travels WHERE user_id = ? AND is_remind = ? AND remind_status = ?`;
      params = [
        user_id,
        1,
        status,
        user_id,
        1,
        status,
        user_id,
        1,
        status,
        user_id,
        1,
        status,
      ];
    } else {
      query = `SELECT id, "meeting" AS type, title, descp AS description, address, lat, lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM meeting WHERE user_id = ? AND is_remind = ? AND status IN ("upcoming", "pending") AND remind_status IN ("pending","snoozed","completed") UNION ALL 
    SELECT id, "appointment" AS type, title, notes AS description, address, lat, lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM appointments WHERE user_id = ? AND is_remind = ? AND status IN ("upcoming", "pending") AND remind_status IN ("pending","snoozed","completed") UNION ALL 
    SELECT id, "task" AS type, title, descp AS description, "" AS address, "" AS lat, "" AS lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM tasks WHERE user_id = ? AND is_remind = ? AND t_status IN ("inprogress", "pending") AND remind_status IN ("pending","snoozed","completed") UNION ALL 
    SELECT id, "travel" AS type, title, descp AS description, travel_to, to_lat, to_lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM travels WHERE user_id = ? AND is_remind = ? AND remind_status IN ("pending","snoozed","completed")
    `;
      params = [user_id, 1, user_id, 1, user_id, 1, user_id, 1];
    }

    const result = await executeQuery(query, params);
    // console.log(result);
    if (result?.data.length === 0) {
      return {
        success: 0,
        error: "No reminders found",
      };
    } else if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    }
  }
  async reminder(
    user_id,
    remind_time,
    is_remind,
    snooze_at,
    next_snooze_at,
    table_name,
  ) {
    let result;
    if (is_remind === 1) {
      for (const table of table_name) {
        let query = `UPDATE ${table}
     SET remind_status = ?, snooze_at = ?, nxt_snooze_at = ?
     WHERE user_id = ? AND remind_at = ? AND is_remind = ?`;
        let params = [
          "snoozed",
          snooze_at,
          next_snooze_at,
          user_id,
          remind_time,
          1,
        ];
        result = await executeQuery(query, params);
      }
    } else if (is_remind === 2) {
      for (const table of table_name) {
        let query = `UPDATE ${table}
     SET remind_status = ?, is_remind = ?
     WHERE user_id = ? AND remind_at = ? AND is_remind = ?`;
        let params = ["completed", 2, user_id, remind_time, 1];
        result = await executeQuery(query, params);
      }
    }
    // console.log(result);

    // const result = await executeQuery(query, params);
    if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    } else if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    }
  }
  async getUpcomingReminder(user_id) {
    const is_remind = 1;

    let query = `SELECT id, "meeting" AS type, title, descp AS description, address, lat, lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM MEETING WHERE user_id = ? AND is_remind = ? AND remind_status IN ('pending','snoozed') AND remind_at >= NOW()
    UNION ALL 
    SELECT id, "appointment" AS type, title, notes AS description, address, lat, lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM appointments WHERE user_id = ? AND is_remind = ? AND remind_status IN ('pending','snoozed') AND remind_at >= NOW()
    UNION ALL 
    SELECT id, "task" AS type, title, descp AS description, "" AS address, "" AS lat, "" AS lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM tasks WHERE user_id = ? AND is_remind = ? AND remind_status IN ('pending','snoozed') AND remind_at >= NOW()
    UNION ALL
    SELECT id, "travel" AS type, title, descp AS description, travel_to, to_lat, to_lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM travels WHERE user_id = ? AND is_remind = ? AND remind_status IN ('pending','snoozed') AND remind_at >= NOW()
    ORDER BY remind_at ASC LIMIT 15`;

    let params = [
      user_id,
      is_remind,
      user_id,
      is_remind,
      user_id,
      is_remind,
      user_id,
      is_remind,
    ];

    const result = await executeQuery(query, params);
    console.log(result)
    if (result?.data.length === 0) {
      return {
        success: 0,
        error: "No reminders found",
      };
    } else if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    }
  }
}
