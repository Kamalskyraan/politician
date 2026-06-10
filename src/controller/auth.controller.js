import express from "express";
import {
  genarateotp,
  generateJwtToken,
  replaceNullWithEmptyString,
  sendResponse,
} from "../utils/helper.js";
import { authModel } from "../models/auth.model.js";
import dotenv from "dotenv";
dotenv.config();
import { sendMail } from "../config/email.js";
import {
  loginschema,
  requestOtpSchema,
  signUpSchema,
  validateRequest,
  verifyOtpSchema,
} from "../utils/validator.js";
import { sendSmsOTP } from "../service/sms.js";

const AuthMdl = new authModel();

export const requestOtp = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, requestOtpSchema);
    // console.log(validatedData?.errorObject)

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

    const { phn_num, c_code, email, type } = validatedData?.value;

    let otp = await genarateotp({ phn_num, c_code });

    const expired_at =
      process.env.NODE_ENV === "development"
        ? new Date(Date.now() + 1000 * 60 * 1)
        : new Date(Date.now() + 1000 * 60 * 5);

    if (type === 0) {
      // no db check
      const result = await AuthMdl.requestOtp({
        phn_num,
        c_code,
        email,
        otp,
        expired_at,
      });

      if (result?.success === 0) {
        return sendResponse(res, 200, 0, result?.error, [], "");
      } else {
        if (email && process.env.NODE_ENV !== "development") {
          await sendMail(email, otp);
        } else if (email && process.env.NODE_ENV === "development") {
          await sendMail(email, otp);

          return sendResponse(res, 200, 1, "OTP sent successfully", [otp], "");
        }
        if (phn_num && process.env.NODE_ENV === "development") {
          return sendResponse(res, 200, 1, "OTP sent successfully", [otp], "");
        }
        if (phn_num && process.env.NODE_ENV !== "development") {
          await sendSmsOTP(phn_num, otp);

          return sendResponse(res, 200, 1, "OTP sent successfully", [], "");
        }
      }

      return sendResponse(res, 200, 1, "otp sent successfully", [], "");
    } else if (type === 1) {
      // user should exist to send otp - login purpose

      const userresult = await AuthMdl.checkUserExists({
        phn_num,
        c_code,
        email,
      });
      //   console.log(userresult.success)
      //   console.log(userresult?.data || [])
      if (userresult.success === 1) {
        const otpResult = await AuthMdl.requestOtp({
          phn_num,
          c_code,
          email,
          otp,
          expired_at,
        });

        if (otpResult?.success === 0) {
          return sendResponse(res, 200, 0, otpResult?.error, [], "");
        } else {
          if (email && process.env.NODE_ENV !== "development") {
            await sendMail(email, otp);
          } else if (email && process.env.NODE_ENV === "development") {
            await sendMail(email, otp);

            return sendResponse(
              res,
              200,
              1,
              "OTP sent successfully",
              [otp],
              "",
            );
          }
          if (phn_num && process.env.NODE_ENV === "development") {
            return sendResponse(
              res,
              200,
              1,
              "OTP sent successfully",
              [otp],
              "",
            );
          }
          if (phn_num && process.env.NODE_ENV !== "development") {
            await sendSmsOTP(phn_num, otp);

            return sendResponse(res, 200, 1, "OTP sent successfully", [], "");
          }
        }

        return sendResponse(res, 200, 1, "otp sent successfully", [], "");
      } else {
        return sendResponse(res, 200, 0, "User not existed", [], "");
      }
    } else if (type === 2) {
      const userresult = await AuthMdl.checkUserExists({
        phn_num,
        c_code,
        email,
      });
      if (userresult?.success === 1) {
        return sendResponse(
          res,
          200,
          0,
          "user already registered in this credentials",
          [],
          "",
        );
      } else if (userresult?.success === 0) {
        const otpResult = await AuthMdl.requestOtp({
          phn_num,
          c_code,
          email,
          otp,
          expired_at,
        });
        // console.log(otpResult);

        if (otpResult?.success === 0) {
          return sendResponse(res, 200, 0, otpResult?.error, [], "");
        } else {
          if (email && process.env.NODE_ENV !== "development") {
            await sendMail(email, otp);
            return sendResponse(res, 200, 1, "otp sent successfully", [], "");
          } else if (email && process.env.NODE_ENV === "development") {
            await sendMail(email, otp);

            return sendResponse(
              res,
              200,
              1,
              "OTP sent successfully",
              [otp],
              "",
            );
          }
          if (phn_num && process.env.NODE_ENV === "development") {
            return sendResponse(
              res,
              200,
              1,
              "OTP sent successfully",
              [otp],
              "",
            );
          }
          if (phn_num && process.env.NODE_ENV !== "development") {
            await sendSmsOTP(phn_num, otp);

            return sendResponse(res, 200, 1, "OTP sent successfully", [], "");
          }
        }
      }
    }
  } catch (error) {
    // console.log(error);
    return sendResponse(
      res,
      500,
      0,
      "Internal error failed to send",
      [],
      error.message,
    );
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, verifyOtpSchema);

    if (validatedData?.success === 0) {
      sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    const { phn_num, c_code, email, otp } = validatedData?.value;

    const result = await AuthMdl.verifyOtp({
      phn_num,
      c_code,
      email,
      otp,
    });
    // console.log(result);
    if (result.success === 1) {
      return sendResponse(res, 200, 1, "Otp verified successfully", [], "");
    } else {
      return sendResponse(res, 200, 0, result.error, [], "");
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

export const signUp = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, signUpSchema);

    if (validatedData?.success === 0) {
      sendResponse(
        res,
        200,
        0,
        "validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    const {
      name,
      phn_num,
      c_code,
      email,
      device_token,
      device_id,
      device_type,
    } = validatedData?.value;

    const result = await AuthMdl.userSignUp({
      name,
      phn_num,
      c_code,
      email,
      device_token,
      device_id,
      device_type,
    });

    if (result.success === 0) {
      return sendResponse(res, 200, 0, result?.error, [], "");
    }
    if (result.success === 1) {
      const token = await generateJwtToken({
        user_id: result?.data,
        email: email,
        device_id: device_id,
      });
      const data = {
        user_id: result?.data,
        jwt_token: token,
      };
      // console.log(result?.data);
      return sendResponse(res, 200, 1, "user created successfully", [data], "");
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

export const login = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, loginschema);

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

    const { email, device_token, device_id, device_type } =
      validatedData?.value;

    const userlogin = await AuthMdl.userLogin({
      email,
      device_token,
      device_id,
      device_type,
    });

    // console.log(userlogin?.data[0]);
    const userLoginResult = userlogin?.data[0];

    if (userlogin?.success === 0) {
      return sendResponse(res, 200, 0, "login failed", [], userlogin.error);
    } else if (userlogin?.success === 1) {
      const token = await generateJwtToken({
        user_id: userlogin?.data,
        email: email,
        device_id: device_id,
      });
      let data = {
        user_id: userLoginResult?.user_id,
        jwt_token: token,
        name: userLoginResult?.name,
        phn_num: userLoginResult?.phn_num,
        c_code: userLoginResult?.c_code,
        email: userLoginResult?.email
      };
      data = replaceNullWithEmptyString(data);
      return sendResponse(res, 200, 1, "login successfull", [data], "");
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      1,
      "Internal server error",
      [],
      error.message,
    );
  }
};
