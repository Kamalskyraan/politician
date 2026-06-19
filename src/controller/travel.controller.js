import express from "express";
import fs from "fs";
import {
  adddailyplanSchema,
  addExpenseSchema,
  addNotesSchema,
  addTravelPhotosSchema,
  addTravelSchema,
  deleteDailyplanSchema,
  deleteExpenseSchema,
  deleteNotesSchema,
  deleteTravelPhotosSchema,
  deleteTravelSchema,
  getExpenseSchema,
  getNotesSchema,
  getTravelPhotosSchema,
  getTravelSchema,
  updatedailyplanSchema,
  updateExpenseSchema,
  updateNotesSchema,
  updateTravelPhotosSchema,
  updateTravelSchema,
  validateRequest,
} from "../utils/validator.js";
import {
  dateToMillis,
  formatDateForSQL,
  replaceNullWithEmptyString,
  sendResponse,
} from "../utils/helper.js";
import { travelModel } from "../models/travel.model.js";
import { sourceModel } from "../models/source.model.js";

const travelMdl = new travelModel();
const sourceMdl = new sourceModel();

export const addTravel = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addTravelSchema);

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
    // console.log(validatedData?.value);

    let {
      user_id,
      title,
      descp,
      purpose,
      travel_from,
      from_lat,
      from_lng,
      travel_to,
      to_lat,
      to_lng,
      from_date,
      to_date,
      vech_mode,
      media_id,
      in_hotel,
      hot_name,
      hot_address,
      hot_lat,
      hot_lng,
      hot_in,
      hot_out,
      hot_media,
      is_remind,
      remind_tenure,
      snooze_at,
    } = validatedData?.value;

    media_id = media_id === "" ? null : media_id;
    hot_name = hot_name === "" ? null : hot_name;
    hot_address = hot_address === "" ? null : hot_address;
    hot_lat = hot_lat === "" ? null : hot_lat;
    hot_lng = hot_lng === "" ? null : hot_lng;
    hot_in = hot_in === "" ? null : hot_in;
    hot_out = hot_out === "" ? null : hot_out;
    hot_media = hot_media === "" ? null : hot_media;
    remind_tenure = remind_tenure === "" ? null : remind_tenure;
    snooze_at = snooze_at === "" ? null : snooze_at;

    const media_allowfive = media_id ? media_id.split(",") : [];
    if (media_allowfive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media Id cannot be more than 5",
        [],
        "",
      );
    }
    const hot_allowfive = hot_media ? hot_media.split(",") : [];
    if (hot_allowfive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "hotel media Id cannot be more than 5",
        [],
        "",
      );
    }

    let from_date_obj;
    let to_date_obj;
    let hot_in_obj;
    let hot_out_obj;

    if (from_date && to_date) {
      from_date_obj = new Date(from_date);
      to_date_obj = new Date(to_date);
      from_date_obj.setSeconds(0, 0);
      to_date_obj.setSeconds(0, 0);
      from_date_obj = formatDateForSQL(from_date_obj);
      to_date_obj = formatDateForSQL(to_date_obj);
    }
    if (hot_in && hot_out) {
      hot_in_obj = new Date(hot_in);
      hot_out_obj = new Date(hot_out);
      hot_in_obj.setSeconds(0, 0);
      hot_out_obj.setSeconds(0, 0);
      hot_in_obj = formatDateForSQL(hot_in_obj);
      hot_out_obj = formatDateForSQL(hot_out_obj);
    }

    let remind_at;
    if (is_remind === 1 && remind_tenure) {
      remind_at = new Date(from_date).getTime() - remind_tenure * 1000;
      remind_at = new Date(remind_at);
      remind_at.setSeconds(0, 0);
      remind_at = formatDateForSQL(remind_at);
    }

    let nxt_snooze_at;
    if (is_remind === 1 && remind_tenure && snooze_at) {
      remind_at = new Date(from_date).getTime() - remind_tenure * 1000;
      nxt_snooze_at = remind_at + snooze_at * 1000;
      remind_at = new Date(remind_at);
      nxt_snooze_at = new Date(nxt_snooze_at);
      remind_at.setSeconds(0, 0);
      nxt_snooze_at.setSeconds(0, 0);
      remind_at = formatDateForSQL(remind_at);
      nxt_snooze_at = formatDateForSQL(nxt_snooze_at);
    }

    const result = await travelMdl.addTravel({
      user_id,
      title,
      descp,
      purpose,
      travel_from,
      from_lat,
      from_lng,
      travel_to,
      to_lat,
      to_lng,
      from_date_obj,
      to_date_obj,
      vech_mode,
      media_id,
      in_hotel,
      hot_name,
      hot_address,
      hot_lat,
      hot_lng,
      hot_in_obj,
      hot_out_obj,
      hot_media,
      is_remind,
      remind_at,
      remind_tenure,
      snooze_at,
      nxt_snooze_at,
    });
    // console.log(media_id);

    const data = {
      id: result?.data?.insertId,
      title: title,
      descp: descp,
      purpose: purpose,
      travel_from: travel_from,
      from_lat: from_lat,
      from_lng: from_lng,
      travel_to: travel_to,
      to_lat: to_lat,
      to_lng: to_lng,
      from_date: from_date,
      to_date: to_date,
      vech_mode: vech_mode,
      in_hotel: in_hotel,
      hot_name: hot_name,
      hot_address: hot_address,
      hot_lat: hot_lat,
      hot_lng: hot_lng,
      hot_in: hot_in,
      hot_out: hot_out,
      is_remind: is_remind,
      remind_tenure: remind_tenure,
      remind_at: remind_at,
      snooze_at: snooze_at,
      nxt_snooze_at: nxt_snooze_at,
      media: media_id === null ? [] : media_id,
      hotel_media: hot_media === null ? [] : hot_media,
      travel_daily_plans: [],
    };
    let media_result;
    if (media_id != null) {
      const ids = media_id.split(",");
      media_result = await sourceMdl.getMedia(ids);
      data.media = media_result?.data || [];
    }
    let hot_media_result;
    if (hot_media != null) {
      const ids = hot_media.split(",");
      hot_media_result = await sourceMdl.getMedia(ids);
      data.hotel_media = hot_media_result?.data || [];
    }
    const response = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel added Successfully",
        [response],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed To Add Travel",
        [],
        result?.error,
      );
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

