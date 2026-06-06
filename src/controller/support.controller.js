import express from "express";
import { supportModel } from "../models/support.model.js";
import { executeQuery, sendResponse } from "../utils/helper.js";
import { sendContactUsMail, sendMail } from "../config/email.js";
import {
  contactUsSchema,
  getMemberschema,
  validateRequest,
} from "../utils/validator.js";

const supportMdl = new supportModel();

export const addFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faqResult = await supportMdl.addfaq(question, answer);
    if (faqResult?.success === 1) {
      sendResponse(res, 200, 1, "faq added successfully", [], "");
    } else {
      sendResponse(res, 200, 0, "faq failed to add", [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal Server Error", [], error.message);
  }
};

export const getFaq = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await supportMdl.getFaq(status);
    const data = result?.data;
    // console.log(result);

    if (result?.success === 1) {
      sendResponse(res, 200, 1, "faq fetched successfully", data, "");
    } else {
      sendResponse(res, 200, 0, result?.error, [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal Server Error", [], error.message);
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id, question, answer, status } = req.body;

    const result = await supportMdl.updateFaq(id, question, answer, status);
    //   console.log(result)
    const data = result?.data;

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Faq updated successfully", [], "");
    } else {
      return sendResponse(res, 200, 0, result?.error, [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal server Error", [], error.message);
  }
};

export const contactUs = async (req, res) => {
  //   const { name, phn_num, c_code, email, comments } = req.body;

  try {
    const validatedData = validateRequest(req.body, contactUsSchema);

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
      sendResponse(res, 200, 0, result?.error, [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal Server error", [], error.message);
  }
};

// export const get

export const filterApi = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getMemberschema);

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

    let { user_id } = validatedData?.value;

    const result = await supportMdl.getLocations(user_id);
    const data = result?.data;
    console.log(data);
    const locations = {};

    // for (const row of data) {
    //   const { country, state, district } = row;

    //   if (!locations[country]) {
    //     locations[country] = {
    //       name: country,
    //       states: {},
    //     };
    //   }

    //   if (!locations[country].states[state]) {
    //     locations[country].states[state] = {
    //       name: state,
    //       districts: [],
    //     };
    //   }

    //   if (!locations[country].states[state].districts.includes(district)) {
    //     locations[country].states[state].districts.push(district);
    //   }
    // }
    if (result?.data.length > 0) {
      return sendResponse(res, 200, 1, "Filters fetched successfully", data, "");
    } else if (result?.data.length > 0) {
      return sendResponse(res, 200, 0, "Failed to fetch Filters", [], "");
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
