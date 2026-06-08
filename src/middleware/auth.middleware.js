import express from "express";

import jwt from "jsonwebtoken";
import { executeQuery, sendResponse } from "../utils/helper.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(req.headers.authorization);

    if (!authHeader) {
      return sendResponse(res, 401, 0, "Token is Required", [], "");
    }

    const token = authHeader.split(" ")[1];
    // console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { user_id, device_id } = decoded;

    const query = `
      SELECT user_id
      FROM user_device
      WHERE user_id = ?
      AND device_id = ?
    `;

    const result = await executeQuery(query, [user_id, device_id]);

    if (result?.success === 1 && result?.data?.length > 0) {
      req.user = decoded;
      return next();
    }

    return sendResponse(res, 401, 2, "Logged in another Device", [], "");
    // res.status(401).json({
    //   success: 0,
    //   message: "Logged in from another device",
    //   code: 2,
    // });
  } catch (error) {
    return sendResponse(res, 401, 2, "Invalid Token", [], error.message);
  }
};
