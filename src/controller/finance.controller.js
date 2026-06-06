import express from "express";

import { financeModel } from "../models/finance.model.js";
import { sendResponse } from "../utils/helper.js";
import { financeSchema, validateRequests } from "../utils/validator.js";
import path from "path";
import { generatePdf } from "../service/report.service.js";
import fs from "fs";
const financeMdl = new financeModel();

export const addUpdateFinanceData = async (req, res) => {
  try {
    const {
      id,
      user_id,
      type,
      cat_id,
      cat_name,
      trans_date,
      amount,
      notes,
      attachment,
    } = await validateRequests(req.body, financeSchema);

    if (!cat_id && !cat_name) {
      return sendResponse(
        res,
        200,
        0,
        "Category name or category ID is required",
        [],
        "",
      );
    }
    const data = await financeMdl.addFinanceData({
      id,
      user_id,
      type,
      cat_id,
      cat_name,
      trans_date,
      amount,
      notes,
      attachment,
    });

    return sendResponse(
      res,
      200,
      1,
      `Finance Data ${data.action} Successfully`,
      [],
      "",
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      err.errors || err.message || err,
    );
  }
};

export const getFinanceData = async (req, res) => {
  try {
    const {
      id,
      type,
      user_id,
      category,
      amount,
      from_date,
      to_date,
      page,
      limit,
    } = req.body;

    const data = await financeMdl.fetchFinanceData({
      id,
      type,
      user_id,
      category,
      amount,
      from_date,
      to_date,
      page,
      limit,
    });

    return sendResponse(
      res,
      200,
      1,
      "Finance Data Fetched Successfully",
      data,
      "",
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      err.errors || err.message || err,
    );
  }
};

export const removeFinanceData = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return sendResponse(res, 200, 0, "ID is required", [], "");
    }
    await financeMdl.removeFinData(id);
    return sendResponse(
      res,
      200,
      1,
      "Finance Data removed successfully",
      [],
      "",
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      err.errors || err.message || err,
    );
  }
};

export const getReportData = async (req, res) => {
  try {
    const { user_id, type, from_date, to_date, page } = req.body;

    const data = await financeMdl.fetchReportData({
      user_id,
      type,
      from_date,
      to_date,
      page,
    });

    return sendResponse(
      res,
      200,
      1,
      "Report data fetched successfully",
      [data],
      "",
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      err.errors || err.message || err,
    );
  }
};

//

export const downloadFinanceReport = async (req, res) => {
  try {
    const { type, user_id, from_date, to_date } = req.body;

    const reportData = await financeMdl.fetchReportData({
      type,
      user_id,
      from_date,
      to_date,
    });

    const templatePath = path.join(
      process.cwd(),
      "src",
      "views",
      "finance-report.ejs",
    );

    const pdfBuffer = await generatePdf(templatePath, reportData);

    const reportsDir = path.join(process.cwd(), "src", "uploads", "reports");

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `finance-report-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    fs.writeFileSync(filePath, pdfBuffer);

    const pdfUrl = `${process.env.MEDIA_BASE_URL}/uploads/reports/${fileName}`;

    return sendResponse(
      res,
      200,
      1,
      "Report Generated Successfully",
      {
        file_name: fileName,
        pdf_url: pdfUrl,
      },
      "",
    );
  } catch (err) {
    console.error(err);

    return sendResponse(res, 500, 0, "Failed to generate PDF", [], err.message);
  }
};
