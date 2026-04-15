import type { Request, Response } from "express";

import { getBody, parseId, readString } from "../../utils/parsers";
import { HttpError } from "../../utils/http-error";
import { toJsonSafe } from "../../utils/serializers";
import { UsuarioService } from "./usuario.service";

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  findAll = async (_request: Request, response: Response): Promise<void> => {
    const usuarios = await this.usuarioService.findAll();
    response.json(toJsonSafe(usuarios));
  };

  findById = async (request: Request, response: Response): Promise<void> => {
    const usuario = await this.usuarioService.findById(parseId(request.params.id));
    response.json(toJsonSafe(usuario));
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const body = getBody(request.body);
    const usuario = await this.usuarioService.create({
      nome: readString(body, "nome", { required: true, max: 150 })!,
      cpf: this.readCpf(body, true)!,
      email: this.readEmail(body, true)!,
      senha: readString(body, "senha", { required: true, min: 6 })!
    });

    response.status(201).json(toJsonSafe(usuario));
  };

  login = async (request: Request, response: Response): Promise<void> => {
    const body = getBody(request.body);
    const usuario = await this.usuarioService.login({
      email: this.readEmail(body, true)!,
      senha: readString(body, "senha", { required: true, min: 6 })!
    });

    response.json(toJsonSafe(usuario));
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const body = getBody(request.body);
    const usuario = await this.usuarioService.update(parseId(request.params.id), {
      nome: readString(body, "nome", { min: 1, max: 150 }),
      cpf: this.readCpf(body, false),
      email: this.readEmail(body, false),
      senha: readString(body, "senha", { min: 6 })
    });

    response.json(toJsonSafe(usuario));
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await this.usuarioService.delete(parseId(request.params.id));
    response.status(204).send();
  };

  private readCpf(body: Record<string, unknown>, required: boolean): string | undefined {
    const cpf = readString(body, "cpf", { required, max: 11, min: 11 });

    if (cpf !== undefined && !/^\d{11}$/.test(cpf)) {
      throw new HttpError(400, "Campo 'cpf' deve conter 11 digitos.");
    }

    return cpf;
  }

  private readEmail(body: Record<string, unknown>, required: boolean): string | undefined {
    const email = readString(body, "email", { required, max: 150, min: required ? undefined : 1 });

    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpError(400, "Campo 'email' deve ser um email valido.");
    }

    return email?.toLowerCase();
  }
}
