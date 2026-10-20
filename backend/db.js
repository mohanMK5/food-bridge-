import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// one pool is shared by all the routes
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;
