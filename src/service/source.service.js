import express from "express";
// import * as media_model from '../models/source.model.js'

// export const uploadfiles = async (files) => {
//   try {
//     const fileList = files.map((file) => ({
//       url: `http://localhost:${process.env.PORT}/src/uploads/${file.filename}`,
//       pathname: file.filename,
//       size: file.size,
//       type: file.mimetype.split("/")[1], // image, video, etc
//       mimetype: file.mimetype,
//       filename: file.originalname,
//     }));

//     const insertedIds = await media_model.insertmedia(fileList);

//     return fileList.map((file, index) => ({
//       id: insertedIds[index],
//       ...file,
//     }));
//   } catch (error) {
//     console.log("error in service:", error);
//   }
// };
