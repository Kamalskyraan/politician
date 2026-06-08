import express from "express";
import { executeQuery } from "../utils/helper.js";

export class issueModel {
  async addIssue({
    user_id,
    cat_id,
    cat_name,
    descp,
    address,
    lat,
    lng,
    media_id,
    report_date,
    incharge_id,
    member_id,
  }) {
    let query = `INSERT INTO issues (user_id,
    cat_id,
    cat_name,
    descp,
    address,
    lat,
    lng,
    media_id,
    report_date,
    incharge_id,
    member_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let params = [
      user_id,
      cat_id,
      cat_name,
      descp,
      address,
      lat,
      lng,
      media_id,
      report_date,
      incharge_id,
      member_id,
    ];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async deleteIssue({ id }) {
    let query = `DELETE FROM issues WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
}
