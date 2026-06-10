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

export const removeFolder = async (req, res) => {
  try {
    const { ids, type } = req.body;
    if (!ids) {
      return sendResponse(res, 200, 0, "Id is required", [], "");
    }

    if (!["folder", "image"].includes(type)) {
      return sendResponse(res, 200, 0, "Type must be folder or image", [], "");
    }

    await folderMdl.removeFolderOrImages({ ids, type });

    return sendResponse(res, 200, 1, "Deleted successfully", [], "");
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



export const addUpdateFolderImages = async (req, res) => {
  try {
    const { id, folder_id, media_ids } = req.body;
    const result = await folderMdl.addUpdateFolderImages({
      id,
      folder_id,
      media_ids,
    });
    return sendResponse(
      res,
      200,
      1,
      `Folder Images ${data.action} Successfully`,
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

export const getFinanceFolder = async (req, res) => {
  try {
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