export const deleteTravel = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteTravelSchema);

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
    // console.log(validatedData?.value);
    let { id } = validatedData?.value;

    const result = await travelMdl.deleteTravel({ id });

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Travel deleted successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to delete Travel", [], "");
    }
  } catch (error) {
    return sendResponse(res, 500, 0, "Internal Validation error", [], "");
  }
};

export const updateTravel = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateTravelSchema);
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
      purpose,
      travel_from,
      from_lat,
      from_lng,
      travel_to,
      to_lat,
      to_lng,
      from_date,
      to_date,
      vech_mode,
      media_id,
      in_hotel,
      hot_name,
      hot_address,
      hot_lat,
      hot_lng,
      hot_in,
      hot_out,
      hot_media,

      is_remind,
      remind_tenure,
      snooze_at,
    } = validatedData?.value;

    media_id = media_id === "" ? null : media_id;
    hot_name = hot_name === "" ? null : hot_name;
    hot_address = hot_address === "" ? null : hot_address;
    hot_lat = hot_lat === "" ? null : hot_lat;
    hot_lng = hot_lng === "" ? null : hot_lng;
    hot_in = hot_in === "" ? null : hot_in;
    hot_out = hot_out === "" ? null : hot_out;
    hot_media = hot_media === "" ? null : hot_media;
    remind_tenure = remind_tenure === "" ? null : remind_tenure;
    snooze_at = snooze_at === "" ? null : snooze_at;

    const allowfive = media_id ? media_id.split(",") : [];
    if (allowfive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media Id cannot be more than 5",
        [],
        "",
      );
    }

    let upt_cols = [];
    let params = [];

    let from_date_obj;
    let remind_at;
    let nxt_snooze_at;

    if (title) {
      upt_cols.push("title = ?");
      params.push(title);
    }
    if (descp) {
      upt_cols.push("descp = ?");
      params.push(descp);
    }
    if (purpose) {
      upt_cols.push("purpose = ?");
      params.push(purpose);
    }
    if (travel_from) {
      upt_cols.push("travel_from = ?, from_lat = ?, from_lng = ?");
      params.push(travel_from, from_lat, from_lng);
    }
    if (travel_to) {
      upt_cols.push("travel_to = ?, to_lat = ?, to_lng = ?");
      params.push(travel_to, to_lat, to_lng);
    }
    if (to_date) {
      to_date = new Date(to_date);
      to_date.setSeconds(0, 0);
      to_date = formatDateForSQL(to_date);
      upt_cols.push("to_date = ?");
      params.push(to_date);
    }
    if (from_date && is_remind === 0) {
      from_date_obj = new Date(from_date);
      from_date_obj.setSeconds(0, 0);
      from_date_obj = formatDateForSQL(from_date_obj);
      upt_cols.push(
        "from_date = ?, is_remind = ?, remind_tenure = ?, remind_at = ?, snooze_at = ?, nxt_snooze_at = ?",
      );
      params.push(from_date_obj, is_remind, null, null, null, null);
    }
    if (from_date && is_remind === 1 && remind_tenure != undefined) {
      remind_at = new Date(from_date).getTime() - remind_tenure * 1000;

      from_date_obj = new Date(from_date);
      remind_at = new Date(remind_at);

      from_date_obj.setSeconds(0, 0);
      remind_at.setSeconds(0, 0);

      from_date_obj = formatDateForSQL(from_date_obj);
      remind_at = formatDateForSQL(remind_at);

      upt_cols.push(
        "from_date = ?, is_remind = ?, remind_tenure = ?, remind_at = ?",
      );
      params.push(from_date_obj, is_remind, remind_tenure, remind_at);
    }
    if (
      from_date &&
      is_remind === 1 &&
      remind_tenure != undefined &&
      snooze_at != undefined
    ) {
      remind_at = new Date(from_date).getTime() - remind_tenure * 1000;
      nxt_snooze_at = remind_at + snooze_at * 1000;

      from_date_obj = new Date(from_date);
      remind_at = new Date(remind_at);
      nxt_snooze_at = new Date(nxt_snooze_at);

      from_date_obj.setSeconds(0, 0);
      remind_at.setSeconds(0, 0);
      nxt_snooze_at.setSeconds(0, 0);

      from_date_obj = formatDateForSQL(from_date_obj);
      remind_at = formatDateForSQL(remind_at);
      nxt_snooze_at = formatDateForSQL(nxt_snooze_at);

      upt_cols.push(
        "from_date = ?, is_remind = ?, remind_tenure = ?, snooze_at = ?, nxt_snooze_at = ?",
      );
      params.push(
        from_date_obj,
        is_remind,
        remind_tenure,
        snooze_at,
        nxt_snooze_at,
      );
    }
    if (vech_mode) {
      upt_cols.push("vech_mode = ?");
      params.push(vech_mode);
    }
    if (media_id !== undefined) {
      upt_cols.push("media_id = ?");
      params.push(media_id);
    }
    if (in_hotel === 0) {
      upt_cols.push(
        "in_hotel = ?, hot_name = ?, hot_address = ?, hot_lat = ?, hot_lng = ?, hot_in = ?, hot_out = ?, hot_media = ?",
      );
      params.push(in_hotel, null, null, null, null, null, null, null);
    }
    if (in_hotel === 1) {
      hot_in = new Date(hot_in);
      hot_out = new Date(hot_out);
      hot_in.setSeconds(0, 0);
      hot_out.setSeconds(0, 0);
      hot_in = formatDateForSQL(hot_in);
      hot_out = formatDateForSQL(hot_out);

      upt_cols.push(
        "in_hotel = ?, hot_name = ?, hot_address = ?, hot_lat = ?, hot_lng = ?, hot_in = ?, hot_out = ?, hot_media = ?",
      );
      params.push(
        in_hotel,
        hot_name,
        hot_address,
        hot_lat,
        hot_lng,
        hot_in,
        hot_out,
        hot_media,
      );
    }

    // console.log(params);

    params.push(id);

    const result = await travelMdl.updateTravel({ upt_cols, params });

    const data = {
      id: id,
      title: title,
      descp: descp,
      purpose: purpose,
      travel_from: travel_from,
      from_lat: from_lat,
      from_lng: from_lng,
      travel_to: travel_to,
      to_lat: to_lat,
      to_lng: to_lng,
      from_date: from_date,
      to_date: to_date,
      vech_mode: vech_mode,
      in_hotel: in_hotel,
      hot_name: hot_name,
      hot_address: hot_address,
      hot_lat: hot_lat,
      hot_lng: hot_lng,
      hot_in: hot_in,
      hot_out: hot_out,
      is_remind: is_remind,
      remind_tenure: remind_tenure,
      remind_at: remind_at,
      snooze_at: snooze_at,
      nxt_snooze_at: nxt_snooze_at,
      media: media_id === null ? [] : media_id,
      hotel_media: hot_media === null ? [] : hot_media,
      travel_daily_plans: [],
    };

    let media_result;
    if (media_id != null) {
      const ids = media_id.split(",");
      media_result = await sourceMdl.getMedia(ids);
      data.media = media_result?.data || [];
    }
    let hot_media_result;
    if (hot_media != null) {
      const ids = hot_media.split(",");
      hot_media_result = await sourceMdl.getMedia(ids);
      data.hotel_media = hot_media_result?.data || [];
    }
    let travel_daily_plans;
    travel_daily_plans = await travelMdl.getDailyplan({ id });
    data.travel_daily_plans = travel_daily_plans?.data;

    const response = replaceNullWithEmptyString(data);

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel updated successfully",
        [response],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update Travel",
        [],
        result?.error,
      );
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

