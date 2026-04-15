import { Router } from "express";

import { asyncHandler } from "../../middlewares/async-handler";
import { ProdutoController } from "./produto.controller";
import { ProdutoRepository } from "./produto.repository";
import { ProdutoService } from "./produto.service";

const produtoRepository = new ProdutoRepository();
const produtoService = new ProdutoService(produtoRepository);
const produtoController = new ProdutoController(produtoService);

export const produtoRoutes = Router();

produtoRoutes.get("/", asyncHandler(produtoController.findAll));
produtoRoutes.get("/:id", asyncHandler(produtoController.findById));
produtoRoutes.post("/", asyncHandler(produtoController.create));
produtoRoutes.put("/:id", asyncHandler(produtoController.update));
produtoRoutes.delete("/:id", asyncHandler(produtoController.delete));
