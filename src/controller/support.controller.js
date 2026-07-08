import express from "express";
import { supportModel } from "../models/support.model.js";
import {
  executeQuery,
  replaceNullWithEmptyString,
  sendResponse,
} from "../utils/helper.js";
import { sendContactUsMail, sendMail } from "../config/email.js";
import {
  addIssueCategorySchema,
  addMemberCategorySchema,
  addSumitCategorySchema,
  addTravelExpCategorySchema,
  contactUsSchema,
  deleteFaqPermanentlySchema,
  deleteFaqSchema,
  deleteIssueCategorypermanentlySchema,
  deleteIssueCategorySchema,
  deleteMemberCategorySchema,
  deleteMemberpermanentlySchema,
  deleteSumitCategorySchema,
  deleteSumitCatpermanentlySchema,
  deleteTravelExpCategorySchema,
  deleteTravelExppermanentlySchema,
  getCountriesSchema,
  getFaqSchema,
  getIssueCategorySchema,
  getMemberCategorySchema,
  getMemberschema,
  getSumitCategorySchema,
  getTravelExpenseCategorySchema,
  getUserListSchema,
  statusChangeSchema,
  updateIssueCategorySchema,
  updateMemberCategorySchema,
  updateSumitCategorySchema,
  updateTravelExpCategorySchema,
  userIdSchema,
  validateRequest,
} from "../utils/validator.js";
import axios from "axios";
import District from "../json_datas/states-and-districts.json" with { type: "json" };

const supportMdl = new supportModel();

export const addFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faqResult = await supportMdl.addfaq(question, answer);
    // console.log(faqResult?.success);
    if (faqResult?.success === 1) {
      return sendResponse(res, 200, 1, "faq added successfully", [], "");
    } else if (faqResult?.success === 0) {
      return sendResponse(res, 200, 0, "faq failed to add", [], "");
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal Server Error",
      [],
      error.message,
    );
  }
};
export const getFaq = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getFaqSchema);

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

    let { status } = validatedData?.value;

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
    const { id, question, answer } = req.body;
    // console.log(id, question, answer);

    const result = await supportMdl.updateFaq(id, question, answer);
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
export const deleteFaq = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteFaqSchema);

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

    let { id, status } = validatedData?.value;
    // console.log(status);

    const result = await supportMdl.deleteFaq(id, status);
    // console.log(result);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        status === "active"
          ? "Faq retrieved successfully"
          : "Faq deleted successfully",
        [],
        "",
      );
    } else {
      return sendResponse(res, 200, 0, result?.error, [], "");
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
export const deleteFaqPermanently = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteFaqPermanentlySchema);

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
    // console.log(id);

    const result = await supportMdl.deleteFaqPermanently(id);

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "faq deleted permanently", [], "");
    } else {
      return sendResponse(res, 200, 0, result?.error, [], "");
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

export const filterApi = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, userIdSchema);

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
    if (result?.success === 0) {
      return sendResponse(res, 200, 0, "no data found", [], "");
    }
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
      // console.log(fetched_district);
      if (fetched_district.length < 1) {
        fetched_district.push(state);
      } else {
        fetched_district = fetched_district[0].districts;
      }

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
export const updateStatus = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, statusChangeSchema);
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
    let { id, status, type } = validatedData?.value;
    let table_name;
    let col_name;

    if (type === "meeting") {
      table_name = "meeting";
      col_name = "status";
    }
    if (type === "appointment") {
      table_name = "appointments";
      col_name = "status";
    }
    if (type === "task") {
      table_name = "tasks";
      col_name = "t_status";
    }
    if (type === "issue") {
      table_name = "issues";
      col_name = "status";
    }
    if (type === "sumit") {
      table_name = "political_sumit";
      col_name = "status";
    }

    const result = await supportMdl.updateStatus({
      id,
      status,
      table_name,
      col_name,
    });

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Status changed successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to change status", [], "");
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

export const addIssueCat = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addIssueCategorySchema);
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
    let { category } = validatedData?.value;

    const result = await supportMdl.addIssueCat({ id, category });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Issue category added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to add issue category", [], "");
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
export const getIssueCat = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getIssueCategorySchema);
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
    let { status } = validatedData?.value;
    const result = await supportMdl.getIssueCat(status);
    const data = result?.data;
    // console.log(result);

    // if (result?.success === 1) {
    //   return sendResponse(res, 200, 1, "faq fetched successfully", data, "");
    // } else {
    //   return sendResponse(res, 200, 0, result?.error, [], "");
    // }

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Issue category fetched successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch issue category",
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
export const deleteIssueCat = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteIssueCategorySchema);
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
    let { id, status } = validatedData?.value;
    // console.log(status)

    const result = await supportMdl.deleteIssueCat(id, status);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        status === "active"
          ? "Issue category retrieved successfully"
          : "Issue category deleted successfully",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete Issue category",
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
export const deleteIssueCatpermanently = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      deleteIssueCategorypermanentlySchema,
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
    let { id } = validatedData?.value;

    const result = await supportMdl.deleteIssueCatPermanently(id);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Issue category successfully deleted permanently",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete issue category",
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
export const updateissuecategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateIssueCategorySchema);
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
    let { id, category } = validatedData?.value;
    // console.log(id, category)

    const result = await supportMdl.updateIssueCat({ id, category });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Issue category updated successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update issue category",
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

