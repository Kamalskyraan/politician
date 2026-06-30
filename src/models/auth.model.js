import { exec } from "child_process";
import {
  createUserID,
  executeQuery,
  getCurrentDateTime,
  sendResponse,
} from "../utils/helper.js";
import { nanoid } from "nanoid";

export class authModel {
  async requestOtp({ phn_num, c_code, email, otp, expired_at }) {
    let query;
    let params = [];

    if (email && phn_num) {
      return {
        success: 0,
        error: "Send either email or phone number",
      };
    } else if (email) {
      query = `INSERT INTO otp (otp, email, expired_at) VALUES (?, ?, ?)`;
      params = [otp, email, expired_at];
    } else {
      query = `INSERT INTO otp (otp, c_code, phn_num, expired_at) VALUES (?, ?, ?, ?)`;
      params = [otp, c_code, phn_num, expired_at];
    }

    const result = await executeQuery(query, params);

    if (result?.success === 1) {
      return {
        success: 1,
        data: result?.data, // for insert query i dont get array as a result so need to give - rows?.data becoz insert query will give insertion details
      };
    } else {
      return { 
        success: 0,
        error: result?.error,
      };
    }
  }

  async verifyOtp({ phn_num, c_code, email, otp }) {
    let query;
    let params = [];
    if ((email && phn_num) || (email && c_code)) {
      return {
        success: 0,
        error: "Send either email or phone number",
      };
    }
    if (email) {
      query = `SELECT * FROM otp WHERE email = ? AND otp = ? ORDER BY id DESC LIMIT 1`;
      params = [email, otp];
    } else {
      query = `SELECT * FROM otp WHERE phn_num = ? AND otp = ? ORDER BY id DESC LIMIT 1`;
      params = [phn_num, otp];
    }
    try {
      const otpresult = await executeQuery(query, params);

      if (!otpresult?.data || otpresult?.data.length === 0) {
        return {
          success: 0,
          error: "OTP not found",
        };
      }

      const otpRow = otpresult?.data[0];

      if (new Date(otpRow.expired_at) < new Date()) {
        return {
          success: 0,
          error: "OTP expired",
        };
      } else if (otpRow.is_used === 1) {
        return {
          success: 0,
          error: "OTP already used",
        };
      }

      const setQuery = `UPDATE otp SET is_used = TRUE WHERE id = ?`;
      const setParams = [otpRow.id];
      const result = await executeQuery(setQuery, setParams);

      return {
        success: 1,
        data: result?.data,
      };
    } catch (error) {
      return {
        success: 0,
        error: error.message,
      };
    }
  }

  async checkUserExists({ phn_num, c_code, email }) {
    let query;
    let params = [];
    if (email) {
      query = `SELECT * FROM users WHERE email = ?`;
      params = [email];
    } else {
      query = `SELECT * FROM users WHERE phn_num = ? AND c_code = ?`;
      params = [phn_num, c_code];
    }

    try {
      const result = await executeQuery(query, params);
      //   console.log("user existed details:", result);
      if (result?.data.length > 0) {
        return {
          success: 1,
          data: result?.data[0], // for select query instead of - rows?.data need to give like result?.data[0] becoz it returns rows for select
        };
      } else {
        return {
          success: 0,
          error: "User not existed",
        };
      }
    } catch (error) {
      return {
        success: 0,
        error: error.message,
      };
    }
  }

  async userSignUp({
    name,
    phn_num,
    c_code,
    email,
    device_token,
    device_id,
    device_type,
  }) {
    let query = `SELECT * FROM users WHERE email = ?`;
    let params = [email];

    const result = await executeQuery(query, params);
    // console.log("user from users", result);

    if (result?.data.length === 0) {
      const userId = await createUserID();
      // console.log("user id:", userId);
      let userRegisterQuery = `INSERT INTO users (user_id, name, c_code, phn_num, email, is_phn_verified, is_email_verified) VALUES (?, ?, ?, ?, ?, 1, 1)`;
      let userRegisterParams = [userId, name, c_code, phn_num, email];

      const registerresult = await executeQuery(
        userRegisterQuery,
        userRegisterParams,
      );
      // console.log("new register",registerresult);

      let userdevicequery = `INSERT INTO user_device (user_id, device_token, device_id, device_type) VALUES (?, ?, ?, ?)`;
      let userdeviceparams = [userId, device_token, device_id, device_type];

      const userdevice = await executeQuery(userdevicequery, userdeviceparams);
      // console.log(userdevice);
      return {
        success: 1,
        data: userId,
      };
    }
    return {
      success: 0,
      error: "user already existed",
    };
  }

