import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";
dotenv.config();
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import pool from "./config/db.js";



const swaggerDocument = JSON.parse(
  fs.readFileSync("./src/config/swagger-output.json", "utf8"),
);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", router);

app.use("/uploads", express.static("src/uploads"));

app.get("/check", (req, res) => {
  res.send("backend server is running now");
});

app.get("/abc", (req, res) => {
  res.send("server");
});
const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`politician server running successfully on port ${port}`),
);
