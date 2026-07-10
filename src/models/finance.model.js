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
    include_travel = true, // New parameter to optionally include travel data
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

    // ============ FINANCE DATA ============
    // Total Records Count - Finance
    const [[{ total_finance }]] = await pool.query(
      `
        SELECT COUNT(*) AS total
        FROM finance f
        LEFT JOIN finance_category fc ON f.category_id = fc.id
        ${whereClause}
        `,
      params,
    );

    // Income / Expense Summary - Finance
    const [financeSummaryRows] = await pool.query(
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

    let finance_income_total = 0;
    let finance_expense_total = 0;

    financeSummaryRows.forEach((row) => {
      if (row.type === "income") {
        finance_income_total = Number(row.total_amount || 0);
      }
      if (row.type === "expense") {
        finance_expense_total = Number(row.total_amount || 0);
      }
    });

    // Paginated Data - Finance
    const financeQuery = `
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
        'finance' AS source
    FROM finance f
    LEFT JOIN finance_category fc ON f.category_id = fc.id
    ${whereClause}
    ORDER BY f.trans_date DESC
    LIMIT ? OFFSET ?
    `;

    const [financeRows] = await pool.query(financeQuery, [
      ...params,
      Number(limit),
      Number(offset),
    ]);

    // Process finance attachments
    for (const row of financeRows) {
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
      delete row.attachment_ids;
    }

    // ============ TRAVEL EXPENSES DATA ============
    let travelRows = [];
    let travel_income_total = 0;
    let travel_expense_total = 0;
    let total_travel = 0;

    if (include_travel) {
      // Build travel where clause separately (if needed)
      let travelWhereClause = ` WHERE 1 = 1 `;
      const travelParams = [];

      if (id) {
        travelWhereClause += ` AND t.id = ?`;
        travelParams.push(id);
      }

      if (type) {
        travelWhereClause += ` AND t.type = ?`;
        travelParams.push(type);
      }

      if (user_id) {
        travelWhereClause += ` AND t.user_id = ?`;
        travelParams.push(user_id);
      }

      if (amount) {
        travelWhereClause += ` AND t.amount LIKE ?`;
        travelParams.push(`%${amount}%`);
      }

      if (category) {
        travelWhereClause += `
            AND (
                t.category_name LIKE ?
                OR tc.cat_name LIKE ?
                OR CAST(t.amount AS CHAR) LIKE ?
            )
            `;
        const searchValue = `%${category}%`;
        travelParams.push(searchValue, searchValue, searchValue);
      }

      if (from_date && to_date) {
        travelWhereClause += ` AND DATE(t.exp_date) BETWEEN ? AND ?`;
        travelParams.push(from_date, to_date);
      } else if (from_date) {
        travelWhereClause += ` AND DATE(t.exp_date) >= ?`;
        travelParams.push(from_date);
      } else if (to_date) {
        travelWhereClause += ` AND DATE(t.exp_date) <= ?`;
        travelParams.push(to_date);
      }

      // Total Records Count - Travel
      const [[{ total }]] = await pool.query(
        `
            SELECT COUNT(*) AS total
            FROM travel_exp t
            LEFT JOIN travel_category tc ON t.cat_id = tc.id
            ${travelWhereClause}
            `,
        travelParams,
      );
      total_travel = total;

      // Summary - Travel
      const [travelSummaryRows] = await pool.query(
        `
            SELECT
                type,
                SUM(amount) AS total_amount
            FROM travel_exp t
            LEFT JOIN travel_category tc ON t.cat_id = tc.id
            ${travelWhereClause}
            GROUP BY type
            `,
        travelParams,
      );

      travelSummaryRows.forEach((row) => {
        if (row.type === "income") {
          travel_income_total = Number(row.total_amount || 0);
        }
        if (row.type === "expense") {
          travel_expense_total = Number(row.total_amount || 0);
        }
      });

      // Paginated Data - Travel
      const travelQuery = `
        SELECT
            t.id,
            t.user_id,
            u.name AS user_name,
            u.email AS user_email,
            t.travel_id,
            t.cat_id,
            t.category_name,
            tc.cat_name AS travel_category_name,
            tc.cat_img,
            t.notes,
            t.exp_date AS trans_date,
            t.amount,
            t.type,
            t.attachment AS attachment_ids,
            'travel' AS source
        FROM travel_exp t
        LEFT JOIN travel_category tc ON t.cat_id = tc.id
        LEFT JOIN users u ON t.user_id = u.id
        ${travelWhereClause}
        ORDER BY t.exp_date DESC
        LIMIT ? OFFSET ?
        `;

      const [travelResult] = await pool.query(travelQuery, [
        ...travelParams,
        Number(limit),
        Number(offset),
      ]);
      travelRows = travelResult;

      // Process travel attachments
      for (const row of travelRows) {
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
        delete row.attachment_ids;
      }
    }

    // ============ COMBINE RESULTS ============
    // Combine both datasets
    const combinedData = [...financeRows, ...travelRows];

    // Sort combined data by trans_date (most recent first)
    combinedData.sort((a, b) => {
      return new Date(b.trans_date) - new Date(a.trans_date);
    });

    // Calculate combined totals
    const total_income = finance_income_total + travel_income_total;
    const total_expense = finance_expense_total + travel_expense_total;
    const total_records = total_finance + total_travel;

    return {
      finance: {
        income_total: finance_income_total,
        expense_total: finance_expense_total,
        balance: finance_income_total - finance_expense_total,
        total_records: total_finance,
        data: replaceNullWithEmptyString(financeRows),
      },
      travel: include_travel
        ? {
            income_total: travel_income_total,
            expense_total: travel_expense_total,
            balance: travel_income_total - travel_expense_total,
            total_records: total_travel,
            data: replaceNullWithEmptyString(travelRows),
          }
        : null,
      combined: {
        income_total: total_income,
        expense_total: total_expense,
        balance: total_income - total_expense,
        total_records: total_records,
        data: replaceNullWithEmptyString(combinedData),
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total_records / limit),
      },
    };
  }
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
}
