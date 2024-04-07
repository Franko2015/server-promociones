import { pool } from "../db.js";
import { postLog } from "./log.controller";

const tabla = "tbl_promociones";
const identificador = "id_promocion";

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
  const { id_promocion } = req.params;
  try {
    const [resultado] = await pool.query(
      `SELECT * FROM ${tabla} WHERE ${identificador} = ?`,
      [id_promocion]
    );
    res.json(resultado);
    await postLog(`Consulta a ${tabla}`, "Consulta SELECT");
  } catch (error) {
    await postLog(error, "Error en la BD");
  }
};

export const edit = async (req, res) => {
  const { id_promocion } = req.params;
  const { id_grupo, id_producto, precio } = req.body;
  try {
    const [resultado] = await pool.query(
        `UPDATE ${tabla} SET nombre =?, descripcion =?, precio =?, imagen=? WHERE ${identificador} = ?`,
        [id_grupo, id_producto, precio, imagen, id_promocion]
    );
    res.json(resultado);
    await postLog(`Modificacion a ${tabla}`, "Modificacion UPDATE");
  } catch (error) {
    await postLog(error, "Error en la BD");
  }
};

export const create = async (req, res) => {
  const { id_grupo, id_producto, precio, imagen } = req.body;
  try {
    const [resultado] = await pool.query(
        `INSERT INTO ${tabla} (id_grupo, id_producto, precio, imagen) VALUES (?, ?, ?, ?)`,
        [id_grupo, id_producto, precio, imagen]
    );
    res.json(resultado);
    await postLog(`Creacion a ${tabla}`, "Creacion INSERT");
  } catch (error) {
    await postLog(error, "Error en la BD");
  }
};

export const deleteOne = async (req, res) => {
  const { id_promocion } = req.params;
  try {
    const [resultado] = await pool.query(
      `DELETE FROM ${tabla} WHERE ${identificador} = ?`,
      [id_promocion]
    );
    res.json(resultado);
    await postLog(`Eliminacion a ${tabla}`, "Eliminacion DELETE");
  } catch (error) {
    await postLog(error, "Error en la BD");
  }
};
