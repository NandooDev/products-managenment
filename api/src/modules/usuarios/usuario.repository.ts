import type { Prisma, Usuario } from "@prisma/client";

import { prisma } from "../../lib/prisma";

export class UsuarioRepository {
  async findAll(): Promise<Usuario[]> {
    return prisma.usuario.findMany({
      orderBy: { id: "asc" }
    });
  }

  async findById(id: bigint): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { email }
    });
  }

  async create(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    return prisma.usuario.create({ data });
  }

  async update(id: bigint, data: Prisma.UsuarioUpdateInput): Promise<Usuario> {
    return prisma.usuario.update({
      where: { id },
      data
    });
  }

  async delete(id: bigint): Promise<Usuario> {
    return prisma.usuario.delete({
      where: { id }
    });
  }
}
