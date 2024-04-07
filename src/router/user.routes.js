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
router.get("/api/usuarios", getAll);

// Get One
router.get("/api/usuarios/:id_usuario", getOne);

// Update
router.put("/api/usuarios/:id_usuario", edit);

// Change state
router.put("/api/usuarios/state/:id_usuario", state);

// Create
router.post("/api/usuarios", create);

// Login
router.post("/api/login", login);

export const Usuario = router;
