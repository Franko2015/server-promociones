import { pool } from "../db.js";
import { postLog } from "./log.controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const tabla = "tbl_usuarios";
const identificador = "id_usuario";

//Se obtienen los datos de los usuarios registrados
export const getAll = async (req, res) => {
    try {
        const [resultado] = await pool.query(`SELECT * FROM ${tabla}`);
        res.json(resultado);
        await postLog(`Consulta a ${tabla}`, "Consulta SELECT");
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};

//Se obtienen los datos del usuario registrado
export const getOne = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const [resultado] = await pool.query(
            `SELECT * FROM ${tabla} WHERE ${identificador} = ?`,
            [id_usuario]
        );

        if (resultado.length > 0) {
            const usuario = resultado[0];

            if (usuario.permiso === "NO") {
                await postLog(
                    `Consulta a ${tabla}`,
                    `Usuario ${resultado.usuario} ha intentado ingresar`
                );
                res.status(401).json({ msg: "NO TIENE LOS PERMISOS PARA INGRESAR AL SISTEMA" });
            } else {
                res.status(201).json(usuario);
                await postLog(
                    `Consulta a ${tabla}`,
                    `Consulta SELECT ONE a la ${tabla} = ${resultado.usuario}`
                );
            }
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

//Se edita el usuario a modo que el rut sea no editable
export const edit = async (req, res) => {
    const { id_usuario } = req.params;
    const {
        usuario,
        contrasena,
        permiso
    } = req.body;

    try {

        const [userFind] = await pool.query(
            `SELECT * FROM ${tabla} WHERE usuario = ?`,
            [usuario]
        );

        if (userFind && userFind.length > 0) {
            res.status(400).json({ msg: "Ya existe el usuario" });
        } else {
            const passwordHashed = await bcrypt.hash(contrasena, 10);
            const [resultado] = await pool.query(
                `UPDATE ${tabla} SET usuario = ?, contrasena = ?, permiso = ? WHERE ${identificador} = ?`,
                [
                    usuario,
                    passwordHashed,
                    permiso,
                    id_usuario
                ]
            );

            if (resultado.affectedRows > 0) {
                res.json({ msg: "Actualizado correctamente" });
                await postLog(
                    `Consulta a ${tabla}`,
                    `Consulta UPDATE a la ${identificador} = ${resultado.usuario}`
                );
            } else {
                res.status(404).json({ msg: "No encontrado" });
            }
        }
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};

export const state = async (req, res) => {
    const { id_usuario } = req.params;
    const { permiso } = req.body;

    try {
        const [resultado] = await pool.query(
            `UPDATE ${tabla} SET permiso = ? WHERE ${identificador} = ?`,
            [permiso, id_usuario]
        );

        if (resultado.affectedRows > 0) {
            res.json({ msg: "Estado de usuario actualizado correctamente" });
            await postLog(`Consulta a ${tabla}`, `Suspensión de cuenta a ${id_usuario}`);
        } else {
            res.status(404).json({ msg: "Usuario no encontrado" });
        }
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};

//Se crea el usuario ya activo con cuenta de cliente
export const create = async (req, res) => {
    const {
        usuario,
        contrasena,
        permiso
    } = req.body;

    try {
        const [resultado] = await pool.query(
            `SELECT * FROM ${tabla} WHERE usuario = ?`,
            [usuario]
        );

        if (resultado && resultado.length > 0) {
            res.status(400).json({ msg: "Ya existe el usuario" });
        } else {
            const passwordHashed = await bcrypt.hash(contrasena, 10);

            await pool.query(
                `
                INSERT INTO tbl_usuarios
                (usuario, contrasena, permiso)
                VALUES (?, ?, ?)`,
                [
                    usuario,
                    passwordHashed,
                    permiso
                ]
            );

            await postLog(
                `Create de usuario ${usuario}`,
                `Usuario ${usuario} creado correctamente`
            );
            res.status(201).json({ msg: "Usuario creado correctamente" });
        }
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};

//Autenticación de usuario
export const login = async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const [resultado] = await pool.query(
            `SELECT * FROM ${tabla} WHERE usuario = ?`,
            [usuario]
        );

        if (resultado.length > 0) {
            const user = resultado[0];
            if (user.permiso === "SI") {
                const passwordValid = await bcrypt.compare(contrasena, user.contrasena);

                if (passwordValid) {
                    const token = jwt.sign(
                        { usuario },
                        process.env.JWT_SECRET || "UnAsadito",
                        { expiresIn: "12h" }
                    );

                    if (token) {
                        await postLog(
                            "Intento de logueo exitoso",
                            `Ha iniciado sesión ${usuario}`
                        );
                        res.status(200).json({
                            msg: `Usuario logueado correctamente: ${token}`,
                            token,
                            user: resultado[0],
                        });
                    } else {
                        res.status(500).json({ msg: "Error al generar el token" });
                    }
                } else {
                    await postLog(
                        "Intento de logueo erróneo",
                        `Se ha intentado loguear con una contraseña incorrecta ${usuario}`
                    );
                    res.status(401).json({ msg: "Credenciales inválidas" });
                }
            } else {
                await postLog(
                    "Usuario INACTIVO intenta logueo",
                    `Se ha intentado loguear con una cuenta suspendida: ${usuario}`
                );
                res.status(401).json({
                    msg: "Su cuenta está suspendida. Llame a administración si tiene consultas.",
                });
            }
        } else {
            res.status(404).json({ msg: "El usuario no existe" });
        }
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};