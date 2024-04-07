import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();

const desarrollo = {
  host: process.env.DEV_HOST,
  user: process.env.DEV_USER,
  password: process.env.DEV_PASS,
  port: process.env.DEV_PORT,
  database: process.env.DEV_BD,
};

const produccion = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  port: process.env.PORT,
  database: process.env.BD,
};

export const pool = createPool({
  host: process.env.DEV_HOST,
  user: process.env.DEV_USER,
  password: process.env.DEV_PASS,
  port: process.env.DEV_PORT,
  database: process.env.DEV_BD,
});
