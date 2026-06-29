import pool from "../config/db.js";
import { executeQuery, sendResponse } from "../utils/helper.js";

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
    let query = `SELECT id, url, org_name, media_size, created_at FROM media WHERE id IN (${placeHolders})`;
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
  
}