export const getTravel = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getTravelSchema);

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

    let { user_id, from_date, to_date } = validatedData?.value;
    // console.log(from_date)
    let result;
    let travels;
    let upt_cols = [];
    let params = [];

    if (user_id) {
      upt_cols.push("user_id = ?");
      params.push(user_id);
    }
    if (from_date) {
      upt_cols.push(" AND from_date <= ?");
      params.push(`${to_date} 23:59:59`);
    }
    if (to_date) {
      upt_cols.push(" AND to_date >= ?");
      params.push(`${from_date} 00:00:00`);
    }

    result = await travelMdl.getTravel(upt_cols, params);

    // if (user_id) {
    //   result = await travelMdl.getTravel({ user_id });
    // }
    if (result?.success === 0) {
      return sendResponse(res, 200, 0, "failed to fetch travels", [], "");
    } else if (result?.success === 1) {
      travels = result?.data;

      // console.log(typeof(travels[0]?.snooze_at));

      const formattedTravels = await Promise.all(
        travels.map(async (travel) => {
          let media_ids;
          let mediaResult;
          let hot_media_ids;
          let hot_media_result;
          let media = [];
          let hotel_media = [];

          if (travel.media_id !== null) {
            media_ids = travel.media_id.split(",");
            mediaResult = await sourceMdl.getMedia(media_ids);
          }
          media = mediaResult?.data || [];
          // console.log(media);

          if (travel.hot_media !== null) {
            hot_media_ids = travel.hot_media.split(",");
            hot_media_result = await sourceMdl.getMedia(hot_media_ids);
          }
          hotel_media = hot_media_result?.data || [];

          const { media_id, hot_media, ...rest } = travel;
          return { ...rest, media, hotel_media };
        }),
      );
      // console.log(formattedTravels);
      // dp means Daily plan
      const travelwithdp = await Promise.all(
        formattedTravels.map(async (formattedTravel) => {
          if (formattedTravel?.id) {
            const id = formattedTravel?.id;
            const dpResult = await travelMdl.getDailyplan({ id });
            const dailyPlan = dpResult?.data;
            // console.log(dailyPlan);

            let planMediaResult;
            const dpMedia = await Promise.all(
              dailyPlan.map(async (plan) => {
                if (plan?.media_id) {
                  let dpMediaId = plan.media_id.split(",");

                  const result = await sourceMdl.getMedia(dpMediaId);

                  planMediaResult = result?.data || [];
                }

                const { media_id, ...rest } = plan;
                return { ...rest, planMediaResult };
              }),
            );
            let travel_daily_plans = dpMedia;
            return { ...formattedTravel, travel_daily_plans };
          }
        }),
      );
      // console.log(travelwithdp);
      // console.log(travelwithdp[0].from_date instanceof Date);

      const response = replaceNullWithEmptyString(travelwithdp);
      // console.log(typeof(response[0]?.from_date))

      return sendResponse(
        res,
        200,
        1,
        "Travels fetched successfully",
        response,
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

export const addDailyPlan = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, adddailyplanSchema);

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

    let { user_id, travel_id, from, to, departure, vech_mode, media_id } =
      validatedData?.value;

    media_id = media_id === "" ? null : media_id;
    const allowFive = media_id ? media_id.split(",") : [];
    if (allowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media_id cannot be greater than 5",
        [],
        "",
      );
    }
    departure = new Date(departure);
    departure.setSeconds(0, 0);
    departure = formatDateForSQL(departure);

    const result = await travelMdl.addDailyplan({
      user_id,
      travel_id,
      from,
      to,
      departure,
      vech_mode,
      media_id,
    });

    if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to add daily Plan", [], "");
    } else if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Daily Plan added successfully", [], "");
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

