import express from "express";
import { executeQuery } from "../utils/helper.js";

export class notificationModel {
  async addNotification(data) {
    const { receiver_id, title, message, type, reference_type, reference_id } =
      data;
    // console.log(receiver_id, title, message, type, reference_type, reference_id);
    let query = `INSERT INTO notifications (receiver_id, title, message, reference_type, reference_id, type) VALUES (?, ?, ?, ?, ?, ?)`;
    let params = [
      receiver_id,
      title,
      message,
      reference_type,
      reference_id,
      type,
    ];

    const result = await executeQuery(query, params);
  }
  async deleteNotification(data) {
    const { receiver_id, reference_type, reference_id } = data;

    let query = `DELETE FROM notifications WHERE receiver_id = ? AND reference_type = ? AND reference_id = ?`;
    let params = [receiver_id, reference_type, reference_id];

    const result = await executeQuery(query, params);
  }
  async getNotification(user_id) {
    let query = `SELECT id, receiver_id, title, message, reference_type, reference_id, is_view, is_read, type, created_at FROM notifications WHERE receiver_id = ? ORDER BY id DESC`;
    let params = [user_id];

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
  async notificationViewChange(user_id, id) {
    let query = `UPDATE notifications SET is_view = ? WHERE receiver_id = ? AND id <= ?`;
    let params = [1, user_id, id];

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
  async notificationReadChange(id) {
    let query = `UPDATE notifications SET is_read = ? WHERE id = ?`;
    let params = [1, id];

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
  async getNotificationActiveCount(user_id) {
    let query = `SELECT COUNT(*) AS count FROM notifications WHERE receiver_id = ? AND is_view = 0`;
    let params = [user_id];

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
