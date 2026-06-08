import express from "express";
import { supportModel } from "../models/support.model.js";
import { executeQuery, sendResponse } from "../utils/helper.js";
import { sendContactUsMail, sendMail } from "../config/email.js";
import {
  contactUsSchema,
  getCountriesSchema,
  getMemberschema,
  validateRequest,
} from "../utils/validator.js";
import axios from "axios";
import District from "../json_datas/states-and-districts.json" with { type: "json" };

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
    // console.log(data);
    const locations = {};

    for (const row of data) {
      const { country, state, district, member_count } = row;

      // Create country if not exists
      if (!locations[country]) {
        locations[country] = {
          country,
          states: [],
        };
      }

      // Find state
      let stateObj = locations[country].states.find((s) => s.state === state);

      // Create state if not exists
      if (!stateObj) {
        stateObj = {
          state,
          districts: [],
        };

        locations[country].states.push(stateObj);
      }

      // Add district
      stateObj.districts.push({
        district,
        member_count,
      });
    }

    if (result?.data.length > 0) {
      return sendResponse(
        res,
        200,
        1,
        "Filters fetched successfully",
        [locations],
        "",
      );
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
export const getCountries = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getCountriesSchema);

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

    let { country, state } = validatedData?.value;

    country = country === "" ? null : country;
    state = state === "" ? null : state;

    let fetched_country = [];
    let fetched_state = [];
    let fetched_district = [];

    if (!country) {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries",
      );
      fetched_country = response?.data?.data.map((obj) => obj.country);
      return sendResponse(
        res,
        200,
        1,
        "countries fetched successfully",
        fetched_country,
        "",
      );
    }
    if (!state) {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          country: country,
        },
      );
      fetched_state = response?.data?.data?.states.map((obj) => obj.name);
      return sendResponse(
        res,
        200,
        1,
        "states fetched successfully",
        fetched_state,
        "",
      );
    }
    if (country && state) {
      // const response = await axios.post(
      //   "https://countriesnow.space/api/v0.1/countries/state/cities",
      //   { country: country, state: state },
      // );
      // console.log(response?.data?.data);
      // fetched_district = response?.data?.data.map((obj) => obj);

      fetched_district = District?.states.filter((obj) => obj.state === state);
      fetched_district = fetched_district[0].districts;

      return sendResponse(
        res,
        200,
        1,
        "District fetched successfully",
        fetched_district,
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
