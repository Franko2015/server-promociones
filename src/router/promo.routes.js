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
router.get("/api/promociones", validateToken, getAll);

// Get One
router.get("/api/promociones/:id_promocion", validateToken, getOne);

// Update
router.put("/api/promociones/:id_promocion", validateToken, edit);

// Create
router.post("/api/promociones", validateToken, create);

export const Promocion = router;