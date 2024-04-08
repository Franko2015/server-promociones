import { pool } from "../db.js";
import { postLog } from "./log.controller.js";

const tabla = "tbl_productos";
const identificador = "id_producto";

export const getAll = async (req, res) => {
    try {
        const [resultado] = await pool.query(`SELECT * FROM ${tabla}`);
        res.json(resultado);
        await postLog(`Consulta a ${tabla}`, "Consulta SELECT");
    } catch (error) {
        await postLog(error, "Error en la BD");
    }
};

export const getOne = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const [resultado] = await pool.query(
            `SELECT * FROM ${tabla} WHERE ${identificador} = ?`,
            [id_producto]
        );

        if (resultado.length > 0) {
            const producto = resultado[0];
            res.send(producto);
        } else {
            res.status(404).json({ msg: "No encontrado" });
        }
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};

export const edit = async (req, res) => {
    const { id_producto } = req.params;
    const {
        descripcion,
        precio_antes,
        precio_ahora,
        imagen,
        mostrar
    } = req.body;

    try {
        const [resultado] = await pool.query(
            `UPDATE ${tabla} SET descripcion = ?, precio_antes = ?, precio_ahora = ?, imagen = ?, mostrar = ? WHERE ${identificador} = ?`,
            [
                descripcion,
                precio_antes,
                precio_ahora,
                imagen,
                mostrar,
                id_producto
            ]
        );

        if (resultado.affectedRows > 0) {
            res.json({ msg: "Actualizado correctamente" });
            await postLog(
                `Consulta a ${tabla}`,
                `Consulta UPDATE a la ${identificador} = ${id_producto}`
            );
        } else {
            res.status(404).json({ msg: "No encontrado" });
        }
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};

export const create = async (req, res) => {
    const {
        descripcion,
        precio_antes,
        precio_ahora,
        imagen,
        mostrar
    } = req.body;

    try {
        // Verificar si ya existe un producto con la misma descripción
        const [resultado] = await pool.query(
            `SELECT * FROM ${tabla} WHERE descripcion = ?`,
            [descripcion]
        );

        if (resultado && resultado.length > 0) {
            res.status(400).json({ msg: "Ya existe un producto con esta descripción" });
        } else {
            // Insertar el nuevo producto en la base de datos
            await pool.query(
                `
                INSERT INTO tbl_productos
                (descripcion, precio_antes, precio_ahora, imagen, mostrar)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    descripcion,
                    precio_antes,
                    precio_ahora,
                    imagen,
                    mostrar
                ]
            );

            // Registrar el evento en el log
            await postLog(
                `Nuevo producto creado`,
                `Producto "${descripcion}" creado correctamente`
            );
            res.status(201).json({ msg: "Producto creado correctamente" });
        }
    } catch (error) {
        // Manejar errores de la base de datos
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};

export const showProduct = async (req, res) => {
    const { id_producto } = req.params;

    try {
        // Obtener el valor actual de mostrar
        const [resultado] = await pool.query(
            `SELECT mostrar FROM ${tabla} WHERE ${identificador} = ?`,
            [id_producto]
        );
        const mostrarActual = resultado[0].mostrar;

        // Invertir el valor de mostrar
        const nuevoValorMostrar = mostrarActual === 1 ? 0 : 1;

        // Actualizar el valor de mostrar en la base de datos
        const [resultadoUpdate] = await pool.query(
            `UPDATE ${tabla} SET mostrar = ? WHERE ${identificador} = ?`,
            [nuevoValorMostrar, id_producto]
        );

        if (resultadoUpdate.affectedRows > 0) {
            res.json({ msg: "Actualizado correctamente" });
            await postLog(
                `Consulta a ${tabla}`,
                `Consulta UPDATE a la ${identificador} = ${id_producto}`
            );
        } else {
            res.status(404).json({ msg: "No encontrado" });
        }
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
}