export const addSumitCategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addSumitCategorySchema);
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
    let { category } = validatedData?.value;

    const result = await supportMdl.addSumitCat({ category });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "political sumit category added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to add political sumit category",
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
export const getSumitCategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getSumitCategorySchema);
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
    const { status } = validatedData?.value;
    const result = await supportMdl.getSumitCat(status);
    // console.log(result);
    const data = result?.data;
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "political sumit category fetched successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch political sumit category",
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
export const updatesumitcategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateSumitCategorySchema);
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
    let { id, category } = validatedData?.value;
    // console.log(id, category)

    const result = await supportMdl.updateSumitCat({ id, category });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Sumit category updated successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update sumit category",
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
export const deletesumitcategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteSumitCategorySchema);
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
    let { id, status } = validatedData?.value;
    // console.log(status)

    const result = await supportMdl.deleteSumitCat(id, status);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        status === "active"
          ? "sumit category retrieved successfully"
          : "sumit category deleted successfully",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete sumit category",
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
export const deleteSumitCatpermanently = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      deleteSumitCatpermanentlySchema,
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
    let { id } = validatedData?.value;

    const result = await supportMdl.deleteSumitCatPermanently(id);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "sumit category successfully deleted permanently",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete sumit category",
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

export const addTravelExpCategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addTravelExpCategorySchema);
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
    let { category } = validatedData?.value;

    const result = await supportMdl.addTravelExpCat({ category });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel expense category added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to add travel expense category",
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
export const updateTravelExpcategory = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      updateTravelExpCategorySchema,
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
    let { id, category } = validatedData?.value;
    // console.log(id, category)

    const result = await supportMdl.updateTravelExpCat({ id, category });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel expense category updated successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update travel expense category",
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
export const deleteTravelExpcategory = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      deleteTravelExpCategorySchema,
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
    let { id, status } = validatedData?.value;
    // console.log(status)

    const result = await supportMdl.deleteTravelExpCat(id, status);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        status === "active"
          ? "travel expense category retrieved successfully"
          : "travel expense category deleted successfully",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete travel expense category",
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
export const deleteTravelExpCatpermanently = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      deleteTravelExppermanentlySchema,
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
    let { id } = validatedData?.value;

    const result = await supportMdl.deleteTravelExpCatPermanently(id);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "travel expense category successfully deleted permanently",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete travel expense category",
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
export const getTravelExpenseCategory = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      getTravelExpenseCategorySchema,
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
    const { status } = validatedData?.value;
    const result = await supportMdl.getTravelExpenseCat(status);
    // console.log(result);
    const data = result?.data;
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel Expense category fetched successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch travel expense category",
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

export const addMemberCategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addMemberCategorySchema);
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
    let { category } = validatedData?.value;

    const result = await supportMdl.addMemberCat({ category });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Member category added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to add member category", [], "");
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
export const updateMembercategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateMemberCategorySchema);
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
    let { id, category } = validatedData?.value;
    // console.log(id, category)

    const result = await supportMdl.updateMemberCat({ id, category });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Member category updated successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update member category",
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
export const deleteMembercategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteMemberCategorySchema);
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
    let { id, status } = validatedData?.value;
    // console.log(status)

    const result = await supportMdl.deleteMemberCat(id, status);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        status === "active"
          ? "member category retrieved successfully"
          : "member category deleted successfully",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete member category",
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
export const deletememberCatpermanently = async (req, res) => {
  try {
    const validatedData = validateRequest(
      req.body,
      deleteMemberpermanentlySchema,
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
    let { id } = validatedData?.value;

    const result = await supportMdl.deleteMemberCatPermanently(id);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Member category successfully deleted permanently",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete member category",
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
export const getMemberCategory = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getMemberCategorySchema);
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
    const { status } = validatedData?.value;
    const result = await supportMdl.getMemberCat(status);
    // console.log(result);
    const data = result?.data;
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Member category fetched successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch member category",
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

export const getUserList = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getUserListSchema);
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
    let { status } = validatedData?.value;

    status = status === "active" ? 0 : 1;

    const result = await supportMdl.getUserList(status);
    const data = result?.data;

    const response = replaceNullWithEmptyString(data);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "user list fetched successfully",
        response,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to fetch user list", [], "");
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
