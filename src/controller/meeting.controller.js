import express from "express";
import { meetingModel } from "../models/meeting.model.js";
import {
  sendResponse,
  formatDateForSQL,
  replaceNullWithEmptyString,
  dateToMillis,
  getCurrentDateTime,
  addNotification,
  deleteNotification,
} from "../utils/helper.js";
import {
  addAppointSchema,
  addMeetingSchema,
  addMemberSchema,
  deleteAppointSchema,
  deleteMeetingSchema,
  deleteMemberSchema,
  getAppointSchema,
  getMeetingSchema,
  getMemberschema,
  updateAppointSchema,
  updateMeetingSchema,
  updateMemberSchema,
  userIdSchema,
  validateRequest,
} from "../utils/validator.js";
import { format } from "path";
import { send } from "process";
import { sourceModel } from "../models/source.model.js";
import { supportModel } from "../models/support.model.js";
import { sendPushNotification } from "../service/notification.service.js";

const sourceMdl = new sourceModel();
const supportMdl = new supportModel();

const meetingMdl = new meetingModel();

export const addMembers = async (req, res) => {
  try {
    // const { user_id, name, phn_num, role_id, district } = req.body;

    const validatedData = validateRequest(req.body, addMemberSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        validatedData?.errorObject?.errors,
        [],
        "",
      );
    }

    const { user_id, name, phn_num, role_id, country, state, district } =
      validatedData?.value;

    const result = await meetingMdl.addMember({
      user_id,
      name,
      phn_num,
      role_id,
      country,
      state,
      district,
    });
    // console.log(result?.data?.insertId);

    const role_result = await sourceMdl.getUserrole(role_id);
    // console.log(role_result);
    let data = {
      id: result?.data?.insertId,
      name: name,
      phn_num: phn_num,
      role_id: role_id,
      role_name: role_result?.data[0]?.role_name,
      country: country,
      state: state,
      district: district,
    };
    data = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "member added successfully", [data], "");
    } else {
      return sendResponse(
        res,
        200,
        0,
        "failed to add member",
        [],
        result?.error,
      );
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal Server Error in add member",
      [],
      error.message,
    );
  }
};

export const getMembers = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getMemberschema);
    // console.log(validatedData);

    let { user_id, role_id, district } = validatedData?.value;

    role_id = role_id === "" ? null : Number(role_id);
    // district = district === "" ? null : district;

    let upt_cols = [];
    let params = [];

    upt_cols.push("m.user_id = ?");
    params.push(user_id);

    if (role_id != undefined) {
      upt_cols.push("m.role_id = ?");
      params.push(role_id);
    }
    if (district !== undefined && district.length > 0) {
      upt_cols.push(`m.district IN (${district.map(() => "?").join(",")})`);
      params.push(...district);
    }
    upt_cols.push("m.status = ?");
    params.push("active");
    // console.log(upt_cols);
    // console.log(params);

    const result = await meetingMdl.getMember({ upt_cols, params });
    const data = (await result?.data) || [];

    if (result?.data.length >= 1) {
      return sendResponse(res, 200, 1, "Member fetched successfully", data, "");
    } else {
      return sendResponse(
        res,
        200,
        0,
        "no member found for this user Id",
        [],
        "",
      );
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server Error",
      "",
      error.message,
    );
  }
};

export const updateMembers = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateMemberSchema);

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

    let { id, name, phn_num, role_id, state, district } = validatedData?.value;

    let country = "India";

    const result = await meetingMdl.updateMember({
      id,
      name,
      phn_num,
      role_id,
      country,
      state,
      district,
    });

    const role_result = await sourceMdl.getUserrole(role_id);

    let data = {
      id: id,
      name: name,
      phn_num: phn_num,
      role_id: role_id,
      role_name: role_result?.data[0]?.role_name,
      country: country,
      state: state,
      district: district,
    };

    data = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "member details updated", [data], "");
    } else {
      return sendResponse(res, 200, 0, "Failed to update members", [], "");
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server Error",
      [],
      error.message,
    );
  }
};

export const deleteMembers = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteMemberSchema);

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

    const { id } = validatedData?.value;

    const result = await meetingMdl.deleteMember({ id });

    //   console.log(result);

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "member deleted successfully", [], "");
    } else {
      return sendResponse(res, 200, 0, "Failed to delete meeting", [], "");
    }
  } catch (error) {
    sendResponse(res, 500, 0, "Internal server error", [], error.message);
  }
};

