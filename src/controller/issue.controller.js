import express from "express";
import {
  addIssueSchema,
  deleteIssueSchema,
  validateRequest,
} from "../utils/validator.js";
import { formatDateForSQL, sendResponse } from "../utils/helper.js";
import { issueModel } from "../models/issue.model.js";

const issueMdl = new issueModel();

export const addIssue = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addIssueSchema);
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
    } = validatedData?.value;

    cat_name = cat_name === "" ? null : cat_name;

    media_id = media_id === "" ? null : media_id;
    incharge_id = incharge_id === "" ? null : incharge_id;
    member_id = member_id === "" ? null : member_id;

    report_date = new Date(report_date);
    report_date.setSeconds(0, 0);
    report_date = formatDateForSQL(report_date);

    const result = await issueMdl.addIssue({
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
    });

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Issue added successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to add Issue",
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
export const deleteIssue = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteIssueSchema);
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

    const result = await issueMdl.deleteIssue({ id });

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Issue deleted successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete Issue",
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
