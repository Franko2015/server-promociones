import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();

const PORT = process.env.PORT_API || 4000;
const DB_HOST = process.env.HOST || 'localhost';
const DB_USER = process.env.USER || 'root';
const DB_PASS = process.env.PASS || '';
const DB_NAME = process.env.BD || 'promocionesdb';
const DB_PORT = process.env.PORT || 3306;

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password:  DB_PASS,
  port: DB_PORT,
  database: DB_NAME,
});
