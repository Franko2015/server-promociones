import express from "express";
const app = express();
import morgan from "morgan";
import cors from "cors";

import { Usuario } from "./router/user.routes.js";
import { Logs } from "./router/log.routes.js";
import { Promocion } from "./router/promo.routes.js";
import { Producto } from "./router/product.routes.js";

app.use(cors());
app.use(express.json());

app.use(Usuario);
app.use(Promocion);
app.use(Producto);
app.use(Logs);

app.get('/', (res, req)=> {
    res.json({ statusbar: "API RESTful" });
})

// settings
app.set("port", process.env.PORT_API || 4000);
app.set("server", process.env.HOST || process.env.DEV_HOST);
app.set("json spaces", 2);

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// starting the server
app.listen(app.get("port"), () => {
    console.log(`Servidor: ${app.get("server")}\nPuerto: ${app.get("port")}\nURL: http://${app.get("server") + ":" + app.get("port")}/api/`);
});
