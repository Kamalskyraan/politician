import fs from "fs";
import { sendResponse } from "../utils/helper.js";

export const validateVids = (req, res, next) => {
  try {
    let files = req.files;
    // console.log(files);

    let validFiles = [];

    let rejectedFiles = [];

    // FILE COUNT LIMIT
    if (files.length > 5) {
      const extraFiles = files.slice(5);

      extraFiles.forEach((file) => {
        fs.unlinkSync(file.path);

        rejectedFiles.push({
          file: file.originalname,

          reason: "File limit exceeded",
        });
      });

      files = files.slice(0, 5);
    }

    // VALIDATION
    for (const file of files) {
      let maxSize = 0;

      // PDF
      if (file.mimetype.startsWith("video/")) {
        maxSize = 20 * 1024 * 1024;
      }

      // UNSUPPORTED
      else {
        fs.unlinkSync(file.path);

        rejectedFiles.push({
          file: file.originalname,

          reason: "Unsupported file type",
        });

        continue;
      }

      // SIZE EXCEEDED
      if (file.size > maxSize) {
        fs.unlinkSync(file.path);

        rejectedFiles.push({
          file: file.originalname,

          reason: "File size exceeded",
        });

        continue;
      }

      // VALID FILE
      validFiles.push(file);
      // console.log(validFiles);
    }

    // KEEP ONLY VALID FILES
    req.files = validFiles;

    // OPTIONAL
    req.rejectedFiles = rejectedFiles;

    next();
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "internal server error",
      [],
      error.message,
    );
  }
};

export default validateVids;
