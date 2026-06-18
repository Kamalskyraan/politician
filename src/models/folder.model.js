import pool from "../config/db.js";

export class folderModel {
  async addFolderName({ id, user_id, folder_name }) {
    if (id) {
      const [result] = await pool.query(
        `
        UPDATE user_folder
        SET
        user_id = ?,
        folder_name =?
        WHERE id = ?
        `,
        [user_id, folder_name, id],
      );

      return {
        action: "updated",
      };
    }

    const [result] = await pool.query(
      `
      INSERT INTO  user_folder (
      user_id,
    folder_name
      )
      VALUES (?, ?)
      `,
      [user_id, folder_name],
    );

    return {
      action: "created",
    };
  }

  async removeFolderOrImages({ ids, type }) {
    const idArray = ids.split(",").map((id) => Number(id.trim()));

    if (type === "folder") {
      const [result] = await pool.query(
        `DELETE FROM user_folder WHERE id IN (?)`,
        [idArray],
      );

      return {
        action: "folder(s) deleted",
        affectedRows: result.affectedRows,
      };
    }

    if (type === "image") {
      const [result] = await pool.query(`DELETE FROM media WHERE id IN (?)`, [
        idArray,
      ]);

      return {
        action: "image(s) deleted",
        affectedRows: result.affectedRows,
      };
    }

    throw new Error("Invalid type. Use 'folder' or 'image'");
  }

  async addUpdateFolderImages({ folder_id, media_ids }) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const mediaIdsArray = media_ids
        .split(",")
        .map((id) => Number(id.trim()))
        .filter(Boolean);
      await connection.query(
        `
      UPDATE media
      SET folder_id = ?
      WHERE id IN (?)
      `,
        [folder_id, mediaIdsArray],
      );

      await connection.commit();

      return {
        action: "updated",
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async getFolderImages({ user_id, folder_id, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const BASE_URL = process.env.BASE_URL;

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

      return {
        data: rows,
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
          images,
          images: images.map((img) => ({
            ...img,
            url: img.url ? `${BASE_URL}${img.url}` : null,
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
