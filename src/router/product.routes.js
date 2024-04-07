import { Router } from "express";
import {
    getAll,
    getOne,
    edit,
    create,
} from "../controller/promo.controller.js";
import validateToken from "../middleware/validate-token.js";

const router = Router();

// Get All
router.get("/api/productos", validateToken, getAll);

// Get One
router.get("/api/productos/:id_producto", validateToken, getOne);

// Update
router.put("/api/productos/:id_producto", validateToken, edit);

// Create
router.post("/api/productos", validateToken, create);

export const Usuario = router;