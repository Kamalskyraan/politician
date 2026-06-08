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
}
