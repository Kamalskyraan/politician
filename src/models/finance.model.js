import pool from "../config/db.js";
import { replaceNullWithEmptyString } from "../utils/helper.js";
import { sourceModel } from "./source.model.js";

const srcMdl = new sourceModel();
export class financeModel {
  async addFinanceData({
    id,
    user_id,
    type,
    cat_id,
    cat_name,
    trans_date,
    amount,
    notes,
    attachment,
  }) {
    if (id) {
      const [result] = await pool.query(
        `
        UPDATE finance
        SET
        user_id = ?,
          type = ?,
          category_id = ?,
          category_name = ?,
          trans_date = ?,
          amount = ?,
          notes = ?,
          attachment = ?
        WHERE id = ?
        `,
        [
          user_id,
          type,
          cat_id,
          cat_name,
          trans_date,
          amount,
          notes,
          attachment,
          id,
        ],
      );

      return {
        action: "updated",
        id,
      };
    }

    const [result] = await pool.query(
      `
      INSERT INTO finance (
      user_id,
        type,
        category_id,
        category_name,
        trans_date,
        amount,
        notes,
        attachment
      )
      VALUES (?, ?, ?, ?, ?, ?, ? , ?)
      `,
      [user_id, type, cat_id, cat_name, trans_date, amount, notes, attachment],
    );

    return {
      action: "created",
      id: result.insertId,
    };
  }

  // async fetchFinanceData({
  //   id,
  //   type,
  //   user_id,
  //   category,
  //   amount,
  //   from_date,
  //   to_date,
  //   page = 1,
  //   limit = 10,
  // }) {
  //   let query = `
  //   SELECT
  //   f.id,
  //   f.type,
  //   f.user_id,
  //  COALESCE(f.category_id, '0') AS category_id,
  //   f.category_name,
  //  COALESCE(fc.cat_img, 0) AS cat_img,
  //   fc.cat_name,
  //   f.trans_date,
  //   f.amount,
  //   f.notes,
  //   f.attachment as attachment_ids

  //     FROM finance f
  //    LEFT JOIN finance_category fc
  //   ON f.category_id = fc.id
  //   WHERE 1 = 1
  // `;

  //   const params = [];

  //   if (id) {
  //     query += ` AND f.id = ?`;
  //     params.push(id);
  //   }

  //   if (type) {
  //     query += ` AND f.type = ?`;
  //     params.push(type);
  //   }

  //   if (user_id) {
  //     query += ` AND f.user_id = ?`;
  //     params.push(user_id);
  //   }

  //   //   if (category) {
  //   //     query += `
  //   //   AND (
  //   //     f.category_name LIKE ?
  //   //     OR fc.cat_name LIKE ?
  //   //     OR f.amount LIKE ?
  //   //   )
  //   // `;

  //   //     params.push(`%${category}%`, `%${category}%`);
  //   //   }

  //   if (amount) {
  //     query += ` AND f.amount LIKE ?`;
  //     params.push(`%${amount}%`);
  //   }

  //   if (category) {
  //     query += `
  //   AND (
  //     f.category_name LIKE ?
  //     OR fc.cat_name LIKE ?
  //     OR CAST(f.amount AS CHAR) LIKE ?
  //   )
  // `;

  //     const searchValue = `%${category}%`;

  //     params.push(searchValue, searchValue, searchValue);
  //   }

  //   if (from_date && to_date) {
  //     query += ` AND DATE(f.trans_date) BETWEEN ? AND ?`;
  //     params.push(from_date, to_date);
  //   } else if (from_date) {
  //     query += ` AND DATE(f.trans_date) >= ?`;
  //     params.push(from_date);
  //   } else if (to_date) {
  //     query += ` AND DATE(f.trans_date) <= ?`;
  //     params.push(to_date);
  //   }

  //   query += ` ORDER BY f.trans_date DESC`;

  //   const [rows] = await pool.query(query, params);

  //   for (const row of rows) {
  //     if (row.cat_img) {
  //       const catIconIds = String(row.cat_img)
  //         .split(",")
  //         .map((id) => Number(id.trim()))
  //         .filter(Boolean);

  //       const catMedia = await srcMdl.getMedia(catIconIds);

