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
        await postLog(`Consulta a tabla ${tabla}`, "Consulta SELECT a todos los usuarios correctamente.");
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
                    `Consulta a tabla ${tabla}`,
                    `Usuario ${resultado.usuario} ha intentado ingresar`
                );
                res.status(401).json({ msg: "No tiene los permisos para ingresar." });
            } else {
                res.status(201).json(usuario);
                await postLog(
                    `Consulta a tabla ${tabla}`,
                    `Consulta SELECT al usuario ${resultado.usuario} correctamente.`
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
                res.json({ msg: "Se ha actualizado el usuario correctamente." });
                await postLog(
                    `Consulta a tabla ${tabla}`,
                    `Se ha modificado al usuario ${resultado.usuario} correctamente.`
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
            res.json({ msg: "Estado de usuario actualizado correctamente." });
            await postLog(`Consulta a tabla ${tabla}`, `Suspensión de cuenta a ${id_usuario} correctamente.`);
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
        permiso,
        correo
    } = req.body;

    try {
        const [resultado] = await pool.query(
            `SELECT * FROM ${tabla} WHERE usuario = ? or correo = ?`,
            [usuario, correo]
        );

        if (resultado && resultado.length > 0) {
            res.status(400).json({ msg: "Ya existe el usuario" });
        } else {
            const passwordHashed = await bcrypt.hash(contrasena, 10);

            await pool.query(
                `
                INSERT INTO tbl_usuarios
                (usuario, contrasena, permiso, correo)
                VALUES (?, ?, ?, ?)`,
                [
                    usuario,
                    passwordHashed,
                    permiso,
                    correo
                ]
            );

            await postLog(
                `Consulta a tabla ${tabla}`,
                `Se ha creado al usuario ${usuario} correctamente`
            );
            res.status(201).json({ msg: "Usuario creado correctamente." });
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
                        process.env.JWT_SECRET || "UnAsadito"
                    );

                    if (token) {
                        await postLog(
                            "Intento de logueo exitoso",
                            `Ha iniciado sesión ${usuario}`
                        );
                        res.status(200).json({
                            msg: `Bienvenido al sistema`,
                            token,
                            user: resultado[0],
                        });
                    } else {
                        res.status(500).json({ msg: "Error al generar el token." });
                    }
                } else {
                    await postLog(
                        `Consulta a tabla ${tabla}`,
                        `Se ha intentado loguear con una contraseña incorrecta el usuario ${usuario}`
                    );
                    res.status(401).json({ msg: "Credenciales inválidas." });
                }
            } else {
                await postLog(
                    `Consulta a tabla ${tabla}`,
                    `Se ha intentado loguear con una cuenta suspendida el usuario ${usuario}`
                );
                res.status(401).json({
                    msg: "Su cuenta está suspendida. Llame a administración si tiene consultas.",
                });
            }
        } else {
            res.status(404).json({ msg: `El usuario no existe` });
        }
    } catch (error) {
        await postLog(error, "Error en la BD");
        res.status(500).json({
            msg: "El servidor no se encuentra disponible. Intente más tarde.",
        });
    }
};