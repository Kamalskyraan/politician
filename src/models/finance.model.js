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
    let query = `
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
    f.attachment as attachment_ids
 
      FROM finance f
     LEFT JOIN finance_category fc
    ON f.category_id = fc.id
    WHERE 1 = 1
  `;

    const params = [];

    if (id) {
      query += ` AND f.id = ?`;
      params.push(id);
    }

    if (type) {
      query += ` AND f.type = ?`;
      params.push(type);
    }

    if (user_id) {
      query += ` AND f.user_id = ?`;
      params.push(user_id);
    }

    //   if (category) {
    //     query += `
    //   AND (
    //     f.category_name LIKE ?
    //     OR fc.cat_name LIKE ?
    //     OR f.amount LIKE ?
    //   )
    // `;

    //     params.push(`%${category}%`, `%${category}%`);
    //   }

    //   if (amount) {
    //     query += ` AND f.amount LIKE ?`;
    //     params.push(`%${amount}%`);
    //   }

    if (category) {
      query += `
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
      query += ` AND DATE(f.trans_date) BETWEEN ? AND ?`;
      params.push(from_date, to_date);
    } else if (from_date) {
      query += ` AND DATE(f.trans_date) >= ?`;
      params.push(from_date);
    } else if (to_date) {
      query += ` AND DATE(f.trans_date) <= ?`;
      params.push(to_date);
    }

    query += ` ORDER BY f.trans_date DESC`;

    const [rows] = await pool.query(query, params);

    for (const row of rows) {
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
        const attachmentIds = row.attachment_ids
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean);

        const media = await srcMdl.getMedia(attachmentIds);

        row.attachment = media?.success ? media.data : [];
      } else {
        row.attachment = [];
      }
    }
    const income_total = rows
      .filter((row) => row.type === "income")
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const expense_total = rows
      .filter((row) => row.type === "expense")
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);
    return {
      income_total,
      expense_total,
      balance: income_total - expense_total,
      data: replaceNullWithEmptyString(rows),
    };
  }

  async removeFinData(id) {
    const [result] = await pool.query(`DELETE FROM finance WHERE id =?`, [id]);
  }

  async fetchReportData({ type, user_id, from_date, to_date }) {
    let query = `
    SELECT
      f.id,
      f.type,
      f.user_id,
      COALESCE(f.category_id, 0) AS category_id,
      COALESCE(f.category_name, '') AS category_name,
      COALESCE(fc.cat_name, '') AS cat_name,
      COALESCE(fc.cat_img, 0) AS cat_img,
      f.trans_date,
      f.amount,
      f.notes,
      f.attachment AS attachment_ids
    FROM finance f
    LEFT JOIN finance_category fc
      ON f.category_id = fc.id
    WHERE 1 = 1
  `;

    const params = [];

    if (user_id) {
      query += ` AND f.user_id = ?`;
      params.push(user_id);
    }

    if (from_date && to_date) {
      query += ` AND DATE(f.trans_date) BETWEEN ? AND ?`;
      params.push(from_date, to_date);
    } else if (from_date) {
      query += ` AND DATE(f.trans_date) >= ?`;
      params.push(from_date);
    } else if (to_date) {
      query += ` AND DATE(f.trans_date) <= ?`;
      params.push(to_date);
    }

    query += ` ORDER BY f.trans_date DESC`;

    const [rows] = await pool.query(query, params);

    for (const row of rows) {
      if (row.cat_img) {
        const catMedia = await srcMdl.getMedia([Number(row.cat_img)]);
        row.cat_icon = catMedia?.success ? catMedia.data[0] : null;
      } else {
        row.cat_icon = null;
      }

      if (row.attachment_ids) {
        const attachmentIds = row.attachment_ids
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean);

        const media = await srcMdl.getMedia(attachmentIds);

        row.attachment = media?.success ? media.data : [];
      } else {
        row.attachment = [];
      }

      delete row.cat_img;
      delete row.attachment_ids;
    }

    const income_total = rows
      .filter((row) => row.type === "income")
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const expense_total = rows
      .filter((row) => row.type === "expense")
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const chartRows = type ? rows.filter((row) => row.type === type) : rows;

    const chartMap = {};

    chartRows.forEach((row) => {
      const key = row.category_id || 0;

      if (!chartMap[key]) {
        chartMap[key] = {
          category_id: Number(row.category_id) || 0,
          category_name: row.category_name || row.cat_name || "",
          category_icon: row.cat_icon,
          total_amount: 0,
        };
      }

      chartMap[key].total_amount += Number(row.amount || 0);
    });

    const chart_data = Object.values(chartMap);

    return {
      summary: {
        income_total,
        expense_total,
      },
      chart_data: replaceNullWithEmptyString(chart_data),
      data: replaceNullWithEmptyString(rows),
    };
  }
}
