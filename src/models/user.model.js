import { executeQuery, getCurrentDateTime } from "../utils/helper.js";

export class userModel {
  async getUserDetails({ user_id }) {
    let query = `SELECT id, name, c_code, phn_num, email FROM users WHERE user_id = ?`;
    let params = [user_id];

    const userDetails = await executeQuery(query, params);

    if (userDetails?.data.length === 1) {
      return {
        success: 1,
        data: userDetails?.data[0],
      };
    } else {
      return {
        success: 0,
        error: "User not found",
      };
    }
  }

  async updateProfileDetail({ user_id, upt_cols, params }) {
    let query = `UPDATE users SET ${upt_cols.join(", ")} WHERE user_id = ?`;

    params.push(user_id);

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
  async getProfileDetails(user_id) {
    let query = `SELECT name, name_upt_at, phn_num, c_code, phnnum_upt_at, email, email_upt_at FROM users WHERE user_id = ?`;
    let params = [user_id];

    const userDetails = await executeQuery(query, params);

    if (userDetails?.data.length === 1) {
      return {
        success: 1,
        data: userDetails?.data[0],
      };
    } else {
      return {
        success: 0,
        error: "User not found",
      };
    }
  }
  async deleteAccount({ user_id, delete_reason, today }) {
    let check_query = `SELECT is_deleted FROM users WHERE user_id = ?`;

    const checkResult = await executeQuery(check_query, [user_id]);
    let user_details;
    // console.log(checkResult);

    if (checkResult?.data[0]?.is_deleted === 1) {
      return {
        success: 0,
        error: "Account already deleted",
      };
    } else {
      let query = `UPDATE users SET delete_reason = ?, is_deleted = ?, deleted_at = ? WHERE user_id = ?`;
      let params = [delete_reason, 1, today, user_id];

      user_details = await executeQuery(query, params);
    }
    // console.log(user_details);
    if (user_details?.success === 1) {
      return {
        success: 1,
        data: user_details?.data[0],
      };
    } else {
      return {
        success: 0,
        error: user_details?.error,
      };
    }
  }
  async getFolderImages({ user_id, folder_id, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const BASE_URL = process.env.BASE_URL || "";

    if (folder_id) {
      const [[{ total }]] = await pool.query(
        `
      SELECT COUNT(*) AS total
      FROM media
      WHERE folder_id = ?
      `,
        [folder_id],
      );

      const [rows] = await pool.query(
        `
      SELECT
        id,
        url,
        media_size,
        org_name,
        folder_id,
        created_at
      FROM media
      WHERE folder_id = ?
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
        [folder_id, Number(limit), Number(offset)],
      );

      const formattedRows = rows.map((item) => ({
        ...item,
        url: item.url
          ? item.url.startsWith("http")
            ? item.url
            : `${BASE_URL}${item.url}`
          : null,
      }));

      return {
        data: formattedRows,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          total_pages: Math.ceil(total / limit),
        },
      };
    }

    const [[{ total }]] = await pool.query(
      `
    SELECT COUNT(*) AS total
    FROM user_folder
    WHERE user_id = ?
    `,
      [user_id],
    );

    const [rows] = await pool.query(
      `
    SELECT
      f.id,
      f.user_id,
      f.folder_name,
      f.created_at,
      COUNT(m.id) AS image_count
    FROM user_folder f
    LEFT JOIN media m ON m.folder_id = f.id
    WHERE f.user_id = ?
    GROUP BY f.id
    ORDER BY f.id DESC
    LIMIT ? OFFSET ?
    `,
      [user_id, Number(limit), Number(offset)],
    );

    const foldersWithImages = await Promise.all(
      rows.map(async (folder) => {
        const [images] = await pool.query(
          `
        SELECT
          id,
          url,
          media_size,
          org_name,
          folder_id,
          created_at
        FROM media
        WHERE folder_id = ?
        ORDER BY id DESC
        LIMIT 3
        `,
          [folder.id],
        );

        return {
          ...folder,
          images: images.map((img) => ({
            ...img,
            url: img.url
              ? img.url.startsWith("http")
                ? img.url
                : `${BASE_URL}${img.url}`
              : null,
          })),
        };
      }),
    );

    return {
      data: foldersWithImages,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  }
}
