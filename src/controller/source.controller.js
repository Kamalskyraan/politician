import express from "express";
import { sourceModel } from "../models/source.model.js";
import { sendResponse } from "../utils/helper.js";
import {
  addMediaSchema,
  finCategorySchema,
  validateRequest,
  validateRequests,
} from "../utils/validator.js";

const sourceMdl = new sourceModel();

export const uploadMedia = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addMediaSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    const { user_id } = validatedData?.value;
    const files = req.files;

    if (!files || files.length === 0) {
      return sendResponse(res, 200, 0, "No files uploaded", [], "");
    }

    // console.log(req.files);

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const url = `${file.destination.replace("src", "")}/${file.filename}`;
        const file_type = file.mimetype.split("/");
        const result = await sourceMdl.addMedia({
          user_id,
          url,
          path: file.path,
          size: file.size,
          mime_type: file.mimetype,
          type: file_type[1],
          org_name: file.originalname,
        });
        // console.log(result);

        return {
          id: result?.data?.insertId,
          url: url,
          size: file.size,
        };
      }),
    );

    return sendResponse(
      res,
      200,
      1,
      "Files uploaded successfully",
      uploadedFiles,
      "",
    );
  } catch (error) {
    return sendResponse(res, 500, "Internal Server error", [], error.message);
  }
};

export const addUserrole = async (req, res) => {
  try {
    const { role_name } = req.body;

    const result = await sourceMdl.addRole({ role_name });
    const data = (await result?.data) || "";
    const error = (await result?.error) || "";

    // console.log(result);
    if (result?.success === 0) {
      return sendResponse(res, 200, 0, error, [], "");
    } else {
      return sendResponse(res, 200, 1, "role added Successfully", [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal server error", [], error.message);
  }
};

export const updateUserrole = async (req, res) => {
  try {
    const { id, role_name, status } = req.body;

    const result = await sourceMdl.updateRole({ id, role_name, status });
    const data = result?.data || "";
    const error = result?.error || "";
    console.log(error);

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Role Updated successfully", [], "");
    } else {
      return sendResponse(res, 200, 0, error, [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal server error", [], error.message);
  }
};

export const getUserrole = async (req, res) => {
  try {
    const result = await sourceMdl.getUserrole();
    const data = result?.data || [];

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Roles fetched successfully", data, "");
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to fetch roles", [], "");
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
export const addFinanceCategory = async (req, res) => {
  try {
    const { id, cat_name, cat_img, cat_type, status } = await validateRequests(
      req.body,
      finCategorySchema,
    );

    const data = await sourceMdl.addUpdateFinCatgory({
      id,
      cat_name,
      cat_type,
      cat_img,
      status,
    });

    return sendResponse(
      res,
      200,
      1,
      `Finance Catgory ${data?.action} successfully`,
      [],
      "",
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      err.errors || err.message || err,
    );
  }
};

export const getFinCategory = async (req, res) => {
  try {
    const { id, status, cat_type } = req.body;

    const data = await sourceMdl.fetchFinCategory({ id, status, cat_type });

    return sendResponse(
      res,
      200,
      1,
      "Finance Catgory Fetched Successfully",
      data,
      "",
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      err.errors || err.message || err,
    );
  }
};
