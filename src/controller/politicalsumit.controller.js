import express from "express";
import {
  addSumitSchema,
  deleteSumitSchema,
  getSumitSchema,
  updateSumitSchema,
  validateRequest,
} from "../utils/validator.js";
import { replaceNullWithEmptyString, sendResponse } from "../utils/helper.js";
import { politicalSumitModel } from "../models/politicalsumit.model.js";

const sumitMdl = new politicalSumitModel();

export const addSumit = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addSumitSchema);
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
    let {
      user_id,
      title,
      location,
      lat,
      lng,
      sumit_date,
      vip,
      member,
      sumit_incharge,
      dept_incharge,
    } = validatedData?.value;

    let sts = "upcoming";
    const sts_date = new Date(sumit_date);
    const today = new Date();

    if (
      sts_date.getFullYear() === today.getFullYear() &&
      sts_date.getMonth() === today.getMonth() &&
      sts_date.getDate() === today.getDate()
    ) {
      sts = "inprogress";
    }
    const result = await sumitMdl.addSumit({
      user_id,
      title,
      location,
      lat,
      lng,
      sumit_date,
      sts,
      vip,
      member,
      sumit_incharge,
      dept_incharge,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Political sumit added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to add political sumit",
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
export const deletesumit = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteSumitSchema);
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

    const result = await sumitMdl.deleteSumit({ id });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Political sumit deleted successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete political sumit",
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
export const getSumit = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getSumitSchema);
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
    let { user_id, status, from_date, to_date, id } = validatedData?.value;

    status = status === "" ? null : status;
    from_date = from_date === "" ? null : from_date;
    to_date = to_date === "" ? null : to_date;
    id = id === "" ? null : Number(id);

    let upt_cols = [];
    let params = [];
    let data;
    let result;

    if (id == null) {
      if (user_id != null) {
        upt_cols.push("user_id = ?");
        params.push(user_id);
      }
      if (status != null) {
        upt_cols.push(" AND status = ?");
        params.push(status);
      }
      if (from_date != null) {
        upt_cols.push(" AND sumit_date >= ?");
        params.push(`${from_date} 00:00:00`);
      }
      if (to_date != null) {
        upt_cols.push(" AND sumit_date <= ?");
        params.push(`${to_date} 23:59:59`);
      }
      result = await sumitMdl.getSumit({ upt_cols, params });
      data = result?.data;
    } else if (id != null) {
      result = await sumitMdl.getSumitPeopleDetails(id);
      data = result?.data;

      let response = {
        id: data[0]?.sumit_id,
        title: data[0]?.title,
        sumit_date: data[0]?.sumit_date,
        status: data[0]?.status,
        location: data[0]?.location,
        lat: data[0]?.lat,
        lng: data[0]?.lng,
        vip: [],
        member: [],
        sumit_incharge: [],
        dept_incharge: [],
      };

      for (const row of data) {
        const person = {
          id: row.people_id,
          name: row.name,
          type: row.type,
          designation: row.cat_id === 0 ? row.cat_name : row.designation,
          designation: row.dept_id === 0 ? row.dept_name : row.department,
        };

        if (row.type === "vip") {
          response.vip.push(person);
        }
        if (row.type === "member") {
          response.member.push(person);
        }
        if (row.type === "sumit incharge") {
          response.sumit_incharge.push(person);
        }
        if (row.type === "dept incharge") {
          response.dept_incharge.push(person);
        }
      }
      data = await response;
    }
    data = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Political Sumit fetched successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch political sumit",
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
export const updateSumit = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateSumitSchema);
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
    let { user_id, status, from_date, to_date, id } = validatedData?.value;
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
