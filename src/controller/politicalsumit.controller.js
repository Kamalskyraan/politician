import express from "express";
import {
  addSumitSchema,
  deleteSumitSchema,
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

    const result = await sumitMdl.addSumit({
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