export const updatedailyplan = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updatedailyplanSchema);

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

    let { id, from, to, departure, vech_mode, media_id } = validatedData?.value;

    media_id = media_id === "" ? null : media_id;
    const allowFive = media_id ? media_id.split(",") : [];
    if (allowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media_id cannot be greater than 5",
        [],
        "",
      );
    }
    let upt_cols = [];
    let params = [];

    if (from) {
      upt_cols.push("plan_from = ?");
      params.push(from);
    }
    if (to) {
      upt_cols.push("plan_to = ?");
      params.push(to);
    }
    if (departure) {
      departure = new Date(departure);
      departure.setSeconds(0, 0);
      departure = formatDateForSQL(departure);
      upt_cols.push("departure = ?");
      params.push(departure);
    }
    if (vech_mode) {
      upt_cols.push("vech_mode = ?");
      params.push(vech_mode);
    }
    if (media_id !== undefined) {
      upt_cols.push("media_id = ?");
      params.push(media_id);
    }
    params.push(id);

    const result = await travelMdl.updateDailyplan({ upt_cols, params });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Daily plan updated successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Daily plan update failed", [], "");
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

export const deleteDailyplan = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteDailyplanSchema);

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

    let { id } = validatedData?.value;

    const result = await travelMdl.deleteDailyplan({ id });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Daily plan deleted successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete Daily travel plan",
        [],
        "",
      );
    }
  } catch (error) {
    return sendResponse(res, 500, 0, "Internal server error", [], "");
  }
};

