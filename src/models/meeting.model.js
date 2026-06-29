import express from "express";
import { executeQuery, sendResponse } from "../utils/helper.js";

export class meetingModel {
  async addMember({
    user_id,
    name,
    phn_num,
    role_id,
    country,
    state,
    district,
  }) {
    // let query = `INSERT INTO members (user_id, name, phn_num, role_id, district) VALUES (?, ?, ?, ?, ?)`;
    // let params = [user_id, name, phn_num, role_id, district];

    let query = `SELECT * FROM members WHERE user_id = ? AND phn_num = ? AND status = ?`;
    let params = [user_id, phn_num, "active"];

    const result = await executeQuery(query, params);
    // console.log("is member present", result?.data.length > 1);

    if (result?.data.length >= 1) {
      return {
        success: 0,
        error: "Entered person was already registered",
      };
    } else {
      query = `INSERT INTO members (user_id, name, phn_num, role_id, country, state, district) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      params = [user_id, name, phn_num, role_id, country, state, district];

      const result = await executeQuery(query, params);
      if (result?.success === 1) {
        return {
          success: 1,
          data: result?.data,
        };
      } else {
        return {
          success: 0,
          error: result?.error,
        };
      }
    }
  }

  async getMember({ upt_cols, params }) {
    // console.log(upt_cols);
    // console.log(params);
    let query = `SELECT m.id, m.name, m.phn_num, m.country, m.state, m.district, m.role_id, r.role_name FROM members m JOIN user_role r ON m.role_id = r.id WHERE ${upt_cols.join(" AND ")}`;
    // let params = [user_id, "active"];

    // console.log(query)
    const result = await executeQuery(query, params);

    // console.log(result);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else {
      return {
        success: 0,
        data: result?.error,
      };
    }
  }

  async updateMember({ id, name, phn_num, role_id, country, state, district }) {
    let query = `SELECT * FROM members WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);
    // console.log(result?.data);
    if (result?.data.length === 0) {
      return {
        success: 0,
        error: "invalid id",
      };
    } else {
      query = `UPDATE members SET name = ?, phn_num = ?, role_id = ?, country = ?, state = ?, district = ? WHERE id = ?`;
      params = [name, phn_num, role_id, country, state, district, id];

      const updateResult = await executeQuery(query, params);

      if (updateResult?.success === 1) {
        return {
          success: 1,
          data: updateResult?.data,
        };
      } else {
        return {
          success: 0,
          error: updateResult?.error,
        };
      }
    }
  }

  async deleteMember({ id }) {
    let query = `SELECT * FROM members WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);
    if (result?.data.length === 0) {
      return {
        success: 0,
        error: "There is no member in your member list",
      };
    } else {
      query = `UPDATE members SET status = ? WHERE id = ?`;
      params = ["inactive", id];

      const deleteResult = await executeQuery(query, params);
      if (deleteResult?.success === 1) {
        return {
          success: 1,
          data: deleteResult?.data,
        };
      } else {
        return {
          success: o,
          error: deleteResult?.error,
        };
      }
    }
  }

  async getattnds(attendee_id) {
    let placeHolders = attendee_id.map(() => "?").join(", ");

    let query = `SELECT id, name, phn_num, role_id, country, state, district FROM members WHERE id IN (${placeHolders})`;
    let params = attendee_id;

    const result = await executeQuery(query, params);
    // console.log("attendees list", result?.error);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async getRole(id) {
    let query = `SELECT role_name FROM user_role WHERE id = ?`;
    let params = [id];
    const result = await executeQuery(query, params);
    if (result?.success === 1 && result?.data.length >= 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    } else {
      return {
        success: 0,
        error: "no role found for this id, Role might be deleted",
      };
    }
  }

  async addMeeting({
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
  }) {
    let query = `INSERT INTO meeting (user_id, title, descp, m_type, m_priority, m_link, notes, address, lat, lng, status, media_id, attnds_id, from_date, to_date, is_remind, remind_tenure, remind_at, snooze_at, nxt_snooze_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let params = [
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
      remind_tenure ?? null,
      remind_at ?? null,
      snooze_at ?? null,
      nxt_snooze_at ?? null,
    ];

    const result = await executeQuery(query, params);

    // console.log(result);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else {
      return {
        success: 1,
        error: result?.error,
      };
    }
  }