export const addMeeting = async (req, res) => {
  try {
    const validatedData = await validateRequest(req.body, addMeetingSchema);

    if (validatedData?.success === 0) {
      sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation Error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    let {
      user_id,
      title,
      descp,
      m_type,
      m_priority,
      m_link,
      notes,
      address,
      lat,
      lng,
      media_id,
      attnds_id,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,
    } = validatedData?.value;

    let remind_at;
    let nxt_snooze_at;

    m_link = m_link === "" ? null : m_link;
    notes = notes === "" ? null : notes;
    address = address === "" ? null : address;
    lat = lat === "" ? null : lat;
    lng = lng === "" ? null : lng;
    media_id = media_id === "" ? null : media_id;
    remind_tenure = remind_tenure === "" ? null : Number(remind_tenure);
    // remind_at = is_remind === 0 ? null : remind_at;
    snooze_at = snooze_at === "" ? null : Number(snooze_at);
    // nxt_snooze_at = is_remind === 0 ? null : nxt_snooze_at;

    let mediaAllowFive = media_id ? media_id.split(",") : [];
    let attndAllowFive = attnds_id ? attnds_id.split(",") : [];
    if (mediaAllowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "Too many id's have ben passed in media Only '5' or less than '5' are valid",
        [],
        "",
      );
    }
    mediaAllowFive = mediaAllowFive.length === 0 ? null : mediaAllowFive;

    if (lat !== null) {
      lat = parseFloat(lat);
    }
    if (lng !== null) {
      lng = parseFloat(lng);
    }

    let from_date_obj;
    let to_date_obj;
    let status = "upcoming";

    if (is_remind === 1 && snooze_at) {
      let remind_at;
      let nxt_snooze_at;
      from_date_obj = new Date(from_date);
      to_date_obj = new Date(to_date);
      // from_date_obj.setSeconds(0, 0);
      // to_date_obj.setSeconds(0, 0);

      remind_at = from_date_obj.getTime() - remind_tenure * 1000;
      nxt_snooze_at = remind_at + snooze_at * 1000;

      remind_at = new Date(remind_at);
      nxt_snooze_at = new Date(nxt_snooze_at);
      // from_date_obj = new Date(Number(from_date));
      // to_date_obj = new Date(Number(to_date));

      // console.log(remind_at);

      remind_at.setSeconds(0, 0);

      nxt_snooze_at.setSeconds(0, 0);

      from_date_obj.setSeconds(0, 0);

      to_date_obj.setSeconds(0, 0);

      // remind_at = remind_at.getTime();
      // nxt_snooze_at = nxt_snooze_at.getTime();
      // from_date_obj = from_date_obj.getTime();
      // to_date_obj = to_date_obj.getTime();

      const today = new Date();
      if (from_date_obj.getDate() <= today.getDate()) {
        status = "pending";
      }

      remind_at = formatDateForSQL(remind_at);
      nxt_snooze_at = formatDateForSQL(nxt_snooze_at);
      from_date_obj = formatDateForSQL(from_date_obj);
      to_date_obj = formatDateForSQL(to_date_obj);

      // console.log(from_date_obj);

      const result = await meetingMdl.addMeeting({
        user_id,
        title,
        descp,
        m_type,
        m_priority,
        m_link,
        notes,
        address,
        lat,
        lng,
        status,
        media_id,
        attnds_id,
        from_date_obj,
        to_date_obj,
        is_remind,
        remind_tenure,
        remind_at,
        snooze_at,
        nxt_snooze_at,
      });

      let media_result = [];
      let attnds_result = [];

      if (media_id != null) {
        let media_ids = media_id.split(",");
        const result = await sourceMdl.getMedia(media_ids);
        // console.log(result);
        media_result = result?.data || [];
      }
      if (attnds_id != null) {
        let attnds_ids = attnds_id.split(",");
        const result = await meetingMdl.getattnds(attnds_ids);
        // console.log(result);
        attnds_result = result?.data;
        const attndsWithRoles = await Promise.all(
          attnds_result.map(async (attendee) => {
            const id = attendee?.role_id;
            let role_name_result = await meetingMdl.getRole(id);
            let role_name = role_name_result?.data[0]?.role_name;
            const { role_id, ...rest } = attendee;
            return { ...rest, role_name };
          }),
        );
        attnds_result = attndsWithRoles;
      }

      const data = {
        id: result?.data?.insertId,
        title: title,
        descp: descp,
        m_type: m_type,
        m_priority: m_priority,
        m_link: m_link,
        notes: notes,
        address: address,
        lat: lat === null ? lat : String(lat),
        lng: lng === null ? lng : String(lng),
        status: status,
        from_date: from_date,
        to_date: to_date,
        is_remind: is_remind,
        remind_tenure:
          remind_tenure === null ? remind_tenure : String(remind_tenure),
        remind_at: remind_at,
        snooze_at: snooze_at === null ? snooze_at : String(snooze_at),
        nxt_snooze_at: nxt_snooze_at,
        media_id: media_result,
        attnds_id: attnds_result,
      };

      const response = replaceNullWithEmptyString(data);

      // notification will add if the from date is today's date
      const currentDate = await getCurrentDateTime();
      if (currentDate.slice(0, 10) === from_date.slice(0, 10)) {
        await addNotification("MEETING_CREATED", user_id, "meeting", data.id);
      }

      if (result?.success === 1) {
        sendResponse(res, 200, 1, "meeting added successfully", [response], "");
      } else {
        sendResponse(res, 200, 0, result?.error, [], "");
      }
    } else if (is_remind === 0) {
      // let media_id_arr = media_id.toString();
      // let attnds_id_arr = attnds_id.toString();
      // console.log(from_date);

      from_date_obj = new Date(from_date);
      to_date_obj = new Date(to_date);
      from_date_obj.setSeconds(0, 0);
      to_date_obj.setSeconds(0, 0);
      // console.log(from_date_obj);

      from_date_obj = formatDateForSQL(from_date_obj);
      to_date_obj = formatDateForSQL(to_date_obj);

      // console.log(from_date_obj);
      // console.log(status);

      const result = await meetingMdl.addMeeting({
        user_id,
        title,
        descp,
        m_type,
        m_priority,
        m_link,
        notes,
        address,
        lat,
        lng,
        status,
        media_id,
        attnds_id,
        from_date_obj,
        to_date_obj,
        is_remind,
        remind_at,
        remind_tenure,
        snooze_at,
        nxt_snooze_at,
      });

      await sendPushNotification(user_id, {
        title: "Meeting created",
        message: "New meeting has been created",
      });
      // return;

      let media_result = [];
      let attnds_result = [];

      if (media_id != null) {
        let media_ids = media_id.split(",");
        const result = await sourceMdl.getMedia(media_ids);
        // console.log(result);
        media_result = result?.data || [];
      }
      if (attnds_id != null) {
        let attnds_ids = attnds_id.split(",");
        const result = await meetingMdl.getattnds(attnds_ids);
        // console.log(result);
        attnds_result = result?.data;
        const attndsWithRoles = await Promise.all(
          attnds_result.map(async (attendee) => {
            const id = attendee?.role_id;
            let role_name_result = await meetingMdl.getRole(id);
            let role_name = role_name_result?.data[0]?.role_name;
            const { role_id, ...rest } = attendee;
            return { ...rest, role_name };
          }),
        );
        attnds_result = attndsWithRoles;
      }

      const data = {
        id: result?.data?.insertId,
        title: title,
        descp: descp,
        m_type: m_type,
        m_priority: m_priority,
        m_link: m_link,
        notes: notes,
        address: address,
        lat: lat === null ? lat : String(lat),
        lng: lng === null ? lng : String(lng),
        status: status,
        from_date: from_date,
        to_date: to_date,
        is_remind: is_remind,
        remind_tenure:
          remind_tenure === null ? remind_tenure : String(remind_tenure),
        remind_at: remind_at,
        snooze_at: snooze_at === null ? snooze_at : String(snooze_at),
        nxt_snooze_at: nxt_snooze_at,
        media_id: media_result,
        attnds_id: attnds_result,
      };

      const response = replaceNullWithEmptyString(data);

      // notification will add if the from date is today's date
      if (result?.success === 1) {
        const currentDate = await getCurrentDateTime();
        if (currentDate.slice(0, 10) === from_date.slice(0, 10)) {
          await addNotification("MEETING_CREATED", user_id, "meeting", data.id);
        }
      }

      if (result?.success === 1) {
        return sendResponse(
          res,
          200,
          1,
          "meeting added successfully",
          [response],
          "",
        );
      } else {
        return sendResponse(res, 200, 0, result?.error, [], "");
      }
    } else if (is_remind === 1 && !snooze_at) {
      let remind_at;
      from_date_obj = new Date(from_date);
      to_date_obj = new Date(to_date);

      from_date_obj.setSeconds(0, 0);
      to_date_obj.setSeconds(0, 0);

      // from_date_obj = from_date_obj.getTime();
      // to_date_obj = to_date_obj.getTime();

      remind_at = from_date_obj.getTime() - remind_tenure * 1000;
      remind_at = new Date(remind_at);
      remind_at.setSeconds(0, 0);
      // remind_at = remind_at.getTime();

      from_date_obj = formatDateForSQL(from_date_obj);
      to_date_obj = formatDateForSQL(to_date_obj);
      remind_at = formatDateForSQL(remind_at);

      const result = await meetingMdl.addMeeting({
        user_id,
        title,
        descp,
        m_type,
        m_priority,
        m_link,
        notes,
        address,
        lat,
        lng,
        status,
        media_id,
        attnds_id,
        from_date_obj,
        to_date_obj,
        is_remind,
        remind_tenure,
        remind_at,
        snooze_at,
        nxt_snooze_at,
      });

      let media_result = [];
      let attnds_result = [];

      if (media_id != null) {
        let media_ids = media_id.split(",");
        const result = await sourceMdl.getMedia(media_ids);
        // console.log(result);
        media_result = result?.data || [];
      }
      if (attnds_id != null) {
        let attnds_ids = attnds_id.split(",");
        const result = await meetingMdl.getattnds(attnds_ids);
        // console.log(result);
        attnds_result = result?.data;
        const attndsWithRoles = await Promise.all(
          attnds_result.map(async (attendee) => {
            const id = attendee?.role_id;
            let role_name_result = await meetingMdl.getRole(id);
            let role_name = role_name_result?.data[0]?.role_name;
            const { role_id, ...rest } = attendee;
            return { ...rest, role_name };
          }),
        );
        attnds_result = attndsWithRoles;
      }

      const data = {
        id: result?.data?.insertId,
        title: title,
        descp: descp,
        m_type: m_type,
        m_priority: m_priority,
        m_link: m_link,
        notes: notes,
        address: address,
        lat: lat === null ? lat : String(lat),
        lng: lng === null ? lng : String(lng),
        status: status,
        from_date: from_date,
        to_date: to_date,
        is_remind: is_remind,
        remind_tenure:
          remind_tenure === null ? remind_tenure : String(remind_tenure),
        remind_at: remind_at,
        snooze_at: snooze_at === null ? snooze_at : String(snooze_at),
        nxt_snooze_at: nxt_snooze_at,
        media_id: media_result,
        attnds_id: attnds_result,
      };

      const response = replaceNullWithEmptyString(data);

      // notification will add if the from date is today's date
      const currentDate = await getCurrentDateTime();
      if (currentDate.slice(0, 10) === from_date.slice(0, 10)) {
        await addNotification("MEETING_CREATED", user_id, "meeting", data.id);
      }
      if (result?.success === 1) {
        sendResponse(res, 200, 1, "meeting added successfully", [response], "");
      } else {
        sendResponse(res, 200, 0, result?.error, [], "");
      }
    }
  } catch (error) {
    // console.log(error);
    return sendResponse(
      res,
      500,
      0,
      "Internal server Error",
      [],
      error.message,
    );
  }
};

