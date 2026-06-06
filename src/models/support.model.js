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
}
