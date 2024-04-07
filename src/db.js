import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();

// Configuración de desarrollo
const desarrollo = {
  host: process.env.DEV_HOST,
  user: process.env.DEV_USER,
  password: process.env.DEV_PASS,
  port: process.env.DEV_PORT,
  database: process.env.DEV_BD,
};

// Configuración de producción
const produccion = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  port: process.env.PORT,
  database: process.env.BD,
};

// Función para obtener la configuración según el entorno
const getConfig = () => {
  if (process.env.NODE_ENV === "production") {
    return produccion;
  } else {
    return desarrollo;
  }
};

// Crear el pool de conexiones usando la configuración correspondiente
export const pool = createPool(getConfig());
