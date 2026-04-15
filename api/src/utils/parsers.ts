import { Prisma } from "@prisma/client";

import { HttpError } from "./http-error";

export const parseId = (value: string): bigint => {
  if (!/^\d+$/.test(value)) {
    throw new HttpError(400, "Id invalido.");
  }

  return BigInt(value);
};

export const getBody = (body: unknown): Record<string, unknown> => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Corpo da requisicao invalido.");
  }

  return body as Record<string, unknown>;
};

export const readString = (
  body: Record<string, unknown>,
  field: string,
  options: { required?: boolean; max?: number; min?: number } = {}
): string | undefined => {
  const value = body[field];
  const required = options.required ?? false;

  if (value === undefined || value === null) {
    if (required) {
      throw new HttpError(400, `Campo '${field}' e obrigatorio.`);
    }

    return undefined;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `Campo '${field}' deve ser texto.`);
  }

  const trimmed = value.trim();

  if (required && trimmed.length === 0) {
    throw new HttpError(400, `Campo '${field}' e obrigatorio.`);
  }

  if (options.min !== undefined && trimmed.length < options.min) {
    throw new HttpError(400, `Campo '${field}' deve ter ao menos ${options.min} caracteres.`);
  }

  if (options.max !== undefined && trimmed.length > options.max) {
    throw new HttpError(400, `Campo '${field}' deve ter no maximo ${options.max} caracteres.`);
  }

  return trimmed;
};

export const readDate = (
  body: Record<string, unknown>,
  field: string,
  options: { required?: boolean } = {}
): Date | undefined => {
  const value = readString(body, field, options);

  if (value === undefined) {
    return undefined;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new HttpError(400, `Campo '${field}' deve ser uma data valida no formato YYYY-MM-DD.`);
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new HttpError(400, `Campo '${field}' deve ser uma data valida no formato YYYY-MM-DD.`);
  }

  return date;
};

export function readDecimal(
  body: Record<string, unknown>,
  field: string,
  options: { required?: boolean; nullable: true }
): Prisma.Decimal | null | undefined;

export function readDecimal(
  body: Record<string, unknown>,
  field: string,
  options?: { required?: boolean; nullable?: false }
): Prisma.Decimal | undefined;

export function readDecimal(
  body: Record<string, unknown>,
  field: string,
  options: { required?: boolean; nullable?: boolean } = {}
): Prisma.Decimal | null | undefined {
  const value = body[field];
  const required = options.required ?? false;
  const nullable = options.nullable ?? false;

  if (value === undefined) {
    if (required) {
      throw new HttpError(400, `Campo '${field}' e obrigatorio.`);
    }

    return undefined;
  }

  if (value === null) {
    if (nullable) {
      return null;
    }

    throw new HttpError(400, `Campo '${field}' nao pode ser nulo.`);
  }

  if (typeof value !== "number" && typeof value !== "string") {
    throw new HttpError(400, `Campo '${field}' deve ser numerico.`);
  }

  const normalized = String(value).trim().replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new HttpError(400, `Campo '${field}' deve ser um decimal positivo com ate 2 casas.`);
  }

  const decimal = new Prisma.Decimal(normalized);

  if (decimal.greaterThan(new Prisma.Decimal("99999999.99"))) {
    throw new HttpError(400, `Campo '${field}' excede o limite numerico permitido.`);
  }

  return decimal;
}
