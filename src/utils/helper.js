import dotenv from "dotenv";
import db from "../config/db.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

dotenv.config();

export const genarateotp = ({ phn_num, c_code }) => {
  let otp;

  // const test_numbers = ["8668133876" , "9876543210"]

  if (process.env.NODE_ENV === "development") {
    otp = "1234";
  } else if (phn_num === "9487586186" || phn_num === "9876543210") {
    otp = "1234";
  } else {
    otp = Math.floor(1000 + Math.random() * 9000);
  }
  return otp;
};

export const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await db.execute(query, params);
    // console.log("from execute query",rows);
    return {
      success: 1,
      data: rows,
    };
  } catch (error) {
    return {
      success: 0,
      error: error.message,
    };
  }
};

export const sendResponse = async (
  res,
  statuscode,
  success,
  message,
  data,
  error,
) => {
  return res.status(statuscode).json({
    status: statuscode,
    success: success,
    message: message,
    data: data || "",
    error: error || "",
  });
};

export const createUserID = async () => {
  const key = Date.now().toString().slice(-4);
  const user_id = `USER_${nanoid(4)}${key}`;
  return user_id;
};

export const getCurrentDateTime = async () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, 0);
  const day = String(now.getDay()).padStart(2, 0);

  const hours = String(now.getHours()).padStart(2, 0);
  const minutes = String(now.getMinutes()).padStart(2, 0);
  const seconds = String(now.getSeconds()).padStart(2, 0);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const generateJwtToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

export const formatDateForSQL = (dateObj) => {
  if (!dateObj) return null;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// export const formatDateForSQL = (dateObj) => {
//   if (!dateObj) return null; // handle missing/null safely
//   return new Date(dateObj).toISOString().slice(0, 19).replace("T", " ");
// };

// export const convertToMilliseconds = (date) => {
//   return new Date(date).getTime();
// };

export const replaceNullWithEmptyString = (data) => {
  return JSON.parse(JSON.stringify(data, (_, value) => value ?? ""));
};

export const dateToMillis = (data, dateCols) => {
  // array
  if (Array.isArray(data)) {
    data.forEach((item) => {
      dateToMillis(item, dateCols);
    });

    return data;
  }

  // object
  if (data && typeof data === "object") {
    Object.keys(data).forEach((key) => {
      const value = data[key];

      // convert date fields
      if (dateCols.includes(key) && value !== "") {
        data[key] = new Date(value);
      }
      // nested object / nested array
      else if (typeof value === "object" && value !== null) {
        dateToMillis(value, dateCols);
      }
    });
  }

  return data;
};

export const getDaysDiff = (date) =>
  Math.floor((Date.now() - new Date(date)) / 86400000);