  //       row.cat_icon = catMedia?.success ? catMedia.data : [];
  //     } else {
  //       row.cat_icon = [];
  //     }
  //     if (row.attachment_ids) {
  //       const attachmentIds = row.attachment_ids
  //         .split(",")
  //         .map((id) => Number(id.trim()))
  //         .filter(Boolean);

  //       const media = await srcMdl.getMedia(attachmentIds);

  //       row.attachment = media?.success ? media.data : [];
  //     } else {
  //       row.attachment = [];
  //     }
  //   }
  //   const income_total = rows
  //     .filter((row) => row.type === "income")
  //     .reduce((sum, row) => sum + Number(row.amount || 0), 0);

  //   const expense_total = rows
  //     .filter((row) => row.type === "expense")
  //     .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  //   return {
  //     income_total,
  //     expense_total,
  //     balance: income_total - expense_total,
  //     data: replaceNullWithEmptyString(rows),
  //   };
  // }

  // async fetchFinanceData({
  //   id,
  //   type,
  //   user_id,
  //   category,
  //   amount,
  //   from_date,
  //   to_date,
  //   page = 1,
  //   limit = 10,
  // }) {
  //   const offset = (page - 1) * limit;

  //   let whereClause = ` WHERE 1 = 1 `;
  //   const params = [];

  //   if (id) {
  //     whereClause += ` AND f.id = ?`;
  //     params.push(id);
  //   }

  //   if (type) {
  //     whereClause += ` AND f.type = ?`;
  //     params.push(type);
  //   }

  //   if (user_id) {
  //     whereClause += ` AND f.user_id = ?`;
  //     params.push(user_id);
  //   }

  //   if (amount) {
  //     whereClause += ` AND f.amount LIKE ?`;
  //     params.push(`%${amount}%`);
  //   }

  //   if (category) {
  //     whereClause += `
  //     AND (
  //       f.category_name LIKE ?
  //       OR fc.cat_name LIKE ?
  //       OR CAST(f.amount AS CHAR) LIKE ?
  //     )
  //   `;

  //     const searchValue = `%${category}%`;
  //     params.push(searchValue, searchValue, searchValue);
  //   }

  //   if (from_date && to_date) {
  //     whereClause += ` AND DATE(f.trans_date) BETWEEN ? AND ?`;
  //     params.push(from_date, to_date);
  //   } else if (from_date) {
  //     whereClause += ` AND DATE(f.trans_date) >= ?`;
  //     params.push(from_date);
  //   } else if (to_date) {
  //     whereClause += ` AND DATE(f.trans_date) <= ?`;
  //     params.push(to_date);
  //   }

  //   // Total Records Count
  //   const [[{ total }]] = await pool.query(
  //     `
  //     SELECT COUNT(*) AS total
  //     FROM finance f
  //     LEFT JOIN finance_category fc ON f.category_id = fc.id
  //     ${whereClause}
  //   `,
  //     params,
  //   );

  //   // Income / Expense Summary
  //   const [summaryRows] = await pool.query(
  //     `
  //     SELECT
  //       type,
  //       SUM(amount) AS total_amount
  //     FROM finance f
  //     LEFT JOIN finance_category fc ON f.category_id = fc.id
  //     ${whereClause}
  //     GROUP BY type
  //   `,
  //     params,
  //   );

  //   let income_total = 0;
  //   let expense_total = 0;

  //   summaryRows.forEach((row) => {
  //     if (row.type === "income") {
  //       income_total = Number(row.total_amount || 0);
  //     }

  //     if (row.type === "expense") {
  //       expense_total = Number(row.total_amount || 0);
  //     }
  //   });

  //   // Paginated Data
  //   const query = `
  //   SELECT
  //     f.id,
  //     f.type,
  //     f.user_id,
  //     COALESCE(f.category_id, '0') AS category_id,
  //     f.category_name,
  //     COALESCE(fc.cat_img, 0) AS cat_img,
  //     fc.cat_name,
  //     f.trans_date,
  //     f.amount,
  //     f.notes,
  //     f.attachment AS attachment_ids
  //   FROM finance f
  //   LEFT JOIN finance_category fc
  //     ON f.category_id = fc.id
  //   ${whereClause}
  //   ORDER BY f.trans_date DESC
  //   LIMIT ? OFFSET ?
  // `;

