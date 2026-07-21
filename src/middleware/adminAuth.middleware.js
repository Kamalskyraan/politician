import express from "express";

import jwt from "jsonwebtoken";
import { executeQuery, sendResponse } from "../utils/helper.js";

export const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(req.headers.authorization);

    if (!authHeader) {
      return sendResponse(res, 401, 0, "Token is Required", [], "");
    }

    const token = authHeader.split(" ")[1];
    // console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    const { user_name } = decoded;

    const query = `
      SELECT user_name
      FROM admin
      WHERE user_name = ?`;

    const result = await executeQuery(query, [user_name]);

    if (result?.success === 1 && result?.data?.length > 0) {
      req.user = decoded;
      return next();
    }

    return sendResponse(res, 401, 2, "wrong credentials", [], "");
    // res.status(401).json({
    //   success: 0,
    //   message: "Logged in from another device",
    //   code: 2,
    // });
  } catch (error) {
    return sendResponse(
      res,
      401,
      2,
      "Invalid Token or token expired",
      [],
      error.message,
    );
  }
};
