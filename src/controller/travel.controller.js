import express from "express";
import {
  adddailyplanSchema,
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
import { send } from "process";

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

    if (media_id) {
      const allowfive = media_id.split(",");
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
    }
    if (hot_media) {
      const allowfive = hot_media.split(",");
      if (allowfive.length > 5) {
        return sendResponse(
          res,
          200,
          0,
          "hotel media Id cannot be more than 5",
          [],
          "",
        );
      }
    }

    let from_date_obj;
    let to_date_obj;
    let hot_in_obj;
    let hot_out_obj;

    if (from_date && to_date) {
      from_date_obj = new Date(Number(from_date));
      to_date_obj = new Date(Number(to_date));
      from_date_obj.setSeconds(0, 0);
      to_date_obj.setSeconds(0, 0);
      from_date_obj = formatDateForSQL(from_date_obj);
      to_date_obj = formatDateForSQL(to_date_obj);
    }
    if (hot_in && hot_out) {
      hot_in_obj = new Date(Number(hot_in));
      hot_out_obj = new Date(Number(hot_out));
      hot_in_obj.setSeconds(0, 0);
      hot_out_obj.setSeconds(0, 0);
      hot_in_obj = formatDateForSQL(hot_in_obj);
      hot_out_obj = formatDateForSQL(hot_out_obj);
    }

    let remind_at;
    if (is_remind === 1 && remind_tenure) {
      remind_at = from_date - remind_tenure * 1000;
      remind_at = new Date(remind_at);
      remind_at.setSeconds(0, 0);
      remind_at = formatDateForSQL(remind_at);
    }

    let nxt_snooze_at;
    if (is_remind === 1 && remind_tenure && snooze_at) {
      remind_at = from_date - remind_tenure * 1000;
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

    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Travel Added Successfully", [], "");
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
    let { user_id, id } = validatedData?.value;

    const result = await travelMdl.deleteTravel({ user_id, id });

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
      user_id,
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

    if (media_id) {
      const allowfive = media_id.split(",");
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
    if (from_date && is_remind === 0) {
      from_date_obj = new Date(Number(from_date));
      from_date_obj.setSeconds(0, 0);
      from_date_obj = formatDateForSQL(from_date_obj);
      upt_cols.push(
        "from_date = ?, is_remind = ?, remind_tenure = ?, remind_at = ?, snooze_at = ?, nxt_snooze_at = ?",
      );
      params.push(from_date_obj, is_remind, null, null, null, null);
    }
    if (from_date && is_remind === 1 && remind_tenure) {
      remind_at = Number(from_date) - remind_tenure * 1000;

      from_date_obj = new Date(Number(from_date));
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
    if (from_date && is_remind === 1 && remind_tenure && snooze_at) {
      remind_at = Number(from_date) - remind_tenure * 1000;
      nxt_snooze_at = remind_at + snooze_at * 1000;

      from_date_obj = new Date(Number(from_date));
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
    if (to_date) {
      to_date = new Date(Number(to_date));
      to_date.setSeconds(0, 0);
      to_date = formatDateForSQL(to_date);
      upt_cols.push("to_date = ?");
      params.push(to_date);
    }
    if (vech_mode) {
      upt_cols.push("vech_mode = ?");
      params.push(vech_mode);
    }
    if (media_id) {
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
      hot_in = new Date(Number(hot_in));
      hot_out = new Date(Number(hot_out));
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

    params.push(user_id, id);

    const result = await travelMdl.updateTravel({ upt_cols, params });
    if (result?.success === 1) {
      return sendResponse(res, 200, 1, "Travel Updated successfully", [], "");
    } else if (result?.success === 0) {
      return sendResponse(res, 2000, 0, "Failed to update Travel", [], "");
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

    let { user_id, status } = validatedData?.value;
    let result;
    let travels;

    if (user_id) {
      result = await travelMdl.getTravel({ user_id });
    }
    if (result?.success === 0) {
      return sendResponse(res, 200, 0, "failed to fetch travels", [], "");
    } else if (result?.success === 1) {
      travels = result?.data;
      // console.log(appointments);

      // console.log(travels);

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

      const response = replaceNullWithEmptyString(travelwithdp);
      const date_cols = [
        "from_date",
        "to_date",
        "hot_in",
        "hot_out",
        "remind_at",
        "nxt_snooze_at",
        "departure",
      ];
      const finalResponse = dateToMillis(response, date_cols);
      return sendResponse(
        res,
        200,
        1,
        "Travels fetched successfully",
        finalResponse,
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

    departure = Number(departure);
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

    let { id, user_id, travel_id, from, to, departure, vech_mode, media_id } =
      validatedData?.value;

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
      departure = Number(departure);
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
    if (media_id) {
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

    let { user_id, travel_id, category, notes, exp_date, amount } =
      validatedData?.value;

    exp_date = Number(exp_date);
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

    let { id, user_id, travel_id } = validatedData?.value;

    const result = await travelMdl.deleteExpense({ id, user_id, travel_id });
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

    let { id, user_id, travel_id, category, notes, exp_date, amount } =
      validatedData?.value;

    let upt_cols = [];
    let params = [];

    if (category) {
      upt_cols.push("category = ?");
      params.push(category);
    }
    if (notes) {
      upt_cols.push("notes = ?");
      params.push(notes);
    }
    if (exp_date) {
      exp_date = Number(exp_date);
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

    let { id, user_id, travel_id } = validatedData?.value;

    const result = await travelMdl.getExpense({ id, user_id, travel_id });

    const response = replaceNullWithEmptyString(result?.data);
    const date_cols = ["exp_date"];
    const finalResponse = dateToMillis(response, date_cols);

    // console.log(result?.data);
    if (result?.success === 1) {
      return sendResponse(
        res,
        200,
        1,
        "Travel expense fetched successfully",
        finalResponse,
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

    let { id } = validatedData?.value;
    const result = await travelMdl.getNotes({ id });
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
    let upt_cols = [];
    let params = [];

    if (title) {
      upt_cols.push("title = ?");
      params.push(title);
    }
    if (descp) {
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

    const result = await travelMdl.updateTravelPhotos({ travel_id, media_id });

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
        let media_result;
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

// export const deleteTravelPhotos = async (req, res) => {
//   try {
//     const validatedData = validateRequest(req.body, deleteTravelPhotosSchema);

//     if (validatedData?.success === 0) {
//       return sendResponse(
//         res,
//         validatedData?.errorObject?.status,
//         0,
//         "validation Error",
//         [],
//         validatedData?.errorObject?.errors,
//       );
//     }

//     let { id } = validatedData?.value;

//     // need to get media by media and delete physically

//     const result = await travelMdl.deleteTravelPhotos({ id });

//     if (result?.success === 1) {
//       return sendResponse(
//         res,
//         200,
//         1,
//         "Travel photos deleted successfully",
//         [],
//         "",
//       );
//     } else if (result?.success === 0) {
//       return sendResponse(
//         res,
//         200,
//         0,
//         "Failed to delete travel photos",
//         [],
//         "",
//       );
//     }
//   } catch (error) {
//     return sendResponse(
//       res,
//       500,
//       0,
//       "Internal server error",
//       [],
//       error.message,
//     );
//   }
// };

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

    const result = await travelMdl.updateTravelDocs({ travel_id, media_id });

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
        let media_result;
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
// export const deleteTravelDocs = async (req, res) =>{
//   try {
    
//   } catch (error) {
//     return sendResponse(res, 500, 0, "Internal server error", [], error.message);
//   }
// }

// need to ask kamalesh bro about deleting media ????
