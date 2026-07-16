import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "skyraantech_political",
//   password: "BHs5$--qOTZ=E4D-",
//   database: "skyraantech_political_db",
//   waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
//   connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
//   queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0,
//   // timezone: "Z",
//   dateStrings: true,
// });

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "political",
//   waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
//   connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
//   queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0,
//   timezone: "Z",
// });
//

const pool = mysql.createPool({
  host: "localhost",
  database: "skyraancloud_political_db",
  password: "5koIO8OlNKIeOJe-",
  user: "skyraancloud_kamalesh_sky",
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0,
  timezone: "+05:30",
  dateStrings: true,
});

// (async () => {
//   try {
//     const [rows] = await pool.query("SELECT 1");
//     console.log("Database connected");
//   } catch (err) {
//     console.error(err);
//   }
// })();
export default pool;
