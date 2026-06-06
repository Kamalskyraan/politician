import { executeQuery, getCurrentDateTime } from "../utils/helper.js";

export class userModel {
  async getUserDetails({ user_id }) {
    let query = `SELECT * FROM users WHERE user_id = ?`;
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

  async updateProfileDetail({ user_id, name, phn_num, c_code, email }) {
    let query = `SELECT * FROM users WHERE user_id = ?`;
    let params = [user_id];

    const searchResult = await executeQuery(query, params);
    if (searchResult?.data.length === 0) {
      return {
        success: 0,
        error: "User not Found",
      };
    } else {
      const fields = [];
      const params = [];
      const currTimeStamp = await getCurrentDateTime();

      if (name) {
        fields.push("name = ?", "name_upt_at = ?");
        params.push(name, currTimeStamp);
      }

      if (phn_num) {
        fields.push("phn_num = ?", "phnnum_upt_at = ?");
        params.push(phn_num, currTimeStamp);
      }

      if (email) {
        fields.push("email = ?", "email_upt_at = ?");
        params.push(email, currTimeStamp);
      }

      if (c_code) {
        fields.push("c_code = ?");
        params.push(c_code);
      }

      const query = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
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
  }
}
