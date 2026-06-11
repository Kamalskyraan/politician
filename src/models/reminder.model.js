import express from "express";
import { executeQuery, sendResponse } from "../utils/helper.js";

export class reminderModel {
  async getReminder({ user_id }) {
    let query = `SELECT id, title, address, lat, lng, from_date, is_remind, remind_status, remind_at, nxt_snooze_at FROM meeting WHERE user_id = ? AND remind_status IN ("pending","snoozed")`;
    let params = [user_id];

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
}
