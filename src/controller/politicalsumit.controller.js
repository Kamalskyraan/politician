import express from "express";
import {
  addSumitSchema,
  deleteSumitSchema,
  getSumitSchema,
  updateSumitSchema,
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
import { politicalSumitModel } from "../models/politicalsumit.model.js";
import { meetingModel } from "../models/meeting.model.js";

const sumitMdl = new politicalSumitModel();
const meetingMdl = new meetingModel();

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

    const data = {
      id: result?.data?.insertId,
      title: title,
      location: location,
      lat: lat,
      lng: lng,
      sumit_date: sumit_date,
      status: sts,
      vip: vip || [],
      member: member || [],
      sumit_incharge: sumit_incharge || [],
      dept_incharge: dept_incharge || [],
    };

    if (data.vip.length > 0) {
      const vip_data = await Promise.all(
        data.vip.map(async (obj, index) => {
          obj.id = result?.vipIds[index];
          const id = obj.cat_id;
          if (id > 0) {
            const result = await meetingMdl.getRole(id);
            // console.log(result)
            obj.cat_name = result?.data[0]?.role_name;
            return obj;
          } else {
            return obj;
          }
        }),
      );
      data.vip = vip_data || [];
    }
    if (data.member.length > 0) {
      const member_data = await Promise.all(
        data.member.map(async (obj, index) => {
          obj.id = result?.memberIds[index];
          const id = obj.cat_id;
          if (id > 0) {
            const result = await meetingMdl.getRole(id);
            // console.log(result)
            obj.cat_name = result?.data[0]?.role_name;
            return obj;
          } else {
            return obj;
          }
        }),
      );
      data.member = member_data || [];
    }
    if (data.sumit_incharge.length > 0) {
      const sumit_data = await Promise.all(
        data.sumit_incharge.map(async (obj, index) => {
          obj.id = result?.sumit_Incharge_Ids[index];
          const id = obj.cat_id;
          if (id > 0) {
            const result = await meetingMdl.getRole(id);
            // console.log(result)
            obj.cat_name = result?.data[0]?.role_name;
            return obj;
          } else {
            return obj;
          }
        }),
      );
      data.sumit_incharge = sumit_data || [];
    }
    if (data.dept_incharge.length > 0) {
      const dept_data = await Promise.all(
        data.dept_incharge.map(async (obj, index) => {
          obj.id = result?.dept_Incharge_Ids[index];
          const id = obj.cat_id;
          const dept_id = obj.dept_id;
          if (id > 0) {
            const result = await meetingMdl.getRole(id);
            obj.cat_name = result?.data[0]?.role_name;
            // return obj;
          }
          if (dept_id > 0) {
            const result = await sumitMdl.getDeptRole(dept_id);
            obj.dept_name = result?.data[0]?.category_name;
            // return obj;
          }
          return obj;
        }),
      );
      data.dept_incharge = dept_data || [];
    }

    const response = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      const currentDate = await getCurrentDateTime();
      if (currentDate.slice(0, 10) === sumit_date.slice(0, 10)) {
        await addNotification("SUMIT_CREATED", user_id, "sumit", data.id);
      }
    }

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Political sumit added successfully",
        [response],
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
    let { user_id, status, from_date, to_date, id, page } =
      validatedData?.value;
    // console.log("entered");

    status = status === "" ? null : status.split(",");
    from_date = from_date === "" ? null : from_date;
    to_date = to_date === "" ? null : to_date;
    id = id === "" ? null : Number(id);

    let upt_cols = [];
    let params = [];
    let data;
    let result;
    let pagination;

    if (id == null) {
      if (user_id != null) {
        upt_cols.push("user_id = ?");
        params.push(user_id);
      }
      if (status != null) {
        const placeholders = status.map(() => "?").join(", ");
        upt_cols.push(` AND status IN (${placeholders})`);
        params.push(...status);
      }
      if (from_date != null) {
        upt_cols.push(" AND sumit_date >= ?");
        params.push(`${from_date} 00:00:00`);
      }
      if (to_date != null) {
        upt_cols.push(" AND sumit_date <= ?");
        params.push(`${to_date} 23:59:59`);
      }
      result = await sumitMdl.getSumit({ upt_cols, params, page });
      data = result?.data;
      pagination = result?.pagination;
    } else if (id != null) {
      result = await sumitMdl.getSumitPeopleDetails(id);
      data = result?.data;
      // console.log("got data")

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
          // type: row.type,
          // designation: row.cat_id === 0 ? row.cat_name : row.designation,
          // department: row.dept_id === 0 ? row.dept_name : row.department,
          cat_id: row.cat_id,
          cat_name: row.cat_id === 0 ? row.cat_name : row.designation,
        };
        const dept_person = {
          id: row.people_id,
          name: row.name,
          // type: row.type,
          // designation: row.cat_id === 0 ? row.cat_name : row.designation,
          // department: row.dept_id === 0 ? row.dept_name : row.department,
          cat_id: row.cat_id,
          cat_name: row.cat_id === 0 ? row.cat_name : row.designation,
          dept_id: row.dept_id,
          dept_name: row.dept_id === 0 ? row.dept_name : row.department,
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
          response.dept_incharge.push(dept_person);
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
        [{ data, pagination }],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch political sumit",
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
    let {
      id,
      title,
      location,
      lat,
      lng,
      sumit_date,
      vip,
      member,
      sumit_incharge,
      dept_incharge,
      del_people,
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

    let sumit_from_info = await sumitMdl.getSumitInfo(id);
    let sumit_from_date = sumit_from_info?.data[0]?.sumit_date;
    let user_id = sumit_from_info?.data[0]?.user_id;
    let curr_today = new Date();
    curr_today = formatDateForSQL(today);
    curr_today = String(curr_today);

    const sumitResult = await sumitMdl.updateSumit({
      id,
      title,
      location,
      lat,
      lng,
      sumit_date,
      sts,
    });
    // console.log(sumitResult?.success);
    if (sumitResult?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update political sumit",
        [],
        "",
      );
    }
    // console.log("done summit details")
    let params = [];
    let updateResult = {
      success: 1,
    };
    let insertResult = {
      success: 1,
    };

    let newVipIds = [];
    let newMemberIds = [];
    let newSumitInchargeIds = [];
    let newDeptInchargeIds = [];

    if (vip.length > 0) {
      for (const value of vip) {
        if (value.id != null) {
          params = [value?.name, value?.cat_id, value?.cat_name, value?.id];
          let type = 1;
          let action = "update";
          updateResult = await sumitMdl.updateSumitPeople({
            type,
            params,
            action,
          });
        } else {
          params = [id, "vip", value?.name, value?.cat_id, value?.cat_name];
          let type = 1;
          let action = "insert";
          insertResult = await sumitMdl.updateSumitPeople({
            type,
            params,
            action,
          });
          newVipIds.push(insertResult?.data?.insertId);
        }
        // params = [id, "vip", value?.name, value?.cat_id, value?.cat_name];
        // const type = 1;
        // updateResult = await sumitMdl.updateSumitPeople({ type, params });
      }
    }
    if (member.length > 0) {
      for (const value of member) {
        if (value.id != null) {
          params = [value?.name, value?.cat_id, value?.cat_name, value?.id];
          let type = 1;
          let action = "update";
          updateResult = await sumitMdl.updateSumitPeople({
            type,
            params,
            action,
          });
        } else {
          params = [id, "member", value?.name, value?.cat_id, value?.cat_name];
          let type = 1;
          let action = "insert";
          insertResult = await sumitMdl.updateSumitPeople({
            type,
            params,
            action,
          });
          newMemberIds.push(insertResult?.data?.insertId);
        }
        // params = [id, "member", value?.name, value?.cat_id, value?.cat_name];
        // const type = 1;
        // updateResult = await sumitMdl.updateSumitPeople({ type, params });
      }
    }
    if (sumit_incharge.length > 0) {
      for (const value of sumit_incharge) {
        if (value.id != null) {
          params = [value?.name, value?.cat_id, value?.cat_name, value?.id];
          let type = 1;
          let action = "update";
          updateResult = await sumitMdl.updateSumitPeople({
            type,
            params,
            action,
          });
        } else {
          params = [
            id,
            "sumit incharge",
            value?.name,
            value?.cat_id,
            value?.cat_name,
          ];
          let type = 1;
          let action = "insert";
          insertResult = await sumitMdl.updateSumitPeople({
            type,
            params,
            action,
          });
          newSumitInchargeIds.push(insertResult?.data?.insertId);
        }
        // params = [
        //   id,
        //   "sumit incharge",
        //   value?.name,
        //   value?.cat_id,
        //   value?.cat_name,
        // ];
        // const type = 1;
        // updateResult = await sumitMdl.updateSumitPeople({ type, params });
      }
    }
    if (dept_incharge.length > 0) {
      for (const value of dept_incharge) {
        if (value.id != null) {
          params = [
            value?.name,
            value?.cat_id,
            value?.cat_name,
            value?.dept_id,
            value?.dept_name,
            value?.id,
          ];
          let type = 2;
          let action = "update";
          updateResult = await sumitMdl.updateSumitPeople({
            type,
            params,
            action,
          });
        } else {
          params = [
            id,
            "dept incharge",
            value?.name,
            value?.cat_id,
            value?.cat_name,
            value?.dept_id,
            value?.dept_name,
          ];
          let type = 2;
          let action = "insert";
          insertResult = await sumitMdl.updateSumitPeople({
            type,
            params,
            action,
          });
          newDeptInchargeIds.push(insertResult?.data?.insertId);
        }

        // params = [
        //   id,
        //   "dept incharge",
        //   value?.name,
        //   value?.cat_id,
        //   value?.cat_name,
        //   value?.dept_id,
        //   value?.dept_name,
        // ];
        // const type = 2;
        // updateResult = await sumitMdl.updateSumitPeople({ type, params });
      }
    }
    // console.log(updateResult?.success);
    if (updateResult?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update political sumit members",
        [],
        "",
      );
    }
    // console.log("done members updated")
    let deleteMemberResult = {
      success: 1,
    };
    if (del_people.length > 0) {
      deleteMemberResult = await sumitMdl.deleteSumitMember({ del_people });
    }

    if (
      sumitResult?.success === 1 &&
      updateResult?.success === 1 &&
      deleteMemberResult?.success === 1 &&
      sumit_from_date.slice(0, 10) !== sumit_date.slice(0, 10)
    ) {
      if (sumit_date.slice(0, 10) === curr_today.slice(0, 10)) {
        // delete and add
        await deleteNotification(user_id, "sumit", id);
        await addNotification("SUMIT_UPDATED", user_id, "sumit", id);
      }
      if (sumit_date.slice(0, 10) > curr_today.slice(0, 10)) {
        //delete alone
        await deleteNotification(user_id, "sumit", id);
      }
    }

    const data = {
      id: id,
      title: title,
      location: location,
      lat: lat,
      lng: lng,
      sumit_date: sumit_date,
      status: sts,
      vip: vip || [],
      member: member || [],
      sumit_incharge: sumit_incharge || [],
      dept_incharge: dept_incharge || [],
    };

    let newVipIndex = 0;
    let newMemberIndex = 0;
    let newSumitInchargeIndex = 0;
    let newDeptInchargeIndex = 0;
    if (data.vip.length > 0) {
      const vip_data = await Promise.all(
        data.vip.map(async (obj) => {
          if (obj.id == null) {
            obj.id = newVipIds[newVipIndex];
            newVipIndex++;
          }
          const id = obj.cat_id;
          if (id > 0) {
            const result = await meetingMdl.getRole(id);
            // console.log(result)
            obj.cat_name = result?.data[0]?.role_name;
            return obj;
          } else {
            return obj;
          }
        }),
      );
      data.vip = vip_data || [];
    }
    if (data.member.length > 0) {
      const member_data = await Promise.all(
        data.member.map(async (obj) => {
          if (obj.id == null) {
            obj.id = newMemberIds[newMemberIndex];
            newMemberIndex++;
          }
          const id = obj.cat_id;
          if (id > 0) {
            const result = await meetingMdl.getRole(id);
            // console.log(result)
            obj.cat_name = result?.data[0]?.role_name;
            return obj;
          } else {
            return obj;
          }
        }),
      );
      data.member = member_data || [];
    }
    if (data.sumit_incharge.length > 0) {
      const sumit_data = await Promise.all(
        data.sumit_incharge.map(async (obj) => {
          if (obj.id == null) {
            obj.id = newSumitInchargeIds[newSumitInchargeIndex];
            newSumitInchargeIndex++;
          }
          const id = obj.cat_id;
          if (id > 0) {
            const result = await meetingMdl.getRole(id);
            // console.log(result)
            obj.cat_name = result?.data[0]?.role_name;
            return obj;
          } else {
            return obj;
          }
        }),
      );
      data.sumit_incharge = sumit_data || [];
    }
    if (data.dept_incharge.length > 0) {
      const dept_data = await Promise.all(
        data.dept_incharge.map(async (obj) => {
          if (obj.id == null) {
            obj.id = newDeptInchargeIds[newDeptInchargeIndex];
            newDeptInchargeIndex++;
          }
          const id = obj.cat_id;
          const dept_id = obj.dept_id;
          if (id > 0) {
            const result = await meetingMdl.getRole(id);
            obj.cat_name = result?.data[0]?.role_name;
            // return obj;
          }
          if (dept_id > 0) {
            const result = await sumitMdl.getDeptRole(dept_id);
            obj.dept_name = result?.data[0]?.category_name;
            // return obj;
          }
          return obj;
        }),
      );
      // console.log(dept_data)
      data.dept_incharge = dept_data || [];
    }

    const response = replaceNullWithEmptyString(data);

    if (
      sumitResult?.success === 1 &&
      updateResult?.success === 1 &&
      deleteMemberResult?.success === 1
    ) {
      return sendResponse(
        res,
        200,
        1,
        "Political sumit updated successfully",
        [data],
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
