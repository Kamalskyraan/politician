import pool from "../config/db.js";
import {
  getCategoryIcon,
  replaceNullWithEmptyString,
} from "../utils/helper.js";
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
  }) {
    const offset = (page - 1) * limit;

    // Separate queries for global finance and travel expenses
    let globalWhereClause = ` WHERE 1 = 1 `;
    let travelWhereClause = ` WHERE 1 = 1 `;
    const globalParams = [];
    const travelParams = [];

    // Handle type filtering
    if (type === "travel") {
      travelWhereClause = buildTravelWhereClause();
      // Skip global query
    } else if (type === "global") {
      // Only fetch global data
      globalWhereClause = buildGlobalWhereClause();
      // Skip travel query
    } else {
      // Fetch both
      globalWhereClause = buildGlobalWhereClause();
      travelWhereClause = buildTravelWhereClause();
    }

    function buildGlobalWhereClause() {
      let where = ` WHERE 1 = 1 `;
      const params = [];

      if (id) {
        where += ` AND id = ?`;
        params.push(id);
      }

      if (user_id) {
        where += ` AND user_id = ?`;
        params.push(user_id);
      }

      if (amount) {
        where += ` AND amount LIKE ?`;
        params.push(`%${amount}%`);
      }

      if (category) {
        where += `
        AND (
          category_name LIKE ?
          OR CAST(amount AS CHAR) LIKE ?
        )
      `;
        const searchValue = `%${category}%`;
        params.push(searchValue, searchValue);
      }

      if (from_date && to_date) {
        where += ` AND DATE(trans_date) BETWEEN ? AND ?`;
        params.push(from_date, to_date);
      } else if (from_date) {
        where += ` AND DATE(trans_date) >= ?`;
        params.push(from_date);
      } else if (to_date) {
        where += ` AND DATE(trans_date) <= ?`;
        params.push(to_date);
      }

      // Add to global params
      globalParams.push(...params);
      return where;
    }

    function buildTravelWhereClause() {
      let where = ` WHERE 1 = 1 `;
      const params = [];

      if (id) {
        where += ` AND te.id = ?`;
        params.push(id);
      }

      if (amount) {
        where += ` AND te.amount LIKE ?`;
        params.push(`%${amount}%`);
      }

      if (category) {
        where += `
        AND (
          te.cat_name LIKE ?
          OR t.title LIKE ?
          OR t.destination LIKE ?
          OR CAST(te.amount AS CHAR) LIKE ?
        )
      `;
        const searchValue = `%${category}%`;
        params.push(searchValue, searchValue, searchValue, searchValue);
      }

      if (from_date && to_date) {
        where += ` AND DATE(te.exp_date) BETWEEN ? AND ?`;
        params.push(from_date, to_date);
      } else if (from_date) {
        where += ` AND DATE(te.exp_date) >= ?`;
        params.push(from_date);
      } else if (to_date) {
        where += ` AND DATE(te.exp_date) <= ?`;
        params.push(to_date);
      }

      travelParams.push(...params);
      return where;
    }

    // Fetch global finance data
    let globalData = [];
    let globalTotal = 0;
    let globalIncomeTotal = 0;
    let globalExpenseTotal = 0;

    if (type !== "travel") {
      // Global finance count
      const [[{ total: globalCount }]] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM finance
        ${globalWhereClause}
      `,
        globalParams,
      );
      globalTotal = globalCount;

      // Global income/expense summary
      const [globalSummary] = await pool.query(
        `
        SELECT
          type,
          SUM(amount) AS total_amount
        FROM finance
        ${globalWhereClause}
        GROUP BY type
      `,
        globalParams,
      );

      globalSummary.forEach((row) => {
        if (row.type === "income") {
          globalIncomeTotal = Number(row.total_amount || 0);
        }
        if (row.type === "expense") {
          globalExpenseTotal = Number(row.total_amount || 0);
        }
      });

      // Fetch global data with pagination
      const globalQuery = `
        SELECT
          id,
          type,
          user_id,
          COALESCE(category_id, '0') AS category_id,
          category_name,
          trans_date,
          amount,
          notes,
          attachment
        FROM finance
        ${globalWhereClause}
        ORDER BY trans_date DESC
        LIMIT ? OFFSET ?
      `;

      const [globalRows] = await pool.query(globalQuery, [
        ...globalParams,
        Number(limit),
        Number(offset),
      ]);

      // Process global data
      for (const row of globalRows) {
        // Add type
        row.type_label = "global";

        // Process attachments
        if (row.attachment) {
          const attachmentIds = String(row.attachment)
            .split(",")
            .map((id) => Number(id.trim()))
            .filter(Boolean);

          const media = await srcMdl.getMedia(attachmentIds);
          row.attachment = media?.success ? media.data : [];
        } else {
          row.attachment = [];
        }

        // Get category image if category_id exists
        if (row.category_id && row.category_id !== "0") {
          const [catData] = await pool.query(
            `SELECT cat_img, cat_name FROM finance_category WHERE id = ?`,
            [row.category_id],
          );
          if (catData.length > 0) {
            row.cat_icon = catData[0].cat_img
              ? await getCategoryIcon(catData[0].cat_img)
              : [];
            row.cat_name = catData[0].cat_name;
          } else {
            row.cat_icon = [];
            row.cat_name = row.category_name || "";
          }
        } else {
          row.cat_icon = [];
          row.cat_name = row.category_name || "";
        }

        // Remove unnecessary fields
        delete row.category_name;
      }

      globalData = replaceNullWithEmptyString(globalRows);
    }

    // Fetch travel expenses data
    let travelData = [];
    let travelTotal = 0;
    let travelExpenseTotal = 0;

    if (type !== "global") {
      // Travel expenses count
      const [[{ total: travelCount }]] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM travel_exp te
        LEFT JOIN travels t ON te.travel_id = t.id
        ${travelWhereClause}
      `,
        travelParams,
      );
      travelTotal = travelCount;

      // Travel expenses summary
      const [travelSummary] = await pool.query(
        `
        SELECT
          SUM(te.amount) AS total_amount
        FROM travel_exp te
        LEFT JOIN travels t ON te.travel_id = t.id
        ${travelWhereClause}
      `,
        travelParams,
      );
      travelExpenseTotal = Number(travelSummary[0]?.total_amount || 0);

      // Fetch travel data with pagination
      const travelQuery = `
        SELECT
          te.id,
          
          te.travel_id,
          te.cat_id,
          te.cat_name,
          te.amount,
          te.exp_date AS trans_date,
          te.notes AS notes,
         
          t.title AS travel_title,
          t.travel_from AS travel_destination,
          t.from_date AS travel_start_date,
          t.to_date AS travel_end_date,
          t.remind_status AS travel_status
        FROM travel_exp te
        LEFT JOIN travels t ON te.travel_id = t.id
        ${travelWhereClause}
        ORDER BY te.exp_date DESC
        LIMIT ? OFFSET ?
      `;

      const [travelRows] = await pool.query(travelQuery, [
        ...travelParams,
        Number(limit),
        Number(offset),
      ]);

      // Process travel data
      for (const row of travelRows) {
        // Set type as travel
        row.type = "expense"; // Travel expenses are always expense type
        row.type_label = "travel";
        row.category_id = row.cat_id || "0";
        row.category_name = row.cat_name || "";

        // Process attachments
        if (row.attachment) {
          const attachmentIds = String(row.attachment)
            .split(",")
            .map((id) => Number(id.trim()))
            .filter(Boolean);

          const media = await srcMdl.getMedia(attachmentIds);
          row.attachment = media?.success ? media.data : [];
        } else {
          row.attachment = [];
        }

        // Get category icon if cat_id exists
        if (row.cat_id) {
          const [catData] = await pool.query(
            `SELECT cat_img, cat_name FROM finance_category WHERE id = ?`,
            [row.cat_id],
          );
          if (catData.length > 0) {
            row.cat_icon = catData[0].cat_img
              ? await getCategoryIcon(catData[0].cat_img)
              : [];
            row.cat_name = catData[0].cat_name || row.cat_name;
          } else {
            row.cat_icon = [];
          }
        } else {
          row.cat_icon = [];
        }

        // Travel info
        row.travel_info = {
          travel_id: row.travel_id,
          title: row.travel_title,
          destination: row.travel_destination,
          start_date: row.travel_start_date,
          end_date: row.travel_end_date,
          status: row.travel_status,
          cat_name: "",
        };

        // Remove raw travel fields
        delete row.travel_id;
        delete row.travel_title;
        delete row.travel_destination;
        delete row.travel_start_date;
        delete row.travel_end_date;
        delete row.travel_status;
        delete row.cat_id;
        delete row.cat_name;
        delete row.description;
      }

      travelData = replaceNullWithEmptyString(travelRows);
    }

    // Combine both datasets
    let combinedData = [];
    let totalRecords = 0;

    if (type === "travel") {
      combinedData = travelData;
      totalRecords = travelTotal;
    } else if (type === "global") {
      combinedData = globalData;
      totalRecords = globalTotal;
    } else {
      // Combine both and sort by date
      combinedData = [...globalData, ...travelData];
      totalRecords = globalTotal + travelTotal;

      // Sort combined data by trans_date descending
      combinedData.sort((a, b) => {
        return new Date(b.trans_date) - new Date(a.trans_date);
      });
    }

    // Calculate totals
    const totalIncome = globalIncomeTotal;
    const totalExpense = globalExpenseTotal + travelExpenseTotal;
    const balance = totalIncome - totalExpense;

    return {
      income_total: totalIncome,
      expense_total: totalExpense,
      balance: balance,
      data: combinedData,
      pagination: {
        total: totalRecords,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(totalRecords / limit),
      },
    };
  }
}
