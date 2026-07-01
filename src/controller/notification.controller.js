import express from "express";
import { sendResponse } from "../utils/helper.js";
import {
  getNotificationActiveCountSchema,
  getNotificationSchema,
  notificationIsReadChangeSchema,
  notificationIsViewChangeSchema,
  validateRequest,
} from "../utils/validator.js";
import { notificationModel } from "../models/notification.model.js";

const notificationMdl = new notificationModel();

export const getNotification = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getNotificationSchema);
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
    const { user_id, page } = validatedData?.value;

    const result = await notificationMdl.getNotification(user_id, page);

    const data = result?.data;
    const pagination = result?.pagination;
    // console.log(pagination)

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "notifications fetched successfully",
        [{ data, pagination }],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "failed to fetch notifications", [], "");
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
export const notificationIsViewChange = async (req, res) => {
  try {
    const valdiatedData = validateRequest(
      req.body,
      notificationIsViewChangeSchema,
    );
    if (valdiatedData?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "validation error",
        [],
        valdiatedData?.errorObject?.errors,
      );
    }
    const { user_id, id } = valdiatedData?.value;

    const result = await notificationMdl.notificationViewChange(user_id, id);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "notifications view updated to seen successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "failed to update notification view",
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
export const notificationIsReadChange = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      notificationIsReadChangeSchema,
    );
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
    const { id } = validatedData?.value;

    const result = await notificationMdl.notificationReadChange(id);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "notifications read updated to seen successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "failed to update notification read",
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
export const getNotificationActiveCount = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      getNotificationActiveCountSchema,
    );
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
    const { user_id } = validatedData?.value;
    const result = await notificationMdl.getNotificationActiveCount(user_id);

    const data = result?.data;
    if (data[1]) {
      data[1].reminder_count = Number(data[1]?.reminder_count);
    }
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Fetched active notifications successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch active notifications",
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
