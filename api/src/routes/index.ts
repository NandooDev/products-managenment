import { Router } from "express";

import { produtoRoutes } from "../modules/produtos/produto.routes";
import { usuarioRoutes } from "../modules/usuarios/usuario.routes";

export const routes = Router();

routes.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

routes.use("/usuarios", usuarioRoutes);
routes.use("/produtos", produtoRoutes);
