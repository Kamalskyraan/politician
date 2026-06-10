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
    vip,
    member,
    sumit_incharge,
    dept_incharge,
  }) {
    let connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      let query = `INSERT INTO political_sumit (user_id, title, location, lat, lng, sumit_date) VALUES (?, ?, ?, ?, ?, ?)`;
      let params = [user_id, title, location, lat, lng, sumit_date];
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
          sumitvip.cat_name,
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
          sumitmember.cat_name,
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
          sumit_incharger.cat_name,
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
          dept_incharger.cat_name,
          dept_incharger.dept_id,
          dept_incharger.dept_name,
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
}
