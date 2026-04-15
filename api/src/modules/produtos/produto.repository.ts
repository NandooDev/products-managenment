import type { Prisma, Produto } from "@prisma/client";

import { prisma } from "../../lib/prisma";

export class ProdutoRepository {
  async findAll(): Promise<Produto[]> {
    return prisma.produto.findMany({
      orderBy: { id: "asc" }
    });
  }

  async findById(id: bigint): Promise<Produto | null> {
    return prisma.produto.findUnique({
      where: { id }
    });
  }

  async create(data: Prisma.ProdutoCreateInput): Promise<Produto> {
    return prisma.produto.create({ data });
  }

  async update(id: bigint, data: Prisma.ProdutoUpdateInput): Promise<Produto> {
    return prisma.produto.update({
      where: { id },
      data
    });
  }

  async delete(id: bigint): Promise<Produto> {
    return prisma.produto.delete({
      where: { id }
    });
  }
}
