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

  async addUpdateFolderImages({ id, folder_id, media_ids }) {
    const values = media_ids.map((media_id) => [folder_id, media_id]);
    if (id) {
      const [result] = await pool.query(
        `
        UPDATE folder_media
        SET
        folder_id = ?,
        media_id =?
        WHERE id = ?
        `,
        [folder_id, media_id, id],
      );

      return {
        action: "updated",
      };
    }

    const [result] = await pool.query(
      `
      INSERT INTO  folder_media (
      folder_id,
    media_id
      )
      VALUES (?, ?)
      `,
      [folder_id, media_id],
    );

    return {
      action: "created",
    };
  }

  
}
