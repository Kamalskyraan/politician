import pool from "../config/db.js";
import { executeQuery, sendResponse } from "../utils/helper.js";
import dotenv from "dotenv";
dotenv.config();

// export const insertmedia = async (files) => {
//   const values = files.map((f) => [
//     f.url,
//     f.pathname,
//     f.size,
//     f.type,
//     f.mimetype,
//     f.filename,
//   ]);

//   const [results] = await pool.query(
//     "INSERT INTO media (url, path_name, media_size, media_type, mime_type, org_name) VALUES ?",
//     [values],
//   );

//   const firstId = results.insertId;

//   return files.map((_, i) => firstId + i);
// };

export class sourceModel {
  async addRole({ role_name }) {
    let query = `INSERT INTO user_role (role_name) VALUES (?)`;
    let params = [role_name];

    const result = await executeQuery(query, params);

    // console.log(result?.data);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data[0],
      };
    } else {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  async updateRole({ id, role_name, status }) {
    let query = `UPDATE user_role SET role_name = ?, status = ? WHERE id = ?`;
    let params = [role_name, status, id];

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

  async getUserrole(role_id) {
    let query = `SELECT id, role_name FROM user_role WHERE status = ?`;
    let params = ["active"];

    if (role_id) {
      query = `SELECT id, role_name FROM user_role WHERE id = ?`;
      params = [role_id];
    }

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

  async addMedia({ url, path, size, mime_type, type, org_name }) {
    let query = `
      INSERT INTO media (
        url,
        path_name,
        media_size,
        media_type,
        mime_type,
        org_name
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
 
    const params = [url, path, size, type, mime_type, org_name];
 
    const result = await executeQuery(query, params);
    // console.log(result?.data?.insertId);
    console.log(result)
    return result;
  }
 

  async getMedia(id) {
    let placeHolders = id.map(() => "?").join(", ");

    let query = `
    SELECT
      id,
      url,
      org_name,
      media_size,
      created_at
    FROM media
    WHERE id IN (${placeHolders})
  `;

    const result = await executeQuery(query, id);

    if (result?.success === 1) {
      const sourceData = result.data.map((item) => ({
        ...item,
        url: item.url ? `${process.env.MEDIA_BASE_URL}${item.url}` : null,
      }));
      // console.log(sourceData)
      return {
        success: 1,
        data: sourceData,
      };
    } else {
      return {
        success: 0,
        error: result?.error,
      };
    }

    return {
      success: 0,
      error: result?.error,
    };
  }

  async addUpdateFinCatgory({ id, cat_name, cat_type, status, cat_img }) {
    if (id) {
      const [result] = await pool.query(
        `
            UPDATE finance_category
            SET
              
              cat_name = ?,
              cat_type = ?,
              cat_img = ?,
              status = ?
            WHERE id = ?
            `,
        [cat_name, cat_type, status, id],
      );

      return {
        action: "updated",
      };
    }

    const [result] = await pool.query(
      `
          INSERT INTO finance_category (
          cat_name , cat_type , status , cat_img
                      )
          VALUES (?, ?,'active', ?)
          `,
      [cat_name, cat_type, cat_img],
    );

    return {
      action: "created",
    };
  }

  async fetchFinCategory({ id, status, cat_type }) {
    let query = `
      SELECT
        id,
        cat_name,
        cat_type,
        status
      FROM finance_category
      WHERE 1 = 1
    `;

    const params = [];

    if (id) {
      query += ` AND id = ?`;
      params.push(id);
    }

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    if (cat_type) {
      query += ` AND cat_type = ?`;
      params.push(cat_type);
    }

    query += ` ORDER BY id ASC`;

    const [rows] = await pool.query(query, params);

    if (!id) {
      rows.push({
        id: 0,
        cat_name: "Others",
        cat_type: "",
        status: "active",
      });
    }

    return rows;
  }

  async getPaginatedData({
    baseQuery,
    selectQuery,
    params = [],
    page = 1,
    limit = 10,
  }) {
    const offset = (Number(page) - 1) * Number(limit);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total ${baseQuery}`,
      params,
    );

    const totalRecords = countRows[0].total;

    const [rows] = await pool.query(
      `${selectQuery}
     ${baseQuery}
     LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset],
    );

    return {
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total_records: totalRecords,
        total_pages: Math.ceil(totalRecords / limit),
      },
      rows,
    };
  }

  async getDeleteMedia(id) {
    let placeHolders = id.map(() => "?").join(", ");
    let query = `SELECT id, url, path_name, org_name, media_size FROM media WHERE id IN (${placeHolders})`;
    let params = id;

    // console.log("params:", id);

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
        error: result?.error,
      };
    }
  }
  async deleteMedia(id) {
    let placeHolders = id.map(() => "?").join(", ");
    let query = `DELETE FROM media where id IN (${placeHolders})`;
    let params = id;

    // console.log(id)
    // console.log(placeHolders);
    // console.log(query);

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

  async getCatName(id) {
    let query = `SELECT cat_name FROM issue_category where id = ?`;

    const result = await executeQuery(query, [id]);
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

  async getDeleteReasons() {
    const query = `
    SELECT
      id,
      reason,
      status,
      created_at
    FROM delete_reasons
    WHERE status = 'active'
    ORDER BY id ASC
  `;

    const result = await executeQuery(query);

    return result.data;
  }
}
