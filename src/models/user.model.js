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
}
