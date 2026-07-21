import express from "express";
import { executeQuery } from "../utils/helper.js";

export class webModel {
  async addfaq(question, answer) {
    let query = `INSERT INTO faq (question, answer) VALUES (?, ?)`;
    let params = [question, answer];

    const result = await executeQuery(query, params);
    // console.log(result)
    if (result?.success === 1) {
      return {
        success: 1,
        message: "faq added successfully",
      };
    } else {
      return {
        success: 0,
        message: "faq failed to add",
      };
    }
  }

  async getFaq(status) {
    let query = `SELECT id, question, answer FROM faq WHERE status = ?`;
    let params = [status];

    const result = await executeQuery(query, params);
    // console.log(result);

    if (result?.data.length >= 1) {
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

  async updateFaq(id, question, answer) {
    let query = `UPDATE faq SET question = ?, answer = ? WHERE id = ?`;
    let params = [question, answer, id];

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

  async deleteFaq(id, status) {
    let query = `UPDATE faq SET status = ? WHERE id = ?`;
    let params = [status, id];

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
  async deleteFaqPermanently(id) {
    let query = `DELETE FROM faq WHERE id = ?`;
    let params = [id];

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

  //   async contactUs(user_id, name, phn_num, c_code, email, comments) {
  //     let query = `INSERT INTO contact_us (user_id, name, phn_num, c_code, email, comments) VALUES (?, ?, ?, ?, ?, ?)`;
  //     let params = [user_id, name, phn_num, c_code, email, comments];

  //     const result = await executeQuery(query, params);
  //     if (result?.success === 1) {
  //       return {
  //         success: 1,
  //         data: result?.data,
  //       };
  //     } else {
  //       return {
  //         success: 0,
  //         data: result?.error,
  //       };
  //     }

  //     // console.log(result)
  //   }

  //   async getLocations(user_id) {
  //     let query = `SELECT DISTINCT
  //     country,
  //     state,
  //     district,
  //     COUNT(*) AS member_count
  //   FROM members
  //   WHERE user_id = ? AND status = ?
  //   GROUP BY country, state, district
  //   ORDER BY country, state, district;`;
  //     let params = [user_id, "active"];

  //     const result = await executeQuery(query, params);
  //     // console.log(result);

  //     if (result?.data.length === 0) {
  //       return {
  //         success: 0,
  //         error: result?.error,
  //       };
  //     } else if (result?.success === 1) {
  //       return {
  //         success: 1,
  //         data: result?.data,
  //       };
  //     }
  //   }
  //   async updateStatus({ id, status, table_name, col_name }) {
  //     let query = `UPDATE ${table_name} SET ${col_name} = ? WHERE id = ?`;
  //     let params = [status, id];

  //     const result = await executeQuery(query, params);
  //     // console.log(result);

  //     if (result?.success === 1) {
  //       return {
  //         success: 1,
  //         data: result?.data,
  //       };
  //     } else {
  //       return {
  //         success: 0,
  //         error: result?.error,
  //       };
  //     }
  //   }
  async addIssueCat({ category }) {
    let query = `INSERT INTO issue_category (cat_name) VALUES (?)`;
    let params = [category];

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
  async updateIssueCat({ id, category }) {
    let query = `UPDATE issue_category SET cat_name = ? WHERE id = ?`;
    let params = [category, id];
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
  async getIssueCat(status) {
    let query = `SELECT id, cat_name AS category_name FROM issue_category WHERE status = ?`;
    let params = [status];

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
  async deleteIssueCat(id, status) {
    let query = `UPDATE issue_category SET status = ? WHERE id = ?`;
    let params = [status, id];

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
  async deleteIssueCatPermanently(id) {
    let query = `DELETE FROM issue_category WHERE id = ?`;
    let params = [id];

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

  async addSumitCat({ category }) {
    let query = `INSERT INTO political_sumit_category (category_name) VALUES (?)`;
    let params = [category];

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
  async getSumitCat(status) {
    let query = `SELECT id, category_name FROM political_sumit_category WHERE status = ?`;
    let params = [status];
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
  async updateSumitCat({ id, category }) {
    let query = `UPDATE political_sumit_category SET category_name = ? WHERE id = ?`;
    let params = [category, id];
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
  async deleteSumitCat(id, status) {
    let query = `UPDATE political_sumit_category SET status = ? WHERE id = ?`;
    let params = [status, id];

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
  async deleteSumitCatPermanently(id) {
    let query = `DELETE FROM political_sumit_category WHERE id = ?`;
    let params = [id];

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

  async addTravelExpCat({ category }) {
    let query = `INSERT INTO travel_exp_category (category_name) VALUES (?)`;
    let params = [category];

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
  async updateTravelExpCat({ id, category }) {
    let query = `UPDATE travel_exp_category SET category_name = ? WHERE id = ?`;
    let params = [category, id];
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
  async deleteTravelExpCat(id, status) {
    let query = `UPDATE travel_exp_category SET status = ? WHERE id = ?`;
    let params = [status, id];

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
  async deleteTravelExpCatPermanently(id) {
    let query = `DELETE FROM travel_exp_category WHERE id = ?`;
    let params = [id];

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
  async getTravelExpenseCat(status) {
    let query = `SELECT id, category_name FROM travel_exp_category WHERE status = ?`;
    let params = [status];
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

  //   async processDailyStatusChange(today) {
  //     let query_1 = `UPDATE meeting SET status = ? WHERE DATE(from_date) = ?`;
  //     let params_1 = ["pending", today];
  //     const result_1 = await executeQuery(query_1, params_1);

  //     let query_2 = `UPDATE appointments SET status = ? WHERE DATE(from_date) = ?`;
  //     let params_2 = ["pending", today];
  //     const result_2 = await executeQuery(query_2, params_2);

  //     let query_3 = `UPDATE tasks SET t_status = ? WHERE DATE(from_date) = ?`;
  //     let params_3 = ["inprogress", today];
  //     const result_3 = await executeQuery(query_3, params_3);

  //     let query_4 = `UPDATE political_sumit SET status = ? WHERE DATE(sumit_date) = ?`;
  //     let params_4 = ["inprogress", today];
  //     const result_4 = await executeQuery(query_4, params_4);
  //   }

  async addMemberCat({ category }) {
    let query = `INSERT INTO user_role (role_name) VALUES (?)`;
    let params = [category];

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
  async updateMemberCat({ id, category }) {
    let query = `UPDATE user_role SET role_name = ? WHERE id = ?`;
    let params = [category, id];
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
  async deleteMemberCat(id, status) {
    let query = `UPDATE user_role SET status = ? WHERE id = ?`;
    let params = [status, id];

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
  async deleteMemberCatPermanently(id) {
    let query = `DELETE FROM user_role WHERE id = ?`;
    let params = [id];

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
  async getMemberCat(status) {
    let query = `SELECT id, role_name FROM user_role WHERE status = ?`;
    let params = [status];
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

  async getUserList(status) {
    let query = `SELECT user_id, name, phn_num, c_code, email, created_at FROM users WHERE is_deleted = ?`;
    let params = [status];
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

  async getUserEnquiries(status) {
    let query = `SELECT id, name, phn_num, c_code, email, comments, created_at, status FROM contact_us WHERE status = ?`;
    let params = [status];
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
  async updateUserEnquiries(id, status) {
    let query = `UPDATE contact_us SET status = ? WHERE id = ?`;
    let params = [status, id];
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
  async getAdminDetails(user_name) {
    let query = `SELECT user_name, password FROM admin WHERE user_name = ?`;
    let params = [user_name];
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
