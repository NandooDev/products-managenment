import { Router } from "express";

import { asyncHandler } from "../../middlewares/async-handler";
import { UsuarioController } from "./usuario.controller";
import { UsuarioRepository } from "./usuario.repository";
import { UsuarioService } from "./usuario.service";

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

export const usuarioRoutes = Router();

usuarioRoutes.post("/login", asyncHandler(usuarioController.login));
usuarioRoutes.get("/", asyncHandler(usuarioController.findAll));
usuarioRoutes.get("/:id", asyncHandler(usuarioController.findById));
usuarioRoutes.post("/", asyncHandler(usuarioController.create));
usuarioRoutes.put("/:id", asyncHandler(usuarioController.update));
usuarioRoutes.delete("/:id", asyncHandler(usuarioController.delete));
