import express from "express";
import {
  addSumitSchema,
  deleteSumitSchema,
  getSumitSchema,
  validateRequest,
} from "../utils/validator.js";
import { sendResponse } from "../utils/helper.js";
import { politicalSumitModel } from "../models/politicalsumit.model.js";

const sumitMdl = new politicalSumitModel();

export const addSumit = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addSumitSchema);
    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }
    let {
      user_id,
      title,
      location,
      lat,
      lng,
      sumit_date,
      vip,
      member,
      sumit_incharge,
      dept_incharge,
    } = validatedData?.value;

    let sts = "upcoming";
    const sts_date = new Date(sumit_date);
    const today = new Date();

    if (
      sts_date.getFullYear() === today.getFullYear() &&
      sts_date.getMonth() === today.getMonth() &&
      sts_date.getDate() === today.getDate()
    ) {
      sts = "inprogress";
    }
    const result = await sumitMdl.addSumit({
      user_id,
      title,
      location,
      lat,
      lng,
      sumit_date,
      sts,
      vip,
      member,
      sumit_incharge,
      dept_incharge,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Political sumit added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to add political sumit",
        [],
        result?.error,
      );
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      error.message,
    );
  }
};
export const deletesumit = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteSumitSchema);
    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }
    let { id } = validatedData?.value;

    const result = await sumitMdl.deleteSumit({ id });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Political sumit deleted successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete political sumit",
        [],
        result?.error,
      );
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      error.message,
    );
  }
};
export const getSumit = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getSumitSchema);
    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }
    let { user_id, status, from_date, to_date } = validatedData?.value;

    status = status === "" ? null : status;
    from_date = from_date === "" ? null : from_date;
    to_date = to_date === "" ? null : to_date;

    let upt_cols = [];
    let params = [];

    if (user_id != null) {
      upt_cols.push("user_id = ?");
      params.push(user_id);
    }
    if (status != null) {
      upt_cols.push(" AND status = ?");
      params.push(status);
    }
    if (from_date != null) {
      upt_cols.push(" AND from_date > ?");
      params.push(from_date);
    }
    if (to_date != null) {
      upt_cols.push(" AND to_date > ?");
      params.push(to_date);
    }

    const result = await sumitMdl.getSumit({ upt_cols, params });

    const data = result?.data;

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Political Sumit fetched successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch political sumit",
        [],
        "",
      );
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      error.message,
    );
  }
};