export const addExpense = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addExpenseSchema);

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

    let { user_id, travel_id, category, notes, exp_date, amount } =
      validatedData?.value;

    exp_date = new Date(exp_date);
    exp_date.setSeconds(0, 0);

    exp_date = formatDateForSQL(exp_date);

    const result = await travelMdl.addExpense({
      user_id,
      travel_id,
      category,
      notes,
      exp_date,
      amount,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "travel expense added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to add travel expense", [], "");
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

export const deleteExpense = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteExpenseSchema);

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

    let { id } = validatedData?.value;

    const result = await travelMdl.deleteExpense({ id });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel expense deleted Successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete Travel expense",
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

export const updateExpense = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateExpenseSchema);

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

    let { id, category, notes, exp_date, amount } = validatedData?.value;

    notes = notes === "" ? null : notes;

    let upt_cols = [];
    let params = [];

    if (category) {
      upt_cols.push("category = ?");
      params.push(category);
    }
    if (notes !== undefined) {
      upt_cols.push("notes = ?");
      params.push(notes);
    }
    if (exp_date) {
      exp_date = new Date(exp_date);
      exp_date.setSeconds(0, 0);
      exp_date = formatDateForSQL(exp_date);

      console.log(exp_date);
      upt_cols.push("exp_date = ?");
      params.push(exp_date);
    }
    if (amount) {
      upt_cols.push("amount = ?");
      params.push(amount);
    }

    params.push(id);

    const result = await travelMdl.updateExpense({ upt_cols, params });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel expense updated Successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update travel expense",
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

export const getExpense = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getExpenseSchema);

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

    let { travel_id } = validatedData?.value;

    const result = await travelMdl.getExpense({ travel_id });

    const response = replaceNullWithEmptyString(result?.data);
    // const date_cols = ["exp_date"];
    // const finalResponse = dateToMillis(response, date_cols);

    // console.log(result?.data);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel expense fetched successfully",
        response,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch travel expense",
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

