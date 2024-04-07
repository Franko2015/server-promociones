import { Router } from "express";
import {
    getAll,
    getOne,
    edit,
    create,
    login,
    state,
} from "../controller/user.controller.js";
import validateToken from "../middleware/validate-token.js";

const router = Router();

// Get All
router.get("/api/usuarios", validateToken, getAll);

// Get One
router.get("/api/usuarios/:id_usuario", validateToken, getOne);

// Update
router.put("/api/usuarios/:id_usuario", validateToken, edit);

// Change state
router.put("/api/usuarios/state/:id_usuario", validateToken, state);

// Create
router.post("/api/usuarios", create);

// Login
router.post("/api/login", login);

export const Usuario = router;
