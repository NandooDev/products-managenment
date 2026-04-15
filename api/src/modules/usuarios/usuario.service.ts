import bcrypt from "bcryptjs";
import type { Usuario } from "@prisma/client";

import { env } from "../../config/env";
import { HttpError } from "../../utils/http-error";
import type { CreateUsuarioInput, UpdateUsuarioInput } from "./usuario.types";
import { UsuarioRepository } from "./usuario.repository";

export type UsuarioResponse = Omit<Usuario, "senha">;

export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async findAll(): Promise<UsuarioResponse[]> {
    const usuarios = await this.usuarioRepository.findAll();
    return usuarios.map((usuario) => this.sanitize(usuario));
  }

  async findById(id: bigint): Promise<UsuarioResponse> {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new HttpError(404, "Usuario nao encontrado.");
    }

    return this.sanitize(usuario);
  }

  async create(input: CreateUsuarioInput): Promise<UsuarioResponse> {
    const senha = await bcrypt.hash(input.senha, env.bcryptSaltRounds);
    const usuario = await this.usuarioRepository.create({
      ...input,
      senha
    });

    return this.sanitize(usuario);
  }

  async update(id: bigint, input: UpdateUsuarioInput): Promise<UsuarioResponse> {
    await this.ensureExists(id);

    const data = {
      ...input,
      ...(input.senha ? { senha: await bcrypt.hash(input.senha, env.bcryptSaltRounds) } : {})
    };

    const usuario = await this.usuarioRepository.update(id, data);
    return this.sanitize(usuario);
  }

  async delete(id: bigint): Promise<void> {
    await this.ensureExists(id);
    await this.usuarioRepository.delete(id);
  }

  private async ensureExists(id: bigint): Promise<void> {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new HttpError(404, "Usuario nao encontrado.");
    }
  }

  private sanitize(usuario: Usuario): UsuarioResponse {
    const { senha: _senha, ...safeUsuario } = usuario;
    return safeUsuario;
  }
}
