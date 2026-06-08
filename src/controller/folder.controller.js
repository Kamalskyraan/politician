import express from "express";
import { folderModel } from "../models/folder.model.js";
import { sendResponse } from "../utils/helper.js";

const folderMdl = new folderModel();
export const addUpdateFolderName = async (req, res) => {
  try {
    const { id, user_id, folder_name } = req.body;

    const data = await folderMdl.addFolderName({
      id,
      user_id,
      folder_name,
    });

    return sendResponse(
      res,
      200,
      1,
      `Folder Data ${data.action} Successfully`,
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

export const addUpdateFolder = async (req, res) => {
  try {
    const { id, user_id, media_ids } = await validateRequests(
      req.body,
      financeSchema,
    );

    if (!cat_id && !cat_name) {
      return sendResponse(
        res,
        200,
        0,
        "Category name or category ID is required",
        [],
        "",
      );
    }
    const data = await financeMdl.addFinanceData({
      id,
      user_id,
      type,
      cat_id,
      cat_name,
      trans_date,
      amount,
      notes,
      attachment,
    });

    return sendResponse(
      res,
      200,
      1,
      `Finance Data ${data.action} Successfully`,
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