export const addNotes = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addNotesSchema);

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

    let { user_id, travel_id, title, descp } = validatedData?.value;

    const result = await travelMdl.addNotes({
      user_id,
      travel_id,
      title,
      descp,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel notes added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to add Travel notes", [], "");
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

export const getNotes = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getNotesSchema);

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

    let { travel_id } = validatedData?.value;
    const result = await travelMdl.getNotes({ travel_id });
    const data = result?.data;
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel notes fetched successfully",
        data,
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to fetch Travel notes", [], "");
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

export const updateNotes = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateNotesSchema);

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

    let { id, title, descp } = validatedData?.value;

    descp = descp === "" ? null : descp;
    let upt_cols = [];
    let params = [];

    if (title) {
      upt_cols.push("title = ?");
      params.push(title);
    }
    if (descp !== undefined) {
      upt_cols.push("descp = ?");
      params.push(descp);
    }
    params.push(id);

    const result = await travelMdl.updateNotes({ upt_cols, params });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel notes updated successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to update Travel notes", [], "");
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

export const deleteNotes = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteNotesSchema);

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

    let { id } = validatedData?.value;
    const result = await travelMdl.deleteNotes({ id });
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel notes deleted successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to delete Travel notes", [], "");
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

export const addTravelPhotos = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addTravelPhotosSchema);

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

    let { user_id, travel_id, media_id } = validatedData?.value;

    const allowFive = media_id ? media_id.split(",") : [];
    if (allowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media id cannot be greater than 5",
        [],
        "",
      );
    }

    const result = await travelMdl.addTravelPhotos({
      user_id,
      travel_id,
      media_id,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel photos added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(res, 200, 0, "Failed to add travel photos", [], "");
    }
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      "error.message",
    );
  }
};

