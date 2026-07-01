import express from "express";
import { executeQuery } from "../utils/helper.js";

export class calendarModel {
  async getCalendarInfo({ user_id, from_date, to_date }) {
    let query = `SELECT id, title, "meeting" AS type, from_date, to_date FROM meeting 
    WHERE user_id = ? AND from_date <= ? AND to_date >= ? UNION ALL 
    SELECT id, title, "appointment" AS type, from_date, to_date FROM appointments 
    WHERE user_id = ? AND from_date <= ? AND to_date >= ? UNION ALL
    SELECT id, title, "task" AS type, from_date, to_date FROM tasks 
    WHERE user_id = ? AND from_date <= ? AND to_date >= ? ORDER BY from_date ASC`;
    let params = [
      user_id,
      to_date,
      from_date,
      user_id,
      to_date,
      from_date,
      user_id,
      to_date,
      from_date,
    ];
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
        data: result?.error,
      };
    }
  }
  async getEvent({ user_id, event_date, page, limit = 10 }) {
    const offset = (page - 1) * limit;
    let query = `SELECT
    id,
    title,
    descp,
    m_type AS type,
    m_priority AS priority,
    m_link,
    notes,
    address,
    lat,
    lng,
    status,
    media_id,
    attnds_id,
    NULL AS con_name,
    NULL AS con_desg,
    from_date,
    to_date,
    is_remind,
    remind_status,
    remind_tenure,
    remind_at,
    snooze_at,
    nxt_snooze_at,
    'meeting' AS module_type
FROM meeting
WHERE user_id = ?
AND DATE(from_date) <= ?
AND DATE(to_date) >= ?

UNION ALL

SELECT
    id,
    title,
    NULL AS descp,
    a_type AS type,
    NULL AS priority,
    NULL AS m_link,
    notes,
    address,
    lat,
    lng,
    status,
    media_id,
    NULL AS attnds_id,
    con_name,
    con_desg,
    from_date,
    to_date,
    is_remind,
    remind_status,
    remind_tenure,
    remind_at,
    snooze_at,
    nxt_snooze_at,
    'appointment' AS module_type
FROM appointments
WHERE user_id = ?
AND DATE(from_date) <= ?
AND DATE(to_date) >= ?

UNION ALL

SELECT
    id,
    title,
    descp,
    NULL AS type,
    t_priority AS priority,
    NULL AS m_link,
    NULL AS notes,
    NULL AS address,
    NULL AS lat,
    NULL AS lng,
    t_status AS status,
    media_id,
    attnds_id,
    NULL AS con_name,
    NULL AS con_desg,
    from_date,
    to_date,
    is_remind,
    remind_status,
    remind_tenure,
    remind_at,
    snooze_at,
    nxt_snooze_at,
    'task' AS module_type
FROM tasks
WHERE user_id = ?
AND DATE(from_date) <= ?
AND DATE(to_date) >= ?

ORDER BY from_date ASC LIMIT ? OFFSET ?;`;

    const countQuery = `SELECT COUNT(*) AS total
FROM (
    SELECT id
    FROM meeting
    WHERE user_id = ?
      AND DATE(from_date) <= ?
      AND DATE(to_date) >= ?

    UNION ALL

    SELECT id
    FROM appointments
    WHERE user_id = ?
      AND DATE(from_date) <= ?
      AND DATE(to_date) >= ?

    UNION ALL

    SELECT id
    FROM tasks
    WHERE user_id = ?
      AND DATE(from_date) <= ?
      AND DATE(to_date) >= ?
) AS combined`;
    let params = [
      user_id,
      event_date,
      event_date,
      user_id,
      event_date,
      event_date,
      user_id,
      event_date,
      event_date,
    ];
    const countResult = await executeQuery(countQuery, params);
    const total = countResult?.data[0]?.total;
    // console.log(total);

    params.push(limit, offset);
    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          total_pages: Number(Math.ceil(total / limit)),
        },
      };
    } else if (result?.success === 0) {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }
  async getTodayEventsCounts(user_id) {
    let query = `SELECT 'meeting' AS type, COUNT(*) AS total FROM meeting WHERE user_id = ? AND DATE(from_date) <= CURDATE() AND DATE(to_date) >= CURDATE()
    UNION ALL
    SELECT 'appointment' AS type, COUNT(*) AS total FROM appointments WHERE user_id = ? AND DATE(from_date) <= CURDATE() AND DATE(to_date) >= CURDATE()
    UNION ALL
    SELECT 'task' AS type, COUNT(*) AS total FROM tasks WHERE user_id = ? AND DATE(from_date) <= CURDATE() AND DATE(to_date) >= CURDATE()`;
    let params = [user_id, user_id, user_id];

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
