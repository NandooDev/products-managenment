import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

import { HttpError } from "../utils/http-error";

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      response.status(409).json({
        message: "Registro viola uma restricao unica.",
        details: error.meta
      });
      return;
    }

    if (error.code === "P2025") {
      response.status(404).json({ message: "Registro nao encontrado." });
      return;
    }
  }

  console.error(error);
  response.status(500).json({ message: "Erro interno do servidor." });
};
