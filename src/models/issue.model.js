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
    status,
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
    status,
    media_id,
    report_date,
    incharge_id,
    member_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let params = [
      user_id,
      cat_id,
      cat_name,
      descp,
      address,
      lat,
      lng,
      status,
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
  async getIssue({
    user_id,
    status,
    assigned,
    from_date,
    to_date,
    page,
    limit = 10,
  }) {
    const offset = (page - 1) * limit;
    let query = `SELECT id, cat_id, cat_name, descp, address, lat, lng, status, report_date, media_id, incharge_id, member_id FROM issues WHERE user_id = ?`;
    let params = [user_id];

    let CountQuery = `SELECT COUNT(*) AS total FROM ISSUES where user_id = ?`;
    let countParams = [user_id];

    if (status != null) {
      const placeholders = status.map(() => "?").join(", ");
      query += ` AND status IN (${placeholders})`;
      params.push(...status);
      CountQuery += ` AND status IN (${placeholders})`;
      countParams.push(...status);
    }
    if (assigned != null && assigned === 0) {
      query += ` AND incharge_id IS NULL AND member_id IS NULL`;
      CountQuery += ` AND incharge_id IS NULL AND member_id IS NULL`;
    }
    if (assigned != null && assigned === 1) {
      query += ` AND incharge_id IS NOT NULL AND member_id IS NOT NULL`;
      CountQuery += ` AND incharge_id IS NOT NULL AND member_id IS NOT NULL`;
    }
    if (from_date != null && to_date != null) {
      query += ` AND report_date BETWEEN ? AND ?`;
      params.push(`${from_date} 00:00:00`, `${to_date} 23:59:59`);
      CountQuery += ` AND report_date BETWEEN ? AND ?`;
      countParams.push(`${from_date} 00:00:00`, `${to_date} 23:59:59`);
    }

    const countResult = await executeQuery(CountQuery, countParams);
    const total = countResult?.data[0]?.total;

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          total_pages: Number(Math.ceil(total / limit)),
        },
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
  async getIssueInfo(id) {
    let query = `SELECT report_date, user_id FROM issues WHERE id = ?`;
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

  async getTodayIssues(today) {
    let query = `SELECT id, user_id FROM tasks WHERE DATE(report_date) = ?`;
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
  async getOverdueIssues(today) {
    let query = `SELECT id, user_id FROM issues WHERE DATE(report_date) < ? AND status = ?`;
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
