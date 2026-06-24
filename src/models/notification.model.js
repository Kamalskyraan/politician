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
    let params = [receiver_id, reference_type, reference_type];

    const result = await executeQuery(query, params);
  }
}
