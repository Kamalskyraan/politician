import multer from "multer";
import path from "path";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "src/uploads/docs"; // default

    // IMAGE
    if (file.mimetype.startsWith("image/")) {
      folder = "src/uploads/images";
    }

    // VIDEO
    else if (file.mimetype.startsWith("video/")) {
      folder = "src/uploads/videos";
    }

    // DOCUMENT
    else if (
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("document")
    ) {
      folder = "src/uploads/docs";
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // IMAGE
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }

    // VIDEO
    if (file.mimetype.startsWith("video/")) {
      return cb(null, true);
    }

    //APPLICATION
    if (file.mimetype.startsWith("application/pdf")) {
      return cb(null, true);
    }

    // TXT
    // if (file.mimetype === "text/plain") {
    //   return cb(null, true);
    // }

    // UNSUPPORTED
    return cb(null, false);
  },
});

export default upload;