  //   const [rows] = await pool.query(query, [
  //     ...params,
  //     Number(limit),
  //     Number(offset),
  //   ]);

  //   for (const row of rows) {
  //     if (row.cat_img) {
  //       const catIconIds = String(row.cat_img)
  //         .split(",")
  //         .map((id) => Number(id.trim()))
  //         .filter(Boolean);

  //       const catMedia = await srcMdl.getMedia(catIconIds);
  //       row.cat_icon = catMedia?.success ? catMedia.data : [];
  //     } else {
  //       row.cat_icon = [];
  //     }

  //     if (row.attachment_ids) {
  //       const attachmentIds = String(row.attachment_ids)
  //         .split(",")
  //         .map((id) => Number(id.trim()))
  //         .filter(Boolean);

  //       const media = await srcMdl.getMedia(attachmentIds);
  //       row.attachment = media?.success ? media.data : [];
  //     } else {
  //       row.attachment = [];
  //     }
  //   }

  //   return {
  //     income_total,
  //     expense_total,
  //     balance: income_total - expense_total,
  //     data: replaceNullWithEmptyString(rows),
  //     pagination: {
  //       total,
  //       page: Number(page),
  //       limit: Number(limit),
  //       total_pages: Math.ceil(total / limit),
  //     },
  //   };
  // }

  async removeFinData(id) {
    const [result] = await pool.query(`DELETE FROM finance WHERE id =?`, [id]);
  }

