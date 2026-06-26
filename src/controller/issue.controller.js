import express, { response } from "express";
import {
  addIssueSchema,
  deleteIssueSchema,
  getIssueSchema,
  updateIssueschema,
  validateRequest,
} from "../utils/validator.js";
import {
  addNotification,
  deleteNotification,
  formatDateForSQL,
  getCurrentDateTime,
  replaceNullWithEmptyString,
  sendResponse,
} from "../utils/helper.js";
import { issueModel } from "../models/issue.model.js";
import { sourceModel } from "../models/source.model.js";
import { meetingModel } from "../models/meeting.model.js";

const issueMdl = new issueModel();
const sourceMdl = new sourceModel();
const meetingMdl = new meetingModel();

export const addIssue = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addIssueSchema);
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
      cat_id,
      cat_name,
      descp,
      address,
      lat,
      lng,
      media_id,
      report_date,
      incharge_id,
      member_id,
    } = validatedData?.value;

    cat_name = cat_name === "" ? null : cat_name;

    media_id = media_id === "" ? null : media_id;
    incharge_id = incharge_id === "" ? null : incharge_id;
    member_id = member_id === "" ? null : member_id;

    report_date = new Date(report_date);
    report_date.setSeconds(0, 0);
    report_date = formatDateForSQL(report_date);

    let status = "not assigned";
    if(incharge_id != null && member_id != null){
      status = "inprogress"
    }

    const result = await issueMdl.addIssue({
      user_id,
      cat_id,
      cat_name,
      descp,
      address,
      lat,
      lng,
      status,
      media_id,
      report_date,
      incharge_id,
      member_id,
    });

    const data = {
      id: result?.data?.insertId,
      cat_id: cat_id,
      cat_name: cat_name,
      descp: descp,
      address: address,
      lat: lat,
      lng: lng,
      status: status,
      media_id: media_id === null ? [] : media_id,
      report_date: report_date,
      incharge_id: incharge_id === null ? [] : incharge_id,
      member_id: member_id === null ? [] : member_id,
    };
    if (cat_id > 0) {
      const cat_name = await issueMdl.getCatName(cat_id);
      data.cat_name = cat_name?.data[0]?.cat_name;
    }

    if (media_id != null) {
      const id = media_id.split(",");
      const media_result = await sourceMdl.getMedia(id);
      // console.log(media_result?.data);
      data.media_id = media_result?.data;
    }
    if (incharge_id != null) {
      const id = incharge_id.split(",");
      let incharge_result = await meetingMdl.getattnds(id);
      incharge_result = incharge_result?.data;
      // console.log(incharge_result);
      let incharge_result_with_roles = await Promise.all(
        incharge_result.map(async (obj) => {
          const role_id = obj.role_id;
          const roles = await meetingMdl.getRole(role_id);
          // console.log(roles);
          const { ...rest } = obj;
          return { ...rest, role_name: roles?.data[0]?.role_name };
        }),
      );
      // const {...rest, incharge_id: incharge_result_with_roles} = obj;
      data.incharge_id = incharge_result_with_roles;
    }
    if (member_id != null) {
      const id = member_id.split(",");
      let member_result = await meetingMdl.getattnds(id);
      member_result = member_result?.data;
      // console.log(incharge_result);
      let member_result_with_roles = await Promise.all(
        member_result.map(async (obj) => {
          const role_id = obj.role_id;
          const roles = await meetingMdl.getRole(role_id);
          // console.log(roles);
          const { ...rest } = obj;
          return { ...rest, role_name: roles?.data[0]?.role_name };
        }),
      );
      // const {...rest, incharge_id: incharge_result_with_roles} = obj;
      data.member_id = member_result_with_roles;
    }
    const response = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      const currentDate = await getCurrentDateTime();
      if (currentDate.slice(0, 10) === report_date.slice(0, 10)) {
        await addNotification("ISSUE_CREATED", user_id, "issue", data.id);
      }
    }

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Issue added successfully",
        [response],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to add Issue",
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
export const deleteIssue = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteIssueSchema);
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

    const result = await issueMdl.deleteIssue({ id });

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Issue deleted successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete Issue",
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
export const updateIssue = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateIssueschema);
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
      id,
      cat_id,
      cat_name,
      descp,
      address,
      lat,
      lng,
      media_id,
      report_date,
      incharge_id,
      member_id,
    } = validatedData?.value;

    cat_name = cat_name === "" ? null : cat_name;
    media_id = media_id === "" ? null : media_id;
    incharge_id = incharge_id === "" ? null : incharge_id;
    member_id = member_id === "" ? null : member_id;

    let status = "not assigned";
    if(incharge_id != null && member_id != null){
      status = "inprogress"
    }

    let upt_cols = [];
    let params = [];

    if (cat_id != null) {
      upt_cols.push("cat_id = ?");
      params.push(cat_id);
    }
    if (cat_name !== undefined) {
      upt_cols.push("cat_name = ?");
      params.push(cat_name);
    }
    if (descp) {
      upt_cols.push("descp = ?");
      params.push(descp);
    }
    if (address) {
      upt_cols.push("address = ?");
      params.push(address);
    }
    if (lat) {
      upt_cols.push("lat = ?");
      params.push(lng);
    }
    if (lng) {
      upt_cols.push("lng = ?");
      params.push(lng);
    }
    if(status){
      upt_cols.push("status = ?");
      params.push(status);
    }
    if (report_date) {
      upt_cols.push("report_date = ?");
      params.push(report_date);
    }
    if (media_id !== undefined) {
      upt_cols.push("media_id = ?");
      params.push(media_id);
    }
    if (incharge_id !== undefined) {
      upt_cols.push("incharge_id = ?");
      params.push(incharge_id);
    }
    if (member_id !== undefined) {
      upt_cols.push("member_id = ?");
      params.push(member_id);
    }
    params.push(id);

    let issue_from_info = await issueMdl.getIssueInfo(id);
    let issue_from_date = issue_from_info?.data[0]?.report_date;
    let user_id = issue_from_info?.data[0]?.user_id;
    let today = new Date();
    today = formatDateForSQL(today);
    today = String(today);

    const result = await issueMdl.updateIssue({ upt_cols, params });
    
    const data = {
      id: id,
      cat_id: cat_id,
      cat_name: cat_name,
      descp: descp,
      address: address,
      lat: lat,
      lng: lng,
      status: status,
      media_id: media_id === null ? [] : media_id,
      report_date: report_date,
      incharge_id: incharge_id === null ? [] : incharge_id,
      member_id: member_id === null ? [] : member_id,
    };

    if (cat_id > 0) {
      const cat_name = await issueMdl.getCatName(cat_id);
      data.cat_name = cat_name?.data[0]?.cat_name;
    }

    if (media_id != null) {
      const id = media_id.split(",");
      const media_result = await sourceMdl.getMedia(id);
      // console.log(media_result?.data);
      data.media_id = media_result?.data;
    }

    if (incharge_id != null) {
      const id = incharge_id.split(",");
      let incharge_result = await meetingMdl.getattnds(id);
      incharge_result = incharge_result?.data;
      // console.log(incharge_result);
      let incharge_result_with_roles = await Promise.all(
        incharge_result.map(async (obj) => {
          const role_id = obj.role_id;
          const roles = await meetingMdl.getRole(role_id);
          // console.log(roles);
          const { ...rest } = obj;
          return { ...rest, role_name: roles?.data[0]?.role_name };
        }),
      );
      // const {...rest, incharge_id: incharge_result_with_roles} = obj;
      data.incharge_id = incharge_result_with_roles;
    }
    if (member_id != null) {
      const id = member_id.split(",");
      let member_result = await meetingMdl.getattnds(id);
      member_result = member_result?.data;
      // console.log(incharge_result);
      let member_result_with_roles = await Promise.all(
        member_result.map(async (obj) => {
          const role_id = obj.role_id;
          const roles = await meetingMdl.getRole(role_id);
          // console.log(roles);
          const { ...rest } = obj;
          return { ...rest, role_name: roles?.data[0]?.role_name };
        }),
      );
      // const {...rest, incharge_id: incharge_result_with_roles} = obj;
      data.member_id = member_result_with_roles;
    }

    const response = replaceNullWithEmptyString(data);

    if (
      result?.success === 1 &&
      issue_from_date.slice(0, 10) !== report_date.slice(0, 10)
    ) {
      if (report_date.slice(0, 10) === today.slice(0, 10)) {
        // delete and add
        await deleteNotification(user_id, "issue", id);
        await addNotification("ISSUE_UPDATED", user_id, "issue", id);
      }
      if (report_date.slice(0, 10) > today.slice(0, 10)) {
        //delete alone
        await deleteNotification(user_id, "issue", id);
      }
    }

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Issue updated successfully",
        [response],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update Issue",
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
export const getIssue = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getIssueSchema);
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
    let { user_id, status, assigned, from_date, to_date } =
      validatedData?.value;

    status = status === "" ? null : status.split(",");
    assigned = assigned === "" ? null : Number(assigned);
    from_date = from_date === "" ? null : from_date;
    to_date = to_date === "" ? null : to_date;

    const result = await issueMdl.getIssue({
      user_id,
      status,
      assigned,
      from_date,
      to_date,
    });

    const data = result?.data;
    const response = replaceNullWithEmptyString(data);

    const finalResponse = await Promise.all(
      response?.map(async (issue) => {
        let media_result = [];
        let incharge_with_role_names = [];
        let member_with_role_names = [];
        let cat_name = issue.cat_name;

        if (issue.cat_id !== 0) {
          const id = issue.cat_id;
          const result = await sourceMdl.getCatName(id);
          cat_name = result?.data[0]?.cat_name;
        }

        if (issue.media_id != null && issue.media_id !== "") {
          const media_id = issue.media_id.split(",");
          const result = await sourceMdl.getMedia(media_id);
          media_result = result?.data || [];
        }

        if (issue.incharge_id != null && issue.incharge_id !== "") {
          const incharge_id = issue.incharge_id.split(",");
          const result = await meetingMdl.getattnds(incharge_id);
          const incharge_result = result?.data || [];

          incharge_with_role_names = await Promise.all(
            incharge_result.map(async (incharge) => {
              let role_name = null;

              if (incharge.role_id) {
                const roleResult = await meetingMdl.getRole(incharge.role_id);
                role_name = roleResult?.data?.[0]?.role_name || null;
              }

              const { ...rest } = incharge;

              return {
                ...rest,
                role_name,
              };
            }),
          );
        }

        if (issue.member_id != null && issue.member_id !== "") {
          const member_id = issue.member_id.split(",");
          const result = await meetingMdl.getattnds(member_id);
          const member_result = result?.data || [];

          member_with_role_names = await Promise.all(
            member_result.map(async (member) => {
              let role_name = null;

              if (member.role_id) {
                const roleResult = await meetingMdl.getRole(member.role_id);
                role_name = roleResult?.data?.[0]?.role_name || null;
              }

              const { ...rest } = member;

              return {
                ...rest,
                role_name,
              };
            }),
          );
        }

        const { media_id, incharge_id, member_id, ...rest } = issue;

        return {
          ...rest,
          cat_name,
          media_id: media_result,
          incharge_id: incharge_with_role_names,
          member_id: member_with_role_names,
        };
      }),
    );
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Issue fetched successfully",
        finalResponse,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch Issue",
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
