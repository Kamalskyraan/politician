import { executeQuery, sendResponse } from "../utils/helper.js";

export class travelModel {
  async addTravel({
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
  }) {
    let query = `INSERT INTO travels (user_id, title, descp, purpose, travel_from, from_lat, from_lng, travel_to, to_lat, to_lng, from_date, to_date, vech_mode, media_id, in_hotel, hot_name, hot_address, hot_lat, hot_lng, hot_in, hot_out, hot_media, is_remind, remind_tenure, remind_at, snooze_at, nxt_snooze_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    let params = [
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
      media_id || null,
      in_hotel,
      hot_name || null,
      hot_address || null,
      hot_lat || null,
      hot_lng || null,
      hot_in_obj || null,
      hot_out_obj || null,
      hot_media || null,
      is_remind,
      remind_tenure || null,
      remind_at || null,
      snooze_at || null,
      nxt_snooze_at || null,
    ];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async deleteTravel({ user_id, id }) {
    let query = `DELETE FROM travels WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async updateTravel({ upt_cols, params }) {
    let query = `UPDATE travels SET ${upt_cols.join(", ")} WHERE id = ? `;
    // console.log(params);
    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async getTravel(upt_cols, params) {
    let query = `SELECT id,
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
      remind_at,
      snooze_at,
      nxt_snooze_at FROM travels WHERE ${upt_cols.join("")} ORDER BY from_date ASC`;

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async addDailyplan({ travel_id, from, to, departure, vech_mode, media_id }) {
    let query = `INSERT INTO travel_daily_plan (travel_id, plan_from, plan_to, departure, vech_mode, media_id) VALUES (?, ?, ?, ?, ?, ?)`;
    let params = [travel_id, from, to, departure, vech_mode, media_id];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async updateDailyplan({ upt_cols, params }) {
    let query = `UPDATE travel_daily_plan SET ${upt_cols.join(", ")} WHERE id = ?`;

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async deleteDailyplan({ id }) {
    let query = `DELETE FROM travel_daily_plan WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async getDailyplan({ id }) {
    let query = `SELECT id, user_id, travel_id, plan_from, plan_to, departure, vech_mode, media_id FROM travel_daily_plan WHERE travel_id = ? ORDER BY departure ASC`;
    let params = [id];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0);
    return {
      success: 0,
      error: result?.error,
    };
  }
  async getTravelExpenseCategory(cat_id) {
    let query;
    let params = [];

    if (cat_id != null) {
      // handles both undefined and null
      query = `
    SELECT id, category_name
    FROM travel_exp_category
    WHERE id = ?`;
      params = [cat_id];
    } else {
      query = `
    SELECT id, category_name
    FROM travel_exp_category`;
    }

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result.data,
      };
    }

    return {
      success: 0,
      error: result?.error,
    };
  }

  async addExpense({ travel_id, cat_id, cat_name, notes, exp_date, amount }) {
    let query = `INSERT INTO travel_exp (travel_id, cat_id, cat_name, notes, exp_date, amount) VALUES (?, ?, ?, ?, ?, ?)`;

    let params = [travel_id, cat_id, cat_name, notes || null, exp_date, amount];

    // console.log(params);
    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async deleteExpense({ id, user_id, travel_id }) {
    let query = `DELETE FROM travel_exp WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async updateExpense({ upt_cols, params }) {
    let query = `UPDATE travel_exp SET ${upt_cols.join(", ")} WHERE id = ?`;

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async getExpense({ travel_id }) {
    let query = `SELECT
    te.id,
    te.travel_id,
    te.cat_id,
    CASE
        WHEN te.cat_id = 0 THEN te.cat_name
        ELSE ec.category_name
    END AS cat_name,
    te.notes,
    te.exp_date,
    te.amount
FROM travel_exp te
LEFT JOIN travel_exp_category ec
    ON te.cat_id = ec.id
WHERE te.travel_id = ?;`;
    let params = [travel_id];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async addNotes({ user_id, travel_id, title, descp }) {
    let query = `INSERT INTO travel_notes (travel_id, title, descp) VALUES (?, ?, ?)`;
    let params = [travel_id, title, descp];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async getNotes({ travel_id }) {
    let query = `SELECT id, travel_id, title, descp, updated_at AS time_at FROM travel_notes WHERE travel_id = ?`;
    let params = [travel_id];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async updateNotes({ upt_cols, params }) {
    let query = `UPDATE travel_notes SET ${upt_cols.join(", ")} WHERE id = ?`;

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async deleteNotes({ id }) {
    let query = `DELETE FROM travel_notes WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async addTravelPhotos({ user_id, travel_id, media_id }) {
    let query = `INSERT INTO travel_photos (travel_id, media_id) VALUES (?, ?)`;
    let params = [travel_id, media_id];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async updateTravelPhotos({ travel_id, media_id }) {
    let query = `UPDATE travel_photos SET media_id = ? WHERE travel_id = ?`;
    let params = [media_id, travel_id];
    // console.log(params);

    const result = await executeQuery(query, params);
    // console.log(result?.data.affectedRows);
    if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    } else if (result?.data?.affectedRows === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    } else if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    }
  }
  async deleteTravelPhotos({ id }) {
    let query = `DELETE from travel_photos WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async getTravelPhotos({ travel_id }) {
    let query = `SELECT id, travel_id, media_id FROM travel_photos WHERE travel_id = ?`;
    let params = [travel_id];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async addTravelDocs({ user_id, travel_id, media_id }) {
    let query = `INSERT INTO travel_docs (user_id, travel_id, media_id) VALUES (?, ?, ?)`;
    let params = [user_id, travel_id, media_id];

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async updateTravelDocs({ travel_id, fetch_media_id }) {
    let query = `UPDATE travel_docs SET media_id = ? WHERE travel_id = ?`;
    let params = [fetch_media_id, travel_id];

    const result = await executeQuery(query, params);
    // console.log(result?.data.affectedRows);
    if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    } else if (result?.data?.affectedRows === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    } else if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    }
  }
  async getTravelDocs({ travel_id }) {
    let query = `SELECT id, travel_id, media_id FROM travel_docs WHERE travel_id = ?`;
    let params = [travel_id];

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
}