  async fetchReportData({
    type,
    user_id,
    from_date,
    to_date,
    page = 1,
    limit = 10,
  }) {
    const offset = (page - 1) * limit;

    let whereClause = `WHERE 1 = 1`;
    const params = [];

    if (user_id) {
      whereClause += ` AND f.user_id = ?`;
      params.push(user_id);
    }

    if (from_date && to_date) {
      whereClause += ` AND DATE(f.trans_date) BETWEEN ? AND ?`;
      params.push(from_date, to_date);
    } else if (from_date) {
      whereClause += ` AND DATE(f.trans_date) >= ?`;
      params.push(from_date);
    } else if (to_date) {
      whereClause += ` AND DATE(f.trans_date) <= ?`;
      params.push(to_date);
    }

    // User Details
    let user = {};

    if (user_id) {
      const [userRows] = await pool.query(
        `
      SELECT
        id,
        user_id,
        name,
        c_code,
        phn_num
      FROM users
      WHERE user_id = ?
      `,
        [user_id],
      );

      if (userRows.length) {
        user = userRows[0];
      }
    }

    const [[{ total }]] = await pool.query(
      `
    SELECT COUNT(*) AS total
    FROM finance f
    LEFT JOIN finance_category fc
      ON fc.id = f.category_id
    ${whereClause}
    `,
      params,
    );

    const [allRows] = await pool.query(
      `
    SELECT
      f.id,
      f.type,
      f.user_id,
      COALESCE(f.category_id,0) AS category_id,
      COALESCE(f.category_name,'') AS category_name,
      COALESCE(fc.cat_name,'') AS cat_name,
      COALESCE(fc.cat_img,0) AS cat_img,
      f.trans_date,
      f.amount,
      f.notes,
      f.attachment AS attachment_ids
    FROM finance f
    LEFT JOIN finance_category fc
      ON fc.id = f.category_id
    ${whereClause}
    ORDER BY f.trans_date DESC
    `,
      params,
    );

    // Category Icons
    for (const row of allRows) {
      if (row.cat_img) {
        const media = await srcMdl.getMedia([Number(row.cat_img)]);
        row.cat_icon = media?.success ? media.data[0] : {};
      } else {
        row.cat_icon = {};
      }
    }

    // Summary
    const income_total = allRows
      .filter((x) => x.type === "income")
      .reduce((a, b) => a + Number(b.amount), 0);

    const expense_total = allRows
      .filter((x) => x.type === "expense")
      .reduce((a, b) => a + Number(b.amount), 0);

    // Chart
    const chartRows = type ? allRows.filter((x) => x.type === type) : allRows;

    const chartMap = {};

    chartRows.forEach((row) => {
      if (!chartMap[row.category_id]) {
        chartMap[row.category_id] = {
          category_id: row.category_id,
          category_name: row.category_name || row.cat_name,
          category_icon: row.cat_icon,
          total_amount: 0,
        };
      }

      chartMap[row.category_id].total_amount += Number(row.amount);
    });

    // Paginated rows
    const [rows] = await pool.query(
      `
    SELECT
      f.id,
      f.type,
      f.user_id,
      COALESCE(f.category_id,0) AS category_id,
      COALESCE(f.category_name,'') AS category_name,
      COALESCE(fc.cat_name,'') AS cat_name,
      COALESCE(fc.cat_img,0) AS cat_img,
      f.trans_date,
      f.amount,
      f.notes,
      f.attachment AS attachment_ids
    FROM finance f
    LEFT JOIN finance_category fc
      ON fc.id = f.category_id
    ${whereClause}
    ORDER BY f.trans_date DESC
    LIMIT ? OFFSET ?
    `,
      [...params, Number(limit), Number(offset)],
    );

    for (const row of rows) {
      // Category Icon
      if (row.cat_img) {
        const media = await srcMdl.getMedia([Number(row.cat_img)]);
        row.cat_icon = media?.success ? media.data[0] : {};
      } else {
        row.cat_icon = {};
      }

      // Attachments
      if (row.attachment_ids) {
        const ids = row.attachment_ids.split(",").map(Number).filter(Boolean);

        const media = await srcMdl.getMedia(ids);

        row.attachment = media?.success ? media.data : [];
      } else {
        row.attachment = [];
      }

      delete row.cat_img;
      delete row.attachment_ids;
    }

    return {
      user: {
        id: user?.id ?? "",
        user_id: user?.user_id ?? "",
        user_name: user?.name ?? "",
        c_code: user?.c_code ?? "",
        phn_num: user?.phn_num ?? "",
      },

      summary: {
        income_total,
        expense_total,
        balance: income_total - expense_total,
      },

      chart_data: replaceNullWithEmptyString(Object.values(chartMap)),

      data: replaceNullWithEmptyString(rows),

      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // Fetch Global Finance Data
  async fetchFinanceData({
    id,
    type,
    user_id,
    category,
    amount,
    from_date,
    to_date,
    page = 1,
    limit = 10,
  }) {
    const offset = (page - 1) * limit;

    let whereClause = ` WHERE 1 = 1 `;
    const params = [];

    if (id) {
      whereClause += ` AND f.id = ?`;
      params.push(id);
    }

    if (type) {
      whereClause += ` AND f.type = ?`;
      params.push(type);
    }

    if (user_id) {
      whereClause += ` AND f.user_id = ?`;
      params.push(user_id);
    }

    if (amount) {
      whereClause += ` AND f.amount LIKE ?`;
      params.push(`%${amount}%`);
    }

    if (category) {
      whereClause += `
        AND (
            f.category_name LIKE ?
            OR fc.cat_name LIKE ?
            OR CAST(f.amount AS CHAR) LIKE ?
        )
        `;
      const searchValue = `%${category}%`;
      params.push(searchValue, searchValue, searchValue);
    }

    if (from_date && to_date) {
      whereClause += ` AND DATE(f.trans_date) BETWEEN ? AND ?`;
      params.push(from_date, to_date);
    } else if (from_date) {
      whereClause += ` AND DATE(f.trans_date) >= ?`;
      params.push(from_date);
    } else if (to_date) {
      whereClause += ` AND DATE(f.trans_date) <= ?`;
      params.push(to_date);
    }

    // Total Records Count
    const [[{ total }]] = await pool.query(
      `
        SELECT COUNT(*) AS total
        FROM finance f
        LEFT JOIN finance_category fc ON f.category_id = fc.id
        ${whereClause}
        `,
      params,
    );

    // Income / Expense Summary
    const [summaryRows] = await pool.query(
      `
        SELECT
            type,
            SUM(amount) AS total_amount
        FROM finance f
        LEFT JOIN finance_category fc ON f.category_id = fc.id
        ${whereClause}
        GROUP BY type
        `,
      params,
    );

    let income_total = 0;
    let expense_total = 0;

    summaryRows.forEach((row) => {
      if (row.type === "income") {
        income_total = Number(row.total_amount || 0);
      }
      if (row.type === "expense") {
        expense_total = Number(row.total_amount || 0);
      }
    });

    // Paginated Data
    const query = `
        SELECT
            f.id,
            f.type,
            f.user_id,
            COALESCE(f.category_id, '0') AS category_id,
            f.category_name,
            COALESCE(fc.cat_img, 0) AS cat_img,
            fc.cat_name,
            f.trans_date,
            f.amount,
            f.notes,
            f.attachment AS attachment_ids,
            'global' AS type_label
        FROM finance f
        LEFT JOIN finance_category fc ON f.category_id = fc.id
        ${whereClause}
        ORDER BY f.trans_date DESC
        LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [
      ...params,
      Number(limit),
      Number(offset),
    ]);

    for (const row of rows) {
      // Process category icon
      if (row.cat_img) {
        const catIconIds = String(row.cat_img)
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean);

        const catMedia = await srcMdl.getMedia(catIconIds);
        row.cat_icon = catMedia?.success ? catMedia.data : [];
      } else {
        row.cat_icon = [];
      }

      // Process attachments
      if (row.attachment_ids) {
        const attachmentIds = String(row.attachment_ids)
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean);

        const media = await srcMdl.getMedia(attachmentIds);
        row.attachment = media?.success ? media.data : [];
      } else {
        row.attachment = [];
      }
    }

    return {
      income_total,
      expense_total,
      balance: income_total - expense_total,
      data: replaceNullWithEmptyString(rows),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // Fetch Travel Expense Data
  async fetchTravelExpenseData({
    id,
    travel_id,
    user_id,
    category,
    amount,
    from_date,
    to_date,
    page = 1,
    limit = 10,
  }) {
    const offset = (page - 1) * limit;

    let whereClause = ` WHERE 1 = 1 `;
    const params = [];

    // Travel expense filters
    if (id) {
      whereClause += ` AND te.id = ?`;
      params.push(id);
    }

    if (travel_id) {
      whereClause += ` AND te.travel_id = ?`;
      params.push(travel_id);
    }

    if (user_id) {
      whereClause += ` AND t.user_id = ?`;
      params.push(user_id);
    }

    if (amount) {
      whereClause += ` AND te.amount LIKE ?`;
      params.push(`%${amount}%`);
    }

    if (category) {
      whereClause += `
        AND (
            te.cat_name LIKE ?
            OR t.title LIKE ?
            OR t.travel_from LIKE ?
            OR t.travel_to LIKE ?
            OR CAST(te.amount AS CHAR) LIKE ?
        )
        `;
      const searchValue = `%${category}%`;
      params.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
      );
    }

    if (from_date && to_date) {
      whereClause += ` AND DATE(te.exp_date) BETWEEN ? AND ?`;
      params.push(from_date, to_date);
    } else if (from_date) {
      whereClause += ` AND DATE(te.exp_date) >= ?`;
      params.push(from_date);
    } else if (to_date) {
      whereClause += ` AND DATE(te.exp_date) <= ?`;
      params.push(to_date);
    }

    // Total Records Count
    const [[{ total }]] = await pool.query(
      `
        SELECT COUNT(*) AS total
        FROM travel_exp te
        LEFT JOIN travels t ON te.travel_id = t.id
        ${whereClause}
        `,
      params,
    );

    // Total Expense Summary
    const [summaryRows] = await pool.query(
      `
        SELECT
            SUM(te.amount) AS total_amount
        FROM travel_exp te
        LEFT JOIN travels t ON te.travel_id = t.id
        ${whereClause}
        `,
      params,
    );

    const expense_total = Number(summaryRows[0]?.total_amount || 0);

    // Paginated Data with all travel details
    const query = `
        SELECT
            te.id AS expense_id,
            te.travel_id,
            te.cat_id,
            te.cat_name,
            te.notes,
            te.exp_date AS trans_date,
            te.amount,
            te.created_at AS expense_created_at,
            te.updated_at AS expense_updated_at,
            -- Travel details
            t.user_id,
            t.title AS travel_title,
            t.descp AS travel_description,
            t.purpose AS travel_purpose,
            t.travel_from AS travel_from,
            t.from_lat,
            t.from_lng,
            t.travel_to AS travel_to,
            t.to_lat,
            t.to_lng,
            t.from_date AS travel_from_date,
            t.to_date AS travel_to_date,
            t.vech_mode AS travel_vehicle_mode,
            t.media_id AS travel_media_ids,
            t.in_hotel AS travel_in_hotel,
            t.hot_name AS hotel_name,
            t.hot_address AS hotel_address,
            t.hot_lat AS hotel_lat,
            t.hot_lng AS hotel_lng,
            t.hot_in AS hotel_check_in,
            t.hot_out AS hotel_check_out,
            t.hot_media AS hotel_media_ids,
            t.is_remind,
            t.remind_status,
            t.remind_tenure,
            t.remind_at,
            t.snooze_at,
            t.nxt_snooze_at,
            t.created_at AS travel_created_at,
            t.updated_at AS travel_updated_at,
            -- Category image
            COALESCE(fc.cat_img, 0) AS cat_img,
            fc.cat_name AS category_name
        FROM travel_exp te
        LEFT JOIN travels t ON te.travel_id = t.id
        LEFT JOIN finance_category fc ON te.cat_id = fc.id
        ${whereClause}
        ORDER BY te.exp_date DESC
        LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [
      ...params,
      Number(limit),
      Number(offset),
    ]);

    const processedData = [];

    for (const row of rows) {
      // Process category icon
      let catIcon = [];
      if (row.cat_img) {
        const catIconIds = String(row.cat_img)
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean);

        const catMedia = await srcMdl.getMedia(catIconIds);
        catIcon = catMedia?.success ? catMedia.data : [];
      }

      // Process travel media
      let travelMedia = [];
      if (row.travel_media_ids) {
        const mediaIds = String(row.travel_media_ids)
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean);

        const media = await srcMdl.getMedia(mediaIds);
        travelMedia = media?.success ? media.data : [];
      }

      // Process hotel media
      let hotelMedia = [];
      if (row.hotel_media_ids) {
        const mediaIds = String(row.hotel_media_ids)
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean);

        const media = await srcMdl.getMedia(mediaIds);
        hotelMedia = media?.success ? media.data : [];
      }

