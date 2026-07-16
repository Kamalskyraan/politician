import apn from "@parse/node-apn";

import dotenv from "dotenv";

dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const apnProvider = new apn.Provider({
  token: {
    key: path.join(__dirname, "AuthKey_G2HUL3X6FP.p8"),
    keyId: "G2HUL3X6FP",
    teamId: "38BKAW23ZM",
  },
  production: process.env.NODE_ENV === "production" ? true : false,
  // production: false,
});
