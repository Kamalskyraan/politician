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
        await connection.execute(query, params);
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
        await connection.execute(query, params);
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
        await connection.execute(query, params);
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
        await connection.execute(query, params);
      }
      await connection.commit();
      return {
        success: 1,
        data: result,
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
}
