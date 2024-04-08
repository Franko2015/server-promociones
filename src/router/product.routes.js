import { Router } from "express";
import {
    getAll,
    getOne,
    edit,
    create,
    showProduct
} from "../controller/product.controller.js";
import validateToken from "../middleware/validate-token.js";

const router = Router();

// Get All
router.get("/api/productos", validateToken, getAll);

// Get One
router.get("/api/productos/:id_producto", validateToken, getOne);

// Update
router.put("/api/productos/:id_producto", validateToken, edit);

// Change state
router.put("/api/productos/show/:id_producto", validateToken, showProduct);

// Create
router.post("/api/productos", validateToken, create);

export const Producto = router;