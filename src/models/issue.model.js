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
  async updateIssue({ upt_cols, params }) {
    let query = `UPDATE issues SET ${upt_cols.join(", ")} WHERE id = ?`;

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
  async getIssue({ user_id, status, assigned, from_date, to_date }) {
    let query = `SELECT * FROM issues WHERE user_id = ?`;
    let params = [user_id];

    if (status != null) {
      const placeholders = status.map(()=> "?").join(", ")
      query += ` AND status IN (${placeholders})`;
      params.push(...status);
    }
    if (assigned != null && assigned === 0) {
      query += ` AND incharge_id IS NULL AND member_id IS NULL`;
    }
    if (assigned != null && assigned === 1) {
      query += ` AND incharge_id IS NOT NULL AND member_id IS NOT NULL`;
    }
    if (from_date != null && to_date != null) {
      query += ` AND report_date BETWEEN ? AND ?`;
      params.push(`${from_date} 00:00:00`, `${to_date} 23:59:59`);
    }

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
  async getCatName(id) {
    let query = `SELECT cat_name FROM issue_category WHERE id = ?`;
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
}
