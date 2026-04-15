import type { Request, Response } from "express";

import { getBody, parseId, readDate, readDecimal, readString } from "../../utils/parsers";
import { toJsonSafe } from "../../utils/serializers";
import { ProdutoService } from "./produto.service";

export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  findAll = async (_request: Request, response: Response): Promise<void> => {
    const produtos = await this.produtoService.findAll();
    response.json(toJsonSafe(produtos));
  };

  findById = async (request: Request, response: Response): Promise<void> => {
    const produto = await this.produtoService.findById(parseId(request.params.id));
    response.json(toJsonSafe(produto));
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const body = getBody(request.body);
    const produto = await this.produtoService.create({
      nome: readString(body, "nome", { required: true, max: 150 })!,
      precoAtual: readDecimal(body, "precoAtual", { required: true })!,
      precoPromocao: readDecimal(body, "precoPromocao", { nullable: true }),
      tipo: readString(body, "tipo", { required: true, max: 50 })!,
      descricao: readString(body, "descricao", { required: true, max: 200 })!,
      dataValidade: readDate(body, "dataValidade", { required: true })!
    });

    response.status(201).json(toJsonSafe(produto));
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const body = getBody(request.body);
    const produto = await this.produtoService.update(parseId(request.params.id), {
      nome: readString(body, "nome", { min: 1, max: 150 }),
      precoAtual: readDecimal(body, "precoAtual"),
      precoPromocao: readDecimal(body, "precoPromocao", { nullable: true }),
      tipo: readString(body, "tipo", { min: 1, max: 50 }),
      descricao: readString(body, "descricao", { min: 1, max: 200 }),
      dataValidade: readDate(body, "dataValidade")
    });

    response.json(toJsonSafe(produto));
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await this.produtoService.delete(parseId(request.params.id));
    response.status(204).send();
  };
}
