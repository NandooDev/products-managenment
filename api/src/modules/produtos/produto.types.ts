import type { Prisma } from "@prisma/client";

export interface CreateProdutoInput {
  nome: string;
  precoAtual: Prisma.Decimal;
  precoPromocao?: Prisma.Decimal | null;
  tipo: string;
  descricao: string;
  dataValidade: Date;
}

export interface UpdateProdutoInput {
  nome?: string;
  precoAtual?: Prisma.Decimal;
  precoPromocao?: Prisma.Decimal | null;
  tipo?: string;
  descricao?: string;
  dataValidade?: Date;
}
