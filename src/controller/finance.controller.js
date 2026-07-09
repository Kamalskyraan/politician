import express from "express";

import { financeModel } from "../models/finance.model.js";
import { sendResponse } from "../utils/helper.js";
import { financeSchema, validateRequests } from "../utils/validator.js";
import path from "path";
import { generatePdf } from "../service/report.service.js";
import fs from "fs";
import { Parser } from "@json2csv/plainjs";
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
    const financeData = await financeMdl.fetchFinanceData({
      id: data.id,
    });

    return sendResponse(
      res,
      200,
      1,
      `Finance Data ${data.action} Successfully`,
      financeData.data,
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
      limit = 10,
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
    const { user_id, type, from_date, to_date, page, limit = 10 } = req.body;

    const data = await financeMdl.fetchReportData({
      user_id,
      type,
      from_date,
      to_date,
      page,
      limit,
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

// export const downloadFinanceReport = async (req, res) => {
//   try {
//     const { type, user_id, from_date, to_date } = req.body;

//     const reportData = await financeMdl.fetchReportData({
//       type,
//       user_id,
//       from_date,
//       to_date,
//     });

//     const templatePath = path.join(
//       process.cwd(),
//       "src",
//       "views",
//       "finance-report.ejs",
//     );

//     const pdfBuffer = await generatePdf(templatePath, reportData);

//     const reportsDir = path.join(process.cwd(), "src", "uploads", "reports");

//     if (!fs.existsSync(reportsDir)) {
//       fs.mkdirSync(reportsDir, { recursive: true });
//     }

//     const fileName = `finance-report-${Date.now()}.pdf`;
//     const filePath = path.join(reportsDir, fileName);

//     fs.writeFileSync(filePath, pdfBuffer);

//     const pdfUrl = `${process.env.MEDIA_BASE_URL}/uploads/reports/${fileName}`;

//     return sendResponse(
//       res,
//       200,
//       1,
//       "Report Generated Successfully",
//       {
//         file_name: fileName,
//         pdf_url: pdfUrl,
//       },
//       "",
//     );
//   } catch (err) {
//     console.error(err);

//     return sendResponse(res, 500, 0, "Failed to generate PDF", [], err.message);
//   }
// };

export const downloadFinanceReport = async (req, res) => {
  try {
    const { type, user_id, from_date, to_date, d_type = "pdf" } = req.body;

    const reportData = await financeMdl.fetchReportData({
      type,
      user_id,
      from_date,
      to_date,
    });

    const reportsDir = path.join(process.cwd(), "src", "uploads", "reports");

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // if (d_type === "csv") {
    //   const parser = new Parser();
    //   const csv = parser.parse(reportData);

    //   const fileName = `finance-report-${Date.now()}.csv`;
    //   const filePath = path.join(reportsDir, fileName);

    //   fs.writeFileSync(filePath, csv);

    //   return sendResponse(
    //     res,
    //     200,
    //     1,
    //     "CSV Report Generated Successfully",
    //     {
    //       file_name: fileName,
    //       file_url: `${process.env.MEDIA_BASE_URL}/uploads/reports/${fileName}`,
    //     },
    //     "",
    //   );
    // }

    if (d_type === "csv") {
      const rows = [];

      // Title
      rows.push({
        col1: "Finance Report",
        col2: "",
        col3: "",
        col4: "",
        col5: "",
      });

      rows.push({});

      // User Details
      rows.push({
        col1: "User ID",
        col2: reportData.user.user_id,
      });

      rows.push({
        col1: "User Name",
        col2: reportData.user.user_name,
      });

      rows.push({
        col1: "Phone",
        col2: `${reportData.user.c_code} ${reportData.user.phn_num}`,
      });

      rows.push({});

      // Summary
      rows.push({
        col1: "Income Total",
        col2: reportData.summary.income_total,
      });

      rows.push({
        col1: "Expense Total",
        col2: reportData.summary.expense_total,
      });

      rows.push({
        col1: "Balance",
        col2: reportData.summary.balance,
      });

      rows.push({});
      rows.push({});

      // Heading
      rows.push({
        Date: "Date",
        Type: "Type",
        Category: "Category",
        Amount: "Amount",
        Notes: "Notes",
      });

      reportData.data.forEach((item) => {
        rows.push({
          Date: item.trans_date,
          Type: item.type,
          Category: item.category_name || item.cat_name,
          Amount: item.amount,
          Notes: item.notes,
        });
      });

      const parser = new Parser({
        header: false,
      });

      const csv = parser.parse(rows);

      const fileName = `finance-report-${Date.now()}.csv`;
      const filePath = path.join(reportsDir, fileName);

      fs.writeFileSync(filePath, csv);

      return sendResponse(
        res,
        200,
        1,
        "CSV Report Generated Successfully",
        {
          file_name: fileName,
          file_url: `${process.env.MEDIA_BASE_URL}/uploads/reports/${fileName}`,
        },
        "",
      );
    }
    const templatePath = path.join(
      process.cwd(),
      "src",
      "views",
      "finance-report.ejs",
    );

    const pdfBuffer = await generatePdf(templatePath, reportData);

    const fileName = `finance-report-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    fs.writeFileSync(filePath, pdfBuffer);

    return sendResponse(
      res,
      200,
      1,
      "PDF Report Generated Successfully",
      {
        file_name: fileName,
        file_url: `${process.env.MEDIA_BASE_URL}/uploads/reports/${fileName}`,
      },
      "",
    );
  } catch (err) {
    console.error(err);

    return sendResponse(
      res,
      500,
      0,
      "Failed to generate report",
      [],
      err.message,
    );
  }
};
