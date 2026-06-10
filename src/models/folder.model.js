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
      const [result] = await pool.query(
        `DELETE FROM folder_media WHERE id IN (?)`,
        [idArray],
      );

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

      await connection.query(
        `
      UPDATE media
      SET folder_id = ?
      WHERE id IN (?)
      `,
        [folder_id, media_ids],
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
}
