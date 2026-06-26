import express from "express";
import db from "../config/db.js";
import { executeQuery } from "../utils/helper.js";

export class politicalSumitModel {
  async addSumit({
    user_id,
    title,
    location,
    lat,
    lng,
    sumit_date,
    sts,
    vip,
    member,
    sumit_incharge,
    dept_incharge,
  }) {
    const vipIds = [];
    const memberIds = [];
    const sumit_Incharge_Ids = [];
    const dept_Incharge_Ids = [];
    let connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      let query = `INSERT INTO political_sumit (user_id, title, location, lat, lng, sumit_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      let params = [user_id, title, location, lat, lng, sumit_date, sts];
      const [result] = await connection.execute(query, params);

      const sumit_id = result?.insertId;

      query = `INSERT INTO political_sumit_peoples (sumit_id, type, name, cat_id, cat_name) VALUES (?, ?, ?, ?, ?)`;

      // VIP
      for (const sumitvip of vip) {
        params = [
          sumit_id,
          "Vip",
          sumitvip.name,
          sumitvip.cat_id,
          sumitvip.cat_name || null,
        ];
        const [result] = await connection.execute(query, params);
        vipIds.push(result?.insertId);
      }
      //MEMBER
      for (const sumitmember of member) {
        params = [
          sumit_id,
          "member",
          sumitmember.name,
          sumitmember.cat_id,
          sumitmember.cat_name || null,
        ];
        const [result] = await connection.execute(query, params);
        memberIds.push(result?.insertId);
      }

      //SUMIT INCHARGE
      for (const sumit_incharger of sumit_incharge) {
        params = [
          sumit_id,
          "sumit incharge",
          sumit_incharger.name,
          sumit_incharger.cat_id,
          sumit_incharger.cat_name || null,
        ];
        const [result] = await connection.execute(query, params);
        sumit_Incharge_Ids.push(result?.insertId);
      }

      query = `INSERT INTO political_sumit_peoples (sumit_id, type, name, cat_id, cat_name, dept_id, dept_name) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      //DEPARTMENT INCHARGE
      for (const dept_incharger of dept_incharge) {
        params = [
          sumit_id,
          "dept incharge",
          dept_incharger.name,
          dept_incharger.cat_id,
          dept_incharger.cat_name || null,
          dept_incharger.dept_id,
          dept_incharger.dept_name || null,
        ];
        const [result] = await connection.execute(query, params);
        dept_Incharge_Ids.push(result?.insertId);
      }
      await connection.commit();
      return {
        success: 1,
        data: result,
        vipIds,
        memberIds,
        sumit_Incharge_Ids,
        dept_Incharge_Ids,
      };
    } catch (error) {
      await connection.rollback();

      return {
        success: 0,
        error: error.message,
      };
    } finally {
      await connection.release();
    }
  }
  async deleteSumit({ id }) {
    let query = `DELETE FROM political_sumit WHERE id = ?`;
    let params = [id];

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
  async getSumit({ upt_cols, params }) {
    let query = `SELECT id, title, sumit_date, status FROM political_sumit WHERE ${upt_cols.join("")}`;
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
  async getSumitPeopleDetails(id) {
    let query = `SELECT s.id AS sumit_id, s.title, s.sumit_date, s.status, s.location, s.lat, s.lng, p.id AS people_id, p.name, p.type, p.cat_id, p.cat_name, p.dept_id, p.dept_name, c.category_name AS designation, dept.category_name AS department FROM political_sumit s LEFT JOIN political_sumit_peoples p ON p.sumit_id = s.id LEFT JOIN political_sumit_category c ON c.id = p.cat_id LEFT JOIN political_sumit_category dept ON dept.id = p.dept_id WHERE s.id = ?`;

    const result = await executeQuery(query, [id]);
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
  async updateSumit({ id, title, location, lat, lng, sumit_date, sts }) {
    let query = `UPDATE political_sumit SET title = ?, location = ?, lat = ?, lng = ?, sumit_date = ?, status = ? WHERE id = ?`;
    let params = [title, location, lat, lng, sumit_date, sts, id];
    // console.log(params);

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
  async updateSumitPeople({ type, params, action }) {
    let result;

    if (type === 1 && action === "update") {
      let query_1 = `UPDATE political_sumit_peoples SET name = ?, cat_id = ?, cat_name = ? WHERE id = ?`;
      let params_1 = params;
      result = await executeQuery(query_1, params_1);
    } else if (type === 1 && action === "insert") {
      let query_2 = `INSERT INTO political_sumit_peoples (sumit_id, type, name, cat_id, cat_name) VALUES (?, ?, ?, ?, ?)`;
      let params_2 = params;
      result = await executeQuery(query_2, params_2);
    }

    if (type === 2 && action === "update") {
      let query_1 = `UPDATE political_sumit_peoples SET name = ?, cat_id = ?, cat_name = ?, dept_id = ?, dept_name = ? WHERE id = ?`;
      let params_1 = params;
      result = await executeQuery(query_1, params_1);
    } else if (type === 2 && action === "insert") {
      let query_2 = `INSERT INTO political_sumit_peoples (sumit_id, type, name, cat_id, cat_name, dept_id, dept_name) VALUES (?, ?, ?,  ?, ?, ?, ?)`;
      let params_2 = params;
      result = await executeQuery(query_2, params_2);
    }

    // if (type === 1) {
    //   let query1 = `INSERT INTO political_sumit_peoples (sumit_id, type, name, cat_id, cat_name) VALUES (?, ?, ?, ?, ?)`;
    //   let params1 = params;
    //   result = await executeQuery(query1, params1);
    // } else if (type === 2) {
    //   let query2 = `INSERT INTO political_sumit_peoples (sumit_id, type, name, cat_id, cat_name, dept_id, dept_name) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //   let params2 = params;
    //   result = await executeQuery(query2, params2);
    // }
    // // console.log(result?.success);
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
  async deleteSumitMember({ del_people }) {
    const placeholder = del_people.map(() => "?").join(", ");
    let query = `DELETE FROM political_sumit_peoples WHERE id IN (${placeholder})`;
    let params = del_people;

    const del_result = await executeQuery(query, params);

    if (del_result?.success === 1) {
      return {
        success: 1,
        data: del_result?.data,
      };
    } else if (del_result?.success === 0) {
      return {
        success: 0,
        error: del_result?.error,
      };
    }
  }
  async getDeptRole(id) {
    let query = `SELECT category_name FROM political_sumit_category WHERE id = ?`;
    let params = [id];

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

  async getSumitInfo(id) {
    let query = `SELECT sumit_date, user_id FROM political_sumit WHERE id = ?`;
    let params = [id];

    const result = await executeQuery(query, params);
    // console.log(result);
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

  async getTodaySumits(today) {
    let query = `SELECT id, user_id FROM political_sumit WHERE DATE(sumit_date) = ?`;
    let params = [today];

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
  async getOverdueSumits(today) {
    let query = `SELECT id, user_id FROM political_sumit WHERE DATE(sumit_date) < ? AND status = ?`;
    let params = [today, "inprogress"];

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
}
