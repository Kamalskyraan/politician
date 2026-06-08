import express from "express";
import { executeQuery } from "../utils/helper.js";

export class supportModel {
  async addfaq(question, answer) {
    let query = `INSERT INTO faq (question, answer) VALUES (?, ?)`;
    let params = [question, answer];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        message: "faq added successfully",
      };
    } else {
      return {
        success: 0,
        message: "faq failed to add",
      };
    }
  }

  async getFaq(status) {
    let query = `SELECT id, question, answer, status FROM faq WHERE status = ?`;
    let params = [status];

    const result = await executeQuery(query, params);
    console.log(result);

    if (result?.data.length >= 1) {
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

  async updateFaq(id, question, answer, status) {
    let query = `UPDATE faq SET question = ?, answer = ?, status = ? WHERE id = ?`;
    let params = [question, answer, status, id];

    const result = await executeQuery(query, params);
    // console.log(result);
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

  async contactUs(user_id, name, phn_num, c_code, email, comments) {
    let query = `INSERT INTO contact_us (user_id, name, phn_num, c_code, email, comments) VALUES (?, ?, ?, ?, ?, ?)`;
    let params = [user_id, name, phn_num, c_code, email, comments];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else {
      return {
        success: 0,
        data: result?.error,
      };
    }

    // console.log(result)
  }

  async getLocations(user_id) {
    let query = `SELECT DISTINCT
    country,
    state,
    district,
    COUNT(*) AS member_count
  FROM members
  WHERE user_id = ?
  GROUP BY country, state, district
  ORDER BY country, state, district;`;
    let params = [user_id];

    const result = await executeQuery(query, params);
    // console.log(result);

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
  async updateStatus({ id, status, table_name, col_name }) {
    let query = `UPDATE ${table_name} SET ${col_name} = ? WHERE id = ?`;
    let params = [status, id];

    const result = await executeQuery(query, params);
    // console.log(result);

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
  async addIssueCat({ category }) {
    let query = `INSERT INTO issue_category (cat_name) VALUES (?)`;
    let params = [category];

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
