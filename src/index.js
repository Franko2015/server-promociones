import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createPool } from "mysql2/promise";
import { config } from "dotenv";

// Cargar variables de entorno desde el archivo .env
config();

const app = express();
const PORT = process.env.PORT || 4000;
const URL = process.env.URL || 'http://localhost';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Importar rutas
import { Usuario } from "./router/user.routes.js";
import { Logs } from "./router/log.routes.js";
import { Promocion } from "./router/promo.routes.js";
import { Producto } from "./router/product.routes.js";
import { Email } from "./router/email.routes.js";

app.use(Usuario);
app.use(Promocion);
app.use(Producto);
app.use(Logs);
app.use(Email);

// Establecer puerto y URL del servidor
app.set("port", PORT);
app.set("server", URL);
app.set("json spaces", 2);

// Crear pool de conexiones a la base de datos
const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'promocionesdb',
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor: ${URL}\nPuerto: ${PORT}\nURL: ${URL}:${PORT}/api/`);
});

export { pool };
