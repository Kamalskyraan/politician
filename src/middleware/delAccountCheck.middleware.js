import express from "express";
import { executeQuery, sendResponse } from "../utils/helper.js";

export const deleteAccountCheck = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {

      let query = `SELECT is_deleted FROM users WHERE email = ?`;
      let params = [email];

      const result = await executeQuery(query, params);
      if (result?.data.length === 0) {
        return next();
      }
      if (result?.data.length === 1) {
        if (result?.data[0]?.is_deleted === 1) {
          return sendResponse(res, 200, 3, "user account was deleted", [], "");
        } else if (result?.data[0]?.is_deleted === 0) {
          return next();
        }
      }
    } else {
      return next();
    }
  } catch (error) {
    return sendResponse(res, 500, 0, "Internal server error", [], error.message);
  }
};
