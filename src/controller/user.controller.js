import express from "express";
import { userModel } from "../models/user.model.js";
import { supportModel } from "../models/support.model.js";
import {
  formatDateForSQL,
  getDaysDiff,
  sendResponse,
} from "../utils/helper.js";
import {
  contactUsSchema,
  deleteAccountSchema,
  getUserProfileschema,
  loginschema,
  updateUserProfileschema,
  validateRequest,
} from "../utils/validator.js";
import { sendContactUsMail } from "../config/email.js";

const userMdl = new userModel();
const supportMdl = new supportModel();

export const updateProfileDetail = async (req, res) => {
  try {
    // const { user_id, name, phn_num, c_code, email } = req.body;

    const validatedData = validateRequest(req.body, updateUserProfileschema);

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

    const { user_id, name, phn_num, c_code, email } = validatedData?.value;

    const userResult = await userMdl.getProfileDetails(user_id);
    if (userResult?.success === 0) {
      return sendResponse(res, 200, 0, userResult?.error, [], "");
    }

    const user = userResult.data;

    let upt_cols = [];
    let params = [];
    const today = new Date();
    // console.log(c_code);
    // console.log(user?.c_code);

    // NAME
    if (name !== user.name) {
      const diffDays = getDaysDiff(user.name_upt_at);
      // console.log(user.name_upt_at);
      // console.log("name",diffDays);

      if (diffDays <= 30) {
        return sendResponse(
          res,
          200,
          0,
          `Name can be changed after ${30 - diffDays} days`,
          [],
          "",
        );
      }

      upt_cols.push("name = ?");
      params.push(name);

      upt_cols.push("name_upt_at = NOW()");
    }
    // EMAIL
    if (email !== user.email) {
      const diffDays = getDaysDiff(user.email_upt_at);
      console.log("email", diffDays);

      if (diffDays <= 30) {
        return sendResponse(
          res,
          200,
          0,
          `Email can be changed after ${30 - diffDays} days`,
          [],
          "",
        );
      }

      upt_cols.push("email = ?");
      params.push(email);

      upt_cols.push("email_upt_at = NOW()");
    }
    // PHONE NUMBER
    if (String(phn_num) !== String(user.phn_num) || c_code !== user.c_code) {
      const diffDays = getDaysDiff(user.phnnum_upt_at);
      console.log("phone number", diffDays);

      if (diffDays <= 30) {
        return sendResponse(
          res,
          200,
          0,
          `Phone number can be changed after ${30 - diffDays} days`,
          [],
          "",
        );
      }

      upt_cols.push("phn_num = ?");
      params.push(phn_num);

      upt_cols.push("c_code = ?");
      params.push(c_code);

      upt_cols.push("phnnum_upt_at = NOW()");
    }

    let result;
    if (upt_cols.length < 1) {
      return sendResponse(res, 200, 1, "there is no changes to update", [], "");
    } else {
      result = await userMdl.updateProfileDetail({
        upt_cols,
        params,
        user_id,
      });
    }

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Profile updated successfully", [], "");
    } else {
      return sendResponse(res, 200, 0, "Failed to update profile", [], "");
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

export const getUserProfile = async (req, res) => {
  try {
    // const { user_id } = req.body;

    const validatedData = validateRequest(req.body, getUserProfileschema);

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

    const userDetail = await userMdl.getUserDetails({ user_id });
    // console.log(userDetail?.error);
    const data = userDetail?.data;
    const error = userDetail?.error;

    if (userDetail?.success === 1) {
      sendResponse(res, 200, 1, "user Found", [data], "");
    } else if (userDetail?.success === 0) {
      sendResponse(res, 200, 0, "User not found", [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal server error", [], error.message);
  }
};

export const contactUs = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, contactUsSchema);

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

    const { user_id, name, phn_num, c_code, email, comments } =
      validatedData?.value;

    const result = await supportMdl.contactUs(
      user_id,
      name,
      phn_num,
      c_code,
      email,
      comments,
    );
    //   console.log(result);
    if (result?.success === 1) {
      await sendContactUsMail();
      sendResponse(res, 200, 1, "Query has been submitted", [], "");
    } else {
      sendResponse(res, 200, 0, "Failed to sumit Query", [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal Server error", [], error.message);
  }
};
export const deleteAccount = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteAccountSchema);

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

    const { user_id, delete_reason } = validatedData?.value;

    const today = formatDateForSQL(new Date());

    const result = await userMdl.deleteAccount({
      user_id,
      delete_reason,
      today,
    });

    if (result?.success === 1) {
      sendResponse(res, 200, 1, "Account deleted successfully", [], "");
    } else {
      sendResponse(res, 200, 0, "Failed to delete account", [], result?.error);
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