export const getMeeting = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getMeetingSchema);

    if (validatedData?.success === 0) {
      sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation Error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    let { user_id, status, from_date, to_date, page } = validatedData?.value;
    let result = [];
    let meetings = [];

    status = status === "" ? null : status.split(",");
    // console.log(status);
    from_date = from_date === "" ? null : from_date;
    to_date = to_date === "" ? null : to_date;

    result = await meetingMdl.getMeeting({
      user_id,
      status,
      from_date,
      to_date,
      page,
    });

    if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "there is no meeting to fetch",
        [],
        result?.error,
      );
    } else {
      meetings = await result?.data;
      // console.log("meeting test",typeof(result?.data))
    }
    let attendeesWithRoles = [];

    const formattedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        let media = [];
        let attendees = [];

        // MEDIA
        if (meeting.media_id) {
          const mediaIds = meeting.media_id.split(","); // or JSON.parse
          const mediaResult = await sourceMdl.getMedia(mediaIds);
          media = mediaResult?.data || [];
        }

        // ATTENDEES
        if (meeting.attnds_id) {
          const attendeeIds = meeting.attnds_id.split(","); // or JSON.parse
          const attndResult = await meetingMdl.getattnds(attendeeIds);
          attendees = attndResult?.data || [];

          try {
            attendeesWithRoles = await Promise.all(
              attendees.map(async (attnd) => {
                let role_name;
                if (attnd?.role_id) {
                  const roleResult = await meetingMdl.getRole(attnd.role_id);
                  role_name = roleResult?.data?.[0]?.role_name;
                }
                const { ...rest } = attnd;
                return { ...rest, role_name };
              }),
            );
          } catch (error) {
            console.error("Role lookup failed:", error);
            // fallback: return attendees without role enrichment
            attendeesWithRoles = attendees.map(({ role_id, ...rest }) => ({
              ...rest,
              role_name: null,
            }));
          }
        }

        // REMOVE RAW IDS
        const { media_id, attnds_id, ...rest } = meeting;

        // RETURN UPDATED MEETING
        return {
          ...rest,
          media,
          attendees: attendeesWithRoles,
        };
      }),
    );

    // console.log(formattedMeetings);
    const response = await replaceNullWithEmptyString(formattedMeetings);
    // console.log(response[0].to_date);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "meetings fetched successfully",
        [{ data: response, pagination: result?.pagination }],
        "",
      );
    } else {
      return sendResponse(res, 200, 0, error, [], "");
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

export const deleteMeeting = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteMeetingSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation Error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    const { id } = validatedData?.value;

    const result = await meetingMdl.deleteMeeting({ id });

    const data = result?.data || "";
    const error = result?.error || "";

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Meeting deleted successfully",
        [],
        error,
      );
    } else {
      return sendResponse(res, 200, 0, "Failed to delete meeting", [], "");
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

export const updateMeeting = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateMeetingSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "Validation error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    let {
      id,
      title,
      descp,
      m_type,
      m_priority,
      m_link,
      notes,
      address,
      lat,
      lng,
      media_id,
      attnds_id,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,
    } = validatedData?.value;

    m_link = m_link === "" ? null : m_link;
    notes = notes === "" ? null : notes;
    address = address === "" ? null : address;
    lat = lat === "" ? null : lat;
    lng = lng === "" ? null : lng;
    media_id = media_id === "" ? null : media_id;
    remind_tenure = remind_tenure === "" ? null : Number(remind_tenure);
    // remind_at = is_remind === 0 ? null : remind_at;
    snooze_at = snooze_at === "" ? null : Number(snooze_at);
    // nxt_snooze_at = is_remind === 0 ? null : nxt_snooze_at;

    let mediaAllowFive = media_id ? media_id.split(",") : [];
    let attndAllowFive = attnds_id ? attnds_id.split(",") : [];
    if (mediaAllowFive.length > 5 || attndAllowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "Too many id's have ben passed in media or attendees id. Only '5' or less than '5' are valid",
        [],
        "",
      );
    }

    const update_columns = [];
    const params = [];

    if (title) {
      update_columns.push("title = ?");
      params.push(title);
    }

    if (descp) {
      update_columns.push("descp = ?");
      params.push(descp);
    }

    if (m_type) {
      update_columns.push("m_type = ?");
      params.push(m_type);
    }

    if (m_priority) {
      update_columns.push("m_priority = ?");
      params.push(m_priority);
    }

    if (m_link !== undefined) {
      update_columns.push("m_link = ?");
      params.push(m_link);
    }

    if (notes !== undefined) {
      update_columns.push("notes = ?");
      params.push(notes === "" ? null : notes);
    }

    if (address !== undefined) {
      update_columns.push("address = ?, lat = ?, lng = ?");
      params.push(
        address === "" ? null : address,
        lat === "" ? null : lat,
        lng === "" ? null : lng,
      );
    }
    if (media_id !== undefined) {
      update_columns.push("media_id = ?");
      params.push(media_id === "" ? null : media_id);
    }
    if (attnds_id) {
      update_columns.push("attnds_id = ?");
      params.push(attnds_id);
    }
    if (to_date) {
      let to = to_date;
      to = new Date(to);
      to.setSeconds(0, 0);
      to = formatDateForSQL(to);
      update_columns.push("to_date = ?");
      params.push(to);
    }
    if (from_date && is_remind === 0) {
      from_date = new Date(from_date);
      from_date.setSeconds(0, 0);
      let meeting_date = from_date;
      from_date = formatDateForSQL(from_date);
      // console.log(from_date);
      let sts = "upcoming";
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      meeting_date.setHours(0, 0, 0, 0);
      if (
        meeting_date.getFullYear() === today.getFullYear() &&
        meeting_date.getMonth() === today.getMonth() &&
        meeting_date.getDate() === today.getDate()
      ) {
        sts = "pending";
      }
      update_columns.push("status = ?, from_date = ?");
      params.push(sts, from_date);
    }
    let reminder_at;
    let snzee_at;

    if (from_date && is_remind === 1) {
      let date = from_date;
      let status_date = date;
      let sts = "upcoming";
      let today = new Date();
      date = new Date(date);

      reminder_at = date.getTime() - remind_tenure * 1000;

      if (snooze_at !== null) {
        snzee_at = reminder_at + snooze_at * 1000;
        snzee_at = new Date(snzee_at);
        snzee_at.setSeconds(0, 0);
        // snzee_at = snzee_at.getTime();
        // console.log(snzee_at);
        snzee_at = formatDateForSQL(snzee_at);
        // update_columns.push("snooze_at = ?");
        // params.push(snooze_at);
      } else {
        snzee_at = null;
        // snooze_at = null;
        // update_columns.push("snooze_at = ?");
        // params.push(snooze_at);
      }

      reminder_at = new Date(reminder_at);
      // date = new Date(date);
      date.setSeconds(0, 0);
      reminder_at.setSeconds(0, 0);
      // reminder_at = reminder_at.getTime();
      // console.log(date);
      // date = date.getTime();
      // console.log(date);

      status_date = new Date(status_date);

      status_date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (status_date.getTime() === today.getTime()) {
        sts = "pending";
      }

      // console.log(snzee_at);
      date = formatDateForSQL(date);
      reminder_at = formatDateForSQL(reminder_at);
      // snzee_at = formatDateForSQL(snzee_at);
      // console.log(nxt_snooze_at);

      update_columns.push(
        "status = ?, from_date = ?, is_remind = ?, remind_tenure = ?, remind_at = ?, snooze_at = ?,nxt_snooze_at = ?",
      );
      params.push(
        sts,
        date,
        1,
        remind_tenure,
        reminder_at,
        snooze_at,
        snzee_at,
      );
    }

    // if (is_remind === 0) {
    //   update_columns.push(
    //     "is_remind = ?, remind_status = ?, remind_tenure = ?, remind_at = ?, snooze_at = ?, nxt_snooze_at = ?",
    //   );
    //   params.push(0, null, null, null, null, null);
    // }

    params.push(id);
    // console.log(update_columns);
    let meeting_from_info = await meetingMdl.getMeetingInfo(id);
    let meeting_from_date = meeting_from_info?.data[0]?.from_date;
    let user_id = meeting_from_info?.data[0]?.user_id;
    let today = new Date();
    today = formatDateForSQL(today);
    today = String(today);

    const result = await meetingMdl.updateMeeting(update_columns, params);

    let media_result = [];
    let attnds_result = [];

    if (media_id != null) {
      let media_ids = media_id.split(",");
      const result = await sourceMdl.getMedia(media_ids);
      // console.log(result);
      media_result = result?.data || [];
    }
    if (attnds_id != null) {
      let attnds_ids = attnds_id.split(",");
      const result = await meetingMdl.getattnds(attnds_ids);
      // console.log(result);
      attnds_result = result?.data;
      const attndsWithRoles = await Promise.all(
        attnds_result.map(async (attendee) => {
          const id = attendee?.role_id;
          let role_name_result = await meetingMdl.getRole(id);
          let role_name = role_name_result?.data[0]?.role_name;
          const { ...rest } = attendee;
          return { ...rest, role_name };
        }),
      );
      attnds_result = attndsWithRoles;
    }

    const data = {
      title: title,
      descp: descp,
      m_type: m_type,
      m_priority: m_priority,
      m_link: m_link,
      notes: notes,
      address: address,
      lat: lat,
      lng: lng,
      from_date: from_date,
      to_date: to_date,
      is_remind: is_remind,
      remind_tenure: remind_tenure === null ? null : String(remind_tenure),
      remind_at: reminder_at,
      snooze_at: snooze_at === null ? null : String(snooze_at),
      nxt_snooze_at: snzee_at,
      media_id: media_result,
      attnds_id: attnds_result,
    };

    const response = replaceNullWithEmptyString(data);

    // iff 24 = 24 ---> delete old notify + in progress + notification trigger
    //if 25 > 24 --> delete old one + status upcoming
    // console.log(meeting_from_date, today);

    if (
      result?.success === 1 &&
      meeting_from_date.slice(0, 10) !== from_date.slice(0, 10)
    ) {
      if (from_date.slice(0, 10) === today.slice(0, 10)) {
        // delete and add
        await deleteNotification(user_id, "meeting", id);
        await addNotification("MEETING_UPDATED", user_id, "meeting", id);
      }
      if (from_date.slice(0, 10) > today.slice(0, 10)) {
        //delete alone
        await deleteNotification(user_id, "meeting", id);
      }
    }

    if (result?.success === 0) {
      // console.log(result?.error);
      return sendResponse(
        res,
        200,
        0,
        "failed to update meeting successfully",
        [],
        "",
      );
    } else {
      return sendResponse(
        res,
        200,
        1,
        "meetings updated successfully",
        [response],
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

export const addAppointment = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addAppointSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "Validation Error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    let {
      user_id,
      title,
      a_type,
      notes,
      address,
      lat,
      lng,
      media_id,
      con_name,
      con_desg,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,
    } = validatedData?.value;

    notes = notes === "" ? null : notes;
    address = address === "" ? null : address;
    lat = lat === "" ? null : lat;
    lng = lng === "" ? null : lng;
    media_id = media_id === "" ? null : media_id;
    con_desg = con_desg === "" ? null : con_desg;
    remind_tenure = remind_tenure === "" ? null : Number(remind_tenure);
    // remind_at = is_remind === 0 ? null : remind_at;
    snooze_at = snooze_at === "" ? null : Number(snooze_at);
    // nxt_snooze_at = is_remind === 0 ? null : nxt_snooze_at;

    const allowFive = media_id ? media_id.split(",") : [];
    if (allowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media id's cannot be greater than 5",
        [],
        "",
      );
    }

    if (is_remind === 0) {
      let from_date_obj = new Date(from_date);
      let to_date_obj = new Date(to_date);

      let today = new Date();
      let status = "upcoming";

      if (
        from_date_obj.getFullYear() === today.getFullYear() &&
        from_date_obj.getMonth() === today.getMonth() &&
        from_date_obj.getDate() === today.getDate()
      ) {
        status = "pending";
      }
      from_date_obj.setSeconds(0, 0);
      to_date_obj.setSeconds(0, 0);

      from_date_obj = formatDateForSQL(from_date_obj);
      to_date_obj = formatDateForSQL(to_date_obj);

      const result = await meetingMdl.addappointment({
        user_id,
        title,
        a_type,
        notes,
        address,
        lat,
        lng,
        status,
        media_id,
        con_name,
        con_desg,
        from_date_obj,
        to_date_obj,
        is_remind,
        remind_tenure,
      });
      // console.log(result);

      let data = {
        id: result?.data?.insertId,
        title: title,
        a_type: a_type,
        notes: notes,
        address: address,
        lat: lat,
        lng: lng,
        con_name: con_name,
        con_desg: con_desg,
        status: status,
        from_date: from_date,
        to_date: to_date,
        is_remind: is_remind,
        remind_status: "pending",
        remind_tenure: null,
        remind_at: null,
        snooze_at: null,
        nxt_snooze_at: null,
        media: [],
      };

      let media_result;
      if (media_id != null) {
        const ids = media_id.split(",");
        media_result = await sourceMdl.getMedia(ids);
        data.media = media_result?.data || [];
      }

      const response = replaceNullWithEmptyString(data);

      if (result?.success === 1) {
        return sendResponse(
          res,
          200,
          1,
          "Appointment added successfully",
          [response],
          "",
        );
      } else if (result?.success === 0) {
        return sendResponse(
          res,
          200,
          0,
          "Failed to add Appointment",
          [],
          result?.error,
        );
      }
    } else if (is_remind === 1 && !snooze_at) {
      let from_date_obj = new Date(from_date);
      let remind_at = from_date_obj.getTime() - remind_tenure * 1000;

      let to_date_obj = new Date(to_date);
      remind_at = new Date(remind_at);

      let today = new Date();
      let status = "upcoming";

      if (
        from_date_obj.getFullYear() === today.getFullYear() &&
        from_date_obj.getMonth() === today.getMonth() &&
        from_date_obj.getDate() === today.getDate()
      ) {
        status = "pending";
      }

      from_date_obj.setSeconds(0, 0);
      to_date_obj.setSeconds(0, 0);
      remind_at.setSeconds(0, 0);

      from_date_obj = formatDateForSQL(from_date_obj);
      to_date_obj = formatDateForSQL(to_date_obj);
      remind_at = formatDateForSQL(remind_at);

      const result = await meetingMdl.addappointment({
        user_id,
        title,
        a_type,
        notes,
        address,
        lat,
        lng,
        status,
        media_id,
        con_name,
        con_desg,
        from_date_obj,
        to_date_obj,
        is_remind,
        remind_tenure,
        remind_at,
      });

      let data = {
        id: result?.data?.insertId,
        title: title,
        a_type: a_type,
        notes: notes,
        address: address,
        lat: lat,
        lng: lng,
        con_name: con_name,
        con_desg: con_desg,
        status: status,
        from_date: from_date,
        to_date: to_date,
        is_remind: is_remind,
        remind_status: "pending",
        remind_tenure: String(remind_tenure),
        remind_at: remind_at,
        snooze_at: null,
        nxt_snooze_at: null,
        media: [],
      };

      let media_result;
      if (media_id != null) {
        const ids = media_id.split(",");
        media_result = await sourceMdl.getMedia(ids);
        data.media = media_result?.data || [];
      }

      const response = replaceNullWithEmptyString(data);
      if (result?.success === 1) {
        return sendResponse(
          res,
          200,
          1,
          "Appointment added successfully",
          [response],
          "",
        );
      } else if (result?.success === 0) {
        return sendResponse(res, 200, 0, "Failed to add Appointment", [], "");
      }
    } else if (is_remind === 1 && snooze_at) {
      let from_date_obj = new Date(from_date);
      let to_date_obj = new Date(to_date);
      let remind_at = from_date_obj.getTime() - remind_tenure * 1000;
      let nxt_snooze_at = remind_at + snooze_at * 1000;

      remind_at = new Date(Number(remind_at));
      nxt_snooze_at = new Date(Number(nxt_snooze_at));

      let today = new Date();
      let status = "upcoming";

      if (
        from_date_obj.getFullYear() === today.getFullYear() &&
        from_date_obj.getMonth() === today.getMonth() &&
        from_date_obj.getDate() === today.getDate()
      ) {
        status = "pending";
      }

      from_date_obj.setSeconds(0, 0);
      to_date_obj.setSeconds(0, 0);
      remind_at.setSeconds(0, 0);
      nxt_snooze_at.setSeconds(0, 0);

      from_date_obj = formatDateForSQL(from_date_obj);
      to_date_obj = formatDateForSQL(to_date_obj);
      remind_at = formatDateForSQL(remind_at);
      nxt_snooze_at = formatDateForSQL(nxt_snooze_at);

      const result = await meetingMdl.addappointment({
        user_id,
        title,
        a_type,
        notes,
        address,
        lat,
        lng,
        status,
        media_id,
        con_name,
        con_desg,
        from_date_obj,
        to_date_obj,
        is_remind,
        remind_tenure,
        remind_at,
        snooze_at,
        nxt_snooze_at,
      });
      let data = {
        id: result?.data?.insertId,
        title: title,
        a_type: a_type,
        notes: notes,
        address: address,
        lat: lat,
        lng: lng,
        con_name: con_name,
        con_desg: con_desg,
        status: status,
        from_date: from_date,
        to_date: to_date,
        is_remind: is_remind,
        remind_status: "pending",
        remind_tenure: String(remind_tenure),
        remind_at: remind_at,
        snooze_at: String(snooze_at),
        nxt_snooze_at: String(nxt_snooze_at),
        media: [],
      };

      let media_result;
      if (media_id != null) {
        const ids = media_id.split(",");
        media_result = await sourceMdl.getMedia(ids);
        data.media = media_result?.data || [];
      }

      const response = replaceNullWithEmptyString(data);

      if (result?.success === 1) {
        const currentDate = await getCurrentDateTime();
        if (currentDate.slice(0, 10) === from_date.slice(0, 10)) {
          await addNotification(
            "APPOINTMENT_CREATED",
            user_id,
            "appointment",
            data.id,
          );
        }
      }

      if (result?.success === 1) {
        return sendResponse(
          res,
          200,
          1,
          "Appointment added successfully",
          [response],
          "",
        );
      } else if (result?.success === 0) {
        return sendResponse(res, 200, 0, "Failed to add Appointment", [], "");
      }
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal Server error",
      [],
      error.message,
    );
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteAppointSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "Validation Error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    const { id } = validatedData?.value;

    const result = await meetingMdl.deleteAppoint({ id });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Appointment deleted successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete Appointment",
        [],
        result?.error,
      );
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

