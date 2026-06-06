import express from "express";
import { userModel } from "../models/user.model.js";
import { sendResponse } from "../utils/helper.js";
import {
    getUserProfileschema,
  loginschema,
  updateUserProfileschema,
  validateRequest,
} from "../utils/validator.js";

const userMdl = new userModel();

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

    const result = await userMdl.updateProfileDetail({
      user_id: user_id,
      name: name || "",
      phn_num: phn_num || "",
      c_code: c_code || "",
      email: email || "",
    });
    // console.log(result.message);
    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Profile updated", [], "");
    } else {
      const error = result?.error;
      return sendResponse(res, 200, 0, error, [], "");
    }
  } catch (error) {
    return sendResponse(res, 500, 0, "Internal server error", [], error.message);
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