  async userLogin({ email, device_token, device_id, device_type }) {
    let query = `SELECT * FROM users WHERE email = ?`;
    let params = [email];

    const result = await executeQuery(query, params);
    // console.log(result);

    if (result?.data.length === 0) {
      return {
        success: 0,
        error: "Sign up as a new user to login",
      };
    } else if (result?.data.length === 1) {
      // if (result?.data[0]?.is_deleted === 1) {
      //   let query = `UPDATE users SET is_deleted = ?, deleted_at = ?, delete_reason = ? WHERE email = ?`;
      //   let params = [0, null, null, email];
      //   const change_result = await executeQuery(query, params);
      // }
      const devUserId = result?.data[0]?.user_id;
      // console.log(result?.data[0]?.user_id);
      let updateLoginQuery = `UPDATE user_device SET device_token = ?, device_id = ?, device_type = ? WHERE user_id = ?;`;
      let updateLoginParams = [device_token, device_id, device_type, devUserId];

      const updateLoginResult = await executeQuery(
        updateLoginQuery,
        updateLoginParams,
      );
      // console.log(updateLoginResult.success)
      if (updateLoginResult.success === 0) {
        return {
          success: 0,
          error: "failed to login",
        };
      } else if (updateLoginResult.success === 1) {
        return {
          success: 1,
          data: result?.data,
        };
      }
    }
  }

  async accRestore(email) {
    let query = `UPDATE users SET is_deleted = ?, deleted_at = ?, delete_reason = ? WHERE email = ?`;
    let params = [0, null, null, email];

    const result = await executeQuery(query, params);

    if (result?.data?.affectedRows === 0) {
      return {
        success: 0,
        error: "user not found",
      };
    } else if (result?.data?.changedRows === 0) {
      return {
        success: 0,
        error: "account already active",
      };
    } else if (result?.data?.changedRows === 1) {
      return {
        success: 1,
        data: "account restored successfully",
      };
    } else {
      return {
        success: 0,
        error: result?.error,
      };
    }
  }

  // async updateProfileDetail({ user_id, name, phn_num, c_code, email }) {
  //   let query = "";
  //   let params = [];
  //   if (name && phn_num && email) {
  //     query = `UPDATE users SET name = ?, phn_num = ?, c_code = ?, email = ? WHERE user_id = ? `;
  //     params = [name, phn_num, c_code, email, user_id];

  //     const result = await executeQuery(query, params);
  //     console.log(result?.success);

  //     if (result?.success === 1) {
  //       return {
  //         success: 1,
  //         message: "profile details updated",
  //       };
  //     } else {
  //       return {
  //         success: 0,
  //         error: "failed to update profile details",
  //       };
  //     }
  //   } else if (name && phn_num === "" && email === "") {
  //     // console.log("i only got name");

  //     query = `UPDATE users SET name = ? WHERE user_id = ? `;
  //     params = [name, user_id];

  //     const result = await executeQuery(query, params);
  //     console.log(result?.success);

  //     if (result?.success === 1) {
  //       return {
  //         success: 1,
  //         message: "profile details updated",
  //       };
  //     } else {
  //       return {
  //         success: 0,
  //         error: "failed to update profile details",
  //       };
  //     }
  //   } else if (phn_num && c_code && name === "" && email === "") {
  //     // console.log("i only got phone number");

  //     query = `UPDATE users SET phn_num = ?, c_code = ? WHERE user_id = ? `;
  //     params = [phn_num, c_code, user_id];

  //     const result = await executeQuery(query, params);
  //     console.log(result?.success);

  //     if (result?.success === 1) {
  //       return {
  //         success: 1,
  //         message: "profile details updated",
  //       };
  //     } else {
  //       return {
  //         success: 0,
  //         error: "failed to update profile details",
  //       };
  //     }
  //   } else if (email && name === "" && phn_num === "") {
  //     // console.log("i only got email");

  //     query = `UPDATE users SET email = ? WHERE user_id = ? `;
  //     params = [email, user_id];

  //     const result = await executeQuery(query, params);
  //     console.log(result?.success);

  //     if (result?.success === 1) {
  //       return {
  //         success: 1,
  //         message: "profile details updated",
  //       };
  //     } else {
  //       return {
  //         success: 0,
  //         error: "failed to update profile details",
  //       };
  //     }
  //   }
  // }
}