export const getAppointment = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getAppointSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "validation Error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    let { user_id, status, from_date, to_date, page } = validatedData?.value;
    let result;
    let appointments;
    let upt_cols = [];
    let params = [];

    // if (user_id && !status) {
    //   result = await meetingMdl.getAppoint({ user_id });
    //   // console.log("completed appoint fetching");
    // } else if (user_id && status) {
    //   result = await meetingMdl.getAppoint({ user_id, status });
    // }
    // if (result?.success === 0) {
    //   return sendResponse(res, 200, 0, "failed to fetch appointments", [], "");
    // } else if (result?.success === 1) {
    //   appointments = result?.data;
    //   console.log(appointments);
    // }

    status = status === "" ? null : status.split(",");
    from_date = from_date === "" ? null : from_date;
    to_date = to_date === "" ? null : to_date;

    // console.log(status)

    if (user_id) {
      upt_cols.push("user_id = ?");
      params.push(user_id);
    }
    if (status != null) {
      const placeholders = status.map(() => "?").join(",");
      upt_cols.push(` AND status IN (${placeholders})`);
      params.push(...status);
    }
    if (from_date != null) {
      upt_cols.push(" AND from_date <= ?");
      params.push(`${to_date} 23:59:59`);
    }
    if (to_date != null) {
      upt_cols.push(" AND to_date >= ?");
      params.push(`${from_date} 00:00:00`);
    }

    result = await meetingMdl.getAppoint(upt_cols, params, page);

    appointments = result?.data;
    // console.log(appointments[0]);

    // console.log(typeof(appointments[0]?.remind_at));

    const formattedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        // console.log(appointment);

        let mediaIds = [];
        let mediaResult = [];
        let media = [];

        if (appointment.media_id) {
          mediaIds = appointment.media_id.split(",");
          // console.log(mediaIds);
          mediaResult = await sourceMdl.getMedia(mediaIds);
          // console.log(mediaResult?.data);
          media = mediaResult?.data || [];
        }
        const { media_id, ...rest } = appointment;
        return { ...rest, media };
      }),
    );
    const response = replaceNullWithEmptyString(formattedAppointments);
    // console.log(response);
    const pagination = result?.pagination;

    return sendResponse(
      res,
      200,
      1,
      "Appointments fetched successfully",
      [{ data: response, pagination: pagination }],
      "",
    );
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

