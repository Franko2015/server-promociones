import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'promocionesdb';
const DB_PORT = process.env.DB_PORT || 3306;

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password:  DB_PASS,
  port: DB_PORT,
  database: DB_NAME,
});
