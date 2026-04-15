import type { Produto } from "@prisma/client";

import { HttpError } from "../../utils/http-error";
import type { CreateProdutoInput, UpdateProdutoInput } from "./produto.types";
import { ProdutoRepository } from "./produto.repository";

export class ProdutoService {
  constructor(private readonly produtoRepository: ProdutoRepository) {}

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.findAll();
  }

  async findById(id: bigint): Promise<Produto> {
    const produto = await this.produtoRepository.findById(id);

    if (!produto) {
      throw new HttpError(404, "Produto nao encontrado.");
    }

    return produto;
  }

  async create(input: CreateProdutoInput): Promise<Produto> {
    this.validatePrices(input);
    return this.produtoRepository.create(input);
  }

  async update(id: bigint, input: UpdateProdutoInput): Promise<Produto> {
    const current = await this.findById(id);
    const next = {
      precoAtual: input.precoAtual ?? current.precoAtual,
      precoPromocao:
        input.precoPromocao === undefined ? current.precoPromocao : input.precoPromocao
    };

    this.validatePrices(next);
    return this.produtoRepository.update(id, input);
  }

  async delete(id: bigint): Promise<void> {
    await this.findById(id);
    await this.produtoRepository.delete(id);
  }

  private validatePrices(input: Pick<CreateProdutoInput, "precoAtual" | "precoPromocao">): void {
    if (input.precoAtual.isNegative()) {
      throw new HttpError(400, "precoAtual nao pode ser negativo.");
    }

    if (input.precoPromocao && input.precoPromocao.isNegative()) {
      throw new HttpError(400, "precoPromocao nao pode ser negativo.");
    }

    if (input.precoPromocao && input.precoPromocao.greaterThanOrEqualTo(input.precoAtual)) {
      throw new HttpError(400, "precoPromocao deve ser menor que precoAtual.");
    }
  }
}