export const updateTravelPhotos = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateTravelPhotosSchema);

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

    let { travel_id, media_id } = validatedData?.value;
    const allowFive = media_id ? media_id.split(",") : [];
    if (allowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media id cannot be greater than 5",
        [],
        "",
      );
    }

    media_id = media_id.split(",");
    const fetch_result = await travelMdl.getTravelPhotos({ travel_id });

    let fetch_media_id = fetch_result?.data[0]?.media_id;
    fetch_media_id = fetch_media_id.split(",");

    fetch_media_id.push(...media_id);
    fetch_media_id = fetch_media_id.join(",");
    // console.log(fetch_media_id);

    const result = await travelMdl.updateTravelPhotos({
      travel_id,
      fetch_media_id,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel photos updated successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update travel photos",
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

export const getTravelPhotos = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getTravelPhotosSchema);

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

    let { travel_id } = validatedData?.value;

    const result = await travelMdl.getTravelPhotos({ travel_id });
    // console.log("Travel photos",result?.data);

    let travel_photos_data = result?.data;

    const travel_photos = await Promise.all(
      travel_photos_data.map(async (data) => {
        let media_result = [];
        if (data?.media_id) {
          const media_id = data?.media_id.split(",");
          console.log(media_id);
          media_result = await sourceMdl.getMedia(media_id);
          // console.log(media_result?.data)
          media_result = media_result?.data;
        }
        // media_result.length === 0 ? [] : media_result;
        // console.log(media_result)
        const { media_id, ...rest } = data;
        return { ...rest, media_result };
      }),
    );
    // console.log(travel_photos);
    if (travel_photos.length > 0) {
      return sendResponse(
        res,
        200,
        1,
        "Travel photos fetched successfully",
        travel_photos,
        "",
      );
    } else if (travel_photos.length === 0) {
      return sendResponse(res, 200, 0, "Failed to fetch Travel photos", [], "");
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

export const deleteTravelPhotos = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteTravelPhotosSchema);

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

    let { media_id, travel_id } = validatedData?.value;

    // need to get media by media and delete physically

    media_id = media_id.split(",");

    const delete_result = await sourceMdl.getDeleteMedia(media_id);

    let delete_media_result = delete_result?.data;

    let deleted_id = delete_media_result.map((media) => {
      fs.unlinkSync(media.path_name);
      return String(media.id);
    });
    // console.log(deleted_id);

    const delete_media_table = await sourceMdl.deleteMedia(deleted_id);

    const travel_photos = await travelMdl.getTravelPhotos({ travel_id });
    let existing_media_id = travel_photos?.data[0]?.media_id;
    // console.log(existing_media_id);
    existing_media_id = existing_media_id.split(",");
    existing_media_id = existing_media_id.filter(
      (id) => !deleted_id.includes(id),
    );

    // console.log(existing_media_id);
    let fetch_media_id = existing_media_id.join(",");

    const result = await travelMdl.updateTravelPhotos({
      travel_id,
      fetch_media_id,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel photos deleted successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete travel photos",
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

export const addTravelDocs = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, addTravelPhotosSchema);

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

    let { user_id, travel_id, media_id } = validatedData?.value;

    const result = await travelMdl.addTravelDocs({
      user_id,
      travel_id,
      media_id,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel Documents added successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to add travel Documents",
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
      "error.message",
    );
  }
};
export const updateTravelDocs = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, updateTravelPhotosSchema);

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

    let { travel_id, media_id } = validatedData?.value;
    const allowFive = media_id ? media_id.split(",") : [];
    if (allowFive.length > 5) {
      return sendResponse(
        res,
        200,
        0,
        "media id cannot be greater than 5",
        [],
        "",
      );
    }

    media_id = media_id.split(",");
    const fetch_result = await travelMdl.getTravelDocs({ travel_id });

    let fetch_media_id = fetch_result?.data[0]?.media_id;
    fetch_media_id = fetch_media_id.split(",");

    fetch_media_id.push(...media_id);
    fetch_media_id = fetch_media_id.join(",");
    console.log(fetch_media_id);

    const result = await travelMdl.updateTravelDocs({
      travel_id,
      fetch_media_id,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel documents updated successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to update travel documents",
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
export const getTravelDocs = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, getTravelPhotosSchema);

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

    let { travel_id } = validatedData?.value;

    const result = await travelMdl.getTravelDocs({ travel_id });
    // console.log("Travel photos",result?.data);

    let travel_docs_data = result?.data;

    const travel_docs = await Promise.all(
      travel_docs_data.map(async (data) => {
        let media_result = [];
        if (data?.media_id) {
          const media_id = data?.media_id.split(",");
          // console.log(media_id);
          media_result = await sourceMdl.getMedia(media_id);
          // console.log(media_result?.data)
          media_result = media_result?.data;
        }
        const { media_id, ...rest } = data;
        return { ...rest, media_result };
      }),
    );
    // console.log(travel_photos);
    if (travel_docs.length > 0) {
      return sendResponse(
        res,
        200,
        1,
        "Travel documents fetched successfully",
        travel_docs,
        "",
      );
    } else if (travel_docs.length === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to fetch Travel documents",
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
export const deleteTravelDocs = async (req, res) => {
  try {
    const validatedData = validateRequest(req.body, deleteTravelPhotosSchema);

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

    let { media_id, travel_id } = validatedData?.value;

    // need to get media by media and delete physically

    media_id = media_id.split(",");

    const delete_result = await sourceMdl.getDeleteMedia(media_id);

    let delete_media_result = delete_result?.data;

    let deleted_id = delete_media_result.map((media) => {
      fs.unlinkSync(media.path_name);
      return String(media.id);
    });
    // console.log(deleted_id);

    const delete_media_table = await sourceMdl.deleteMedia(deleted_id);

    const travel_photos = await travelMdl.getTravelDocs({ travel_id });
    let existing_media_id = travel_photos?.data[0]?.media_id;
    // console.log(existing_media_id);
    existing_media_id = existing_media_id.split(",");
    existing_media_id = existing_media_id.filter(
      (id) => !deleted_id.includes(id),
    );

    // console.log(existing_media_id);
    let fetch_media_id = existing_media_id.join(",");

    const result = await travelMdl.updateTravelDocs({
      travel_id,
      fetch_media_id,
    });

    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel photos deleted successfully",
        [],
        "",
      );
    } else if (result?.success === 0) {
      return sendResponse(
        res,
        200,
        0,
        "Failed to delete travel photos",
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