      // Process expense attachments (if any)
      let attachments = [];
      // Note: Add attachment field to travel_exp table if needed
      // For now, using notes as description

      // Build the response object
      const expenseData = {
        id: row.expense_id,
        travel_id: row.travel_id,
        type: "expense",
        type_label: "travel",
        user_id: row.user_id,
        category_id: row.cat_id || "0",
        category_name: row.cat_name || "",
        cat_icon: catIcon,
        cat_name: row.category_name || row.cat_name || "",
        trans_date: row.trans_date,
        amount: row.amount,
        notes: row.notes || "",
        attachment: attachments,
        travel_info: {
          id: row.travel_id,
          title: row.travel_title,
          description: row.travel_description,
          purpose: row.travel_purpose,
          travel_from: row.travel_from,
          from_lat: row.from_lat,
          from_lng: row.from_lng,
          travel_to: row.travel_to,
          to_lat: row.to_lat,
          to_lng: row.to_lng,
          from_date: row.travel_from_date,
          to_date: row.travel_to_date,
          vehicle_mode: row.travel_vehicle_mode,
          media: travelMedia,
          hotel: {
            in_hotel: row.travel_in_hotel,
            hotel_name: row.hotel_name,
            hotel_address: row.hotel_address,
            hotel_lat: row.hotel_lat,
            hotel_lng: row.hotel_lng,
            check_in: row.hotel_check_in,
            check_out: row.hotel_check_out,
            hotel_media: hotelMedia,
          },
          reminder: {
            is_remind: row.is_remind,
            remind_status: row.remind_status,
            remind_tenure: row.remind_tenure,
            remind_at: row.remind_at,
            snooze_at: row.snooze_at,
            next_snooze_at: row.nxt_snooze_at,
          },
          created_at: row.travel_created_at,
          updated_at: row.travel_updated_at,
        },
      };

      processedData.push(expenseData);
    }

    return {
      expense_total,
      data: replaceNullWithEmptyString(processedData),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  }
}
