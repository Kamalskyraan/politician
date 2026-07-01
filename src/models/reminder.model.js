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
  async reminder(update_column, params) {
    const query = update_column.join("");
    // console.log(query);
    // console.log(params);

    const result = await executeQuery(query, params);
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
    // console.log(result)
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