  async getMeeting({ user_id, status, from_date, to_date, page, limit = 10 }) {
    const offset = (page - 1) * limit;
    let query = `
    SELECT
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
      status,
      media_id,
      attnds_id,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      remind_at,
      snooze_at,
      nxt_snooze_at
    FROM meeting
    WHERE user_id = ?`;

    let countQuery = `SELECT COUNT(*) AS total FROM meeting WHERE user_id = ?`;

    let params = [user_id];
    let countParams = [user_id];
    // console.log(status)

    if (status != null) {
      const placeholders = status.map(() => "?").join(",");
      query += ` AND status IN (${placeholders})`;
      countQuery += ` AND status IN (${placeholders})`;
      params.push(...status);
      countParams.push(...status);
    }

    if (from_date != null) {
      query += ` AND from_date <= ?`;
      countQuery += ` AND from_date <= ?`;
      params.push(`${to_date} 23:59:59`);
      countParams.push(`${to_date} 23:59:59`);
    }

    if (to_date != null) {
      query += ` AND to_date >= ?`;
      countQuery += ` AND to_date >= ?`;
      countParams.push(`${from_date} 00:00:00`);
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult?.data[0]?.total;
    // console.log(total);

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const result = await executeQuery(query, params);
    // console.log(result);

    if (result?.success === 1 && result?.data?.length > 0) {
      return {
        success: 1,
        data: result.data,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          total_pages: Math.ceil(total / limit),
        },
      };
    }

    return {
      success: 0,
      error: "no meeting found for this user",
    };
  }

  async deleteMeeting({ id }) {
    let query = ``;
    let params = [];

    query = `DELETE FROM meeting WHERE id = ?`;
    params = [id];

    const result = await executeQuery(query, params);

    // console.log(result?.data?.affectedRows);

    if (result?.data?.affectedRows === 1) {
      return {
        success: 1,
        data: result?.data,
      };
    } else {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async updateMeeting(update_columns, params) {
    let query = `UPDATE meeting SET ${update_columns.join(", ")} WHERE id = ?`;

    // console.log(params);
    const result = await executeQuery(query, params);

    if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    } else {
      return {
        success: 1,
        data: result?.data,
      };
    }
  }

  async addappointment({
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
  }) {
    let query = `INSERT INTO appointments (user_id, title, a_type, notes, address, lat, lng, status, media_id, con_name, con_desg, from_date, to_date, is_remind, remind_tenure, remind_at, snooze_at, nxt_snooze_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let params = [
      user_id,
      title,
      a_type,
      notes || null,
      address,
      lat,
      lng,
      status,
      media_id || null,
      con_name,
      con_desg,
      from_date_obj,
      to_date_obj,
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

  async deleteAppoint({ id }) {
    let query = `DELETE FROM appointments WHERE id = ?`;
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

  async getAppoint(upt_cols, params, page, limit = 10) {
    const offset = (page - 1) * limit;
    let query;
    // let params;
    // if (status) {
    //   query = `SELECT id, title, a_type, notes, address, lat, lng, media_id, con_name, con_desg, status, from_date, to_date, is_remind, remind_status, remind_tenure, remind_at, snooze_at, nxt_snooze_at FROM appointments WHERE user_id = ? AND status = ?`;
    //   params = [user_id, status];
    // } else {
    //   query = `SELECT id, title, a_type, notes, address, lat, lng, media_id, con_name, con_desg, status, from_date, to_date, is_remind, remind_status, remind_tenure, remind_at, snooze_at, nxt_snooze_at FROM appointments WHERE user_id = ?`;
    //   params = [user_id];
    // }

    query = `SELECT id, title, a_type, notes, address, lat, lng, media_id, con_name, con_desg, status, from_date, to_date, is_remind, remind_status, remind_tenure, remind_at, snooze_at, nxt_snooze_at FROM appointments WHERE ${upt_cols.join("")} LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) AS total FROM appointments WHERE ${upt_cols.join("")}`;
    const countResult = await executeQuery(countQuery, params);
    const total = countResult?.data[0]?.total;
    params.push(page, offset);

    const result = await executeQuery(query, params);
    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          total_pages: Math.ceil(total / limit),
        },
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async updateAppointment({ upt_cols, params }) {
    let query = `UPDATE appointments SET ${upt_cols.join(", ")} WHERE id = ?`;

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

  async getMeetingInfo(id) {
    let query = `SELECT from_date, user_id FROM meeting WHERE id = ?`;
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
  async getAppointmentInfo(id) {
    let query = `SELECT from_date, user_id FROM appointments WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);
    // console.log(result);
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

  async getTodayMeetings(today) {
    let query = `SELECT id, user_id FROM meeting WHERE DATE(from_date) = ?`;
    let params = [today];

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
  async getTodayAppointments(today) {
    let query = `SELECT id, user_id FROM appointments WHERE DATE(from_date) = ?`;
    let params = [today];

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

  async getOverdueMeetings(today) {
    let query = `SELECT id, user_id FROM meeting WHERE DATE(to_date) < ? AND status = ?`;
    let params = [today, "pending"];

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

  async getOverdueAppointments(today) {
    let query = `SELECT id, user_id FROM appointments WHERE DATE(to_date) < ? AND status = ?`;
    let params = [today, "pending"];

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
