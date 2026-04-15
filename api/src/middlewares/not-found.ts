import type { Request, Response } from "express";

export const notFound = (request: Request, response: Response): void => {
  response.status(404).json({
    message: `Rota ${request.method} ${request.path} nao encontrada.`
  });
};