export const updateAppointment = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateAppointSchema);

    if (validatedData?.success === 0) {
      return sendResponse(
        res,
        validatedData?.errorObject?.status,
        0,
        "Validation Error",
        [],
        validatedData?.errorObject?.errors,
      );
    }

    let {
      id,
      title,
      a_type,
      notes,
      address,
      lat,
      lng,
      media_id,
      con_name,
      con_desg,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,
    } = validatedData?.value;
    // console.log(validatedData?.value);

    notes = notes === "" ? null : notes;
    address = address === "" ? null : address;
    lat = lat === "" ? null : lat;
    lng = lng === "" ? null : lng;
    media_id = media_id === "" ? null : media_id;
    con_desg = con_desg === "" ? null : con_desg;
    remind_tenure = remind_tenure === "" ? null : Number(remind_tenure);
    // remind_at = is_remind === 0 ? null : remind_at;
    snooze_at = snooze_at === "" ? null : Number(snooze_at);
    // nxt_snooze_at = is_remind === 0 ? null : nxt_snooze_at;

    const allowFive = media_id ? media_id.split(",") : [];

    if (allowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media Id cannot be more than five",
        [],
        "",
      );
    }

    // console.log(req.body);

    let upt_cols = [];
    let params = [];

    if (title) {
      upt_cols.push("title = ?");
      params.push(title);
    }

    if (a_type) {
      upt_cols.push("a_type = ?");
      params.push(a_type);
    }

    if (notes !== undefined) {
      upt_cols.push("notes = ?");
      params.push(notes);
    }

    if (address !== undefined) {
      upt_cols.push("address = ?");
      params.push(address);
    }
    if (lat !== undefined) {
      upt_cols.push("lat = ?");
      params.push(lat);
    }
    if (lng !== undefined) {
      upt_cols.push("lng = ?");
      params.push(lng);
    }

    if (media_id !== undefined) {
      upt_cols.push("media_id = ?");
      params.push(media_id);
    }
    if (con_name) {
      upt_cols.push("con_name = ?");
      params.push(con_name);
    }
    if (con_desg !== undefined) {
      upt_cols.push("con_desg = ?");
      params.push(con_desg);
    }
    // if (status) {
    //   upt_cols.push("status = ?");
    //   params.push(status);
    // }
    if (to_date) {
      to_date = new Date(to_date);
      to_date.setSeconds(0, 0);
      to_date = formatDateForSQL(to_date);
      upt_cols.push("to_date = ?");
      params.push(to_date);
    }
    if (from_date && is_remind === 0) {
      let today = new Date();
      let sts = "pending";
      from_date = new Date(from_date);
      // console.log(from_date);
      if (
        from_date.getFullYear() === today.getFullYear() &&
        from_date.getMonth() === today.getMonth() &&
        from_date.getDate() === today.getDate()
      ) {
        sts = "pending";
      } else if (
        from_date.getFullYear() > today.getFullYear() ||
        from_date.getMonth() > today.getMonth() ||
        from_date.getDate() > today.getDate()
      ) {
        sts = "upcoming";
      }
      from_date.setSeconds(0, 0);
      from_date = formatDateForSQL(from_date);
      upt_cols.push(
        "from_date = ?, status = ?, is_remind = ?, remind_tenure = ?, snooze_at = ?, remind_at = ?, nxt_snooze_at = ?",
      );
      params.push(
        from_date,
        sts,
        is_remind,
        remind_tenure,
        snooze_at,
        null,
        null,
      );
    }
    let remind_at;

    if (from_date && is_remind === 1 && !snooze_at) {
      let today = new Date();
      let sts = "pending";
      from_date = new Date(from_date);
      remind_at = from_date.getTime() - remind_tenure * 1000;
      remind_at = new Date(remind_at);

      if (
        from_date.getFullYear() === today.getFullYear() &&
        from_date.getMonth() === today.getMonth() &&
        from_date.getDate() === today.getDate()
      ) {
        sts = "pending";
      } else if (
        from_date.getFullYear() > today.getFullYear() ||
        from_date.getMonth() > today.getMonth() ||
        from_date.getDate() > today.getDate()
      ) {
        sts = "upcoming";
      }

      from_date.setSeconds(0, 0);
      remind_at.setSeconds(0, 0);
      from_date = formatDateForSQL(from_date);
      remind_at = formatDateForSQL(remind_at);

      upt_cols.push(
        "from_date = ?, status = ?, is_remind = ?, remind_tenure = ?, remind_at = ?",
      );
      params.push(from_date, sts, is_remind, remind_tenure, remind_at);
    }
    let nxt_snooze_at;
    if (from_date && is_remind === 1 && snooze_at) {
      let today = new Date();
      let sts = "pending";

      from_date = new Date(from_date);

      // do arithmetic on numbers
      remind_at = from_date.getTime() - remind_tenure * 1000;

      nxt_snooze_at = remind_at + snooze_at * 1000;

      // convert to Date objects only after math
      remind_at = new Date(remind_at);
      // console.log(remind_at);

      nxt_snooze_at = new Date(nxt_snooze_at);

      if (
        from_date.getFullYear() === today.getFullYear() &&
        from_date.getMonth() === today.getMonth() &&
        from_date.getDate() === today.getDate()
      ) {
        sts = "pending";
      } else if (
        from_date.getFullYear() > today.getFullYear() ||
        from_date.getMonth() > today.getMonth() ||
        from_date.getDate() > today.getDate()
      ) {
        sts = "upcoming";
      }
      from_date.setSeconds(0, 0);
      remind_at.setSeconds(0, 0);
      nxt_snooze_at.setSeconds(0, 0);

      from_date = formatDateForSQL(from_date);
      remind_at = formatDateForSQL(remind_at);
      nxt_snooze_at = formatDateForSQL(nxt_snooze_at);

      upt_cols.push(
        "from_date = ?, status = ?, is_remind = ?, remind_tenure = ?, remind_at = ?, snooze_at = ?, nxt_snooze_at = ?",
      );
      params.push(
        from_date,
        sts,
        is_remind,
        remind_tenure,
        remind_at,
        snooze_at,
        nxt_snooze_at,
      );
    }
    // console.log(upt_cols);
    // console.log(params);
    params.push(id);

    let appointment_from_info = await meetingMdl.getAppointmentInfo(id);
    let appointment_from_date = appointment_from_info?.data[0]?.from_date;
    let user_id = appointment_from_info?.data[0]?.user_id;
    let today = new Date();
    today = formatDateForSQL(today);
    today = String(today);

    const result = await meetingMdl.updateAppointment({ upt_cols, params });
    // console.log(result?.data);

    const data = {
      id: id,
      title: title,
      a_type: a_type,
      notes: notes,
      address: address,
      lat: lat,
      lng: lng,
      con_name: con_name,
      con_desg: con_desg,
      from_date: from_date,
      to_date: to_date,
      is_remind: is_remind,
      remind_tenure: remind_tenure === null ? null : String(remind_tenure),
      remind_at: remind_at,
      snooze_at: snooze_at === null ? null : String(snooze_at),
      nxt_snooze_at: nxt_snooze_at,
      media_id: media_id,
    };

    let media_result;
    if (media_id != null) {
      const ids = media_id.split(",");
      media_result = await sourceMdl.getMedia(ids);
      data.media_id = media_result?.data || [];
    }

    const response = replaceNullWithEmptyString(data);

    if (
      result?.success === 1 &&
      appointment_from_date.slice(0, 10) !== from_date.slice(0, 10)
    ) {
      if (from_date.slice(0, 10) === today.slice(0, 10)) {
        // delete and add
        await deleteNotification(user_id, "appointment", id);
        await addNotification(
          "APPOINTMENT_UPDATED",
          user_id,
          "appointment",
          id,
        );
      }
      if (from_date.slice(0, 10) > today.slice(0, 10)) {
        //delete alone
        await deleteNotification(user_id, "appointment", id);
      }
    }

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Appointment updated successfully",
        [response],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Appointment update failed",
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
