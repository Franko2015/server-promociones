import { pool } from "../db.js";
import { postLog } from "./log.controller.js";

const tabla = "tbl_promociones";
const identificador = "id_promocion";

export const getAll = async (req, res) => {
  try {
    const [resultado] = await pool.query(`
    SELECT 
    prod.id_producto,
    prod.descripcion AS descripcion_producto,
    prod.precio_antes,
    prod.precio_ahora,
    prod.imagen AS imagen_producto,
    prod.mostrar AS mostrar_producto,
    promo.id_promocion,
    promo.id_grupo,
    promo.precio,
    promo.imagen AS imagen_promocion,
    promo.mostrar AS mostrar_promocion
FROM 
    tbl_productos prod, tbl_promociones promo
WHERE 
    prod.id_producto = promo.id_producto
`);
    res.json(resultado);
    await postLog(`Consulta a tabla ${tabla}`, `Consulta SELECT a todas las promociones correctamente.`);
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
    await postLog(`Consulta a tabla ${tabla}`, `Consulta SELECT a la promoción ${id_promocion} correctamente.`);
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
    res.json({msg: `Se ha modificado la promoción ${id_promocion} correctamente.`});
    await postLog(`Consulta a tabla ${tabla}`, `Modificacion a la promoción ${id_promocion} correctamente.`);
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
    res.json({ msg: `Se ha creado la promoción correctamente.` });
    await postLog(`Consulta a tabla ${tabla}`, `Creacion de la promoción con grupo ${id_grupo} correctamente.`);
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
    res.json({ msg: `Se ha eliminado la promoción ${id_promocion} correctamente.` });
    await postLog(`Consulta a tabla ${tabla}`, `Eliminacion de la promoción ${id_promocion} correctamente.`);
  } catch (error) {
    await postLog(error, "Error en la BD");
  }
};
