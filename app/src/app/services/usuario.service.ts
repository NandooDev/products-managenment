import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_ROUTES } from './api-routes';

interface ApiUsuario {
  id: number | string;
  nome: string;
  cpf: string;
  email: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

export interface CreateUsuarioPayload {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
}

export type UpdateUsuarioPayload = Partial<CreateUsuarioPayload>;

export interface LoginPayload {
  email: string;
  senha: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Usuario[]> {
    return this.http
      .get<ApiUsuario[]>(API_ROUTES.usuarios.list)
      .pipe(map((usuarios) => usuarios.map((usuario) => this.fromApi(usuario))));
  }

  criar(usuario: CreateUsuarioPayload): Observable<Usuario> {
    return this.http
      .post<ApiUsuario>(API_ROUTES.usuarios.list, this.toApi(usuario))
      .pipe(map((usuarioCriado) => this.fromApi(usuarioCriado)));
  }

  atualizar(id: number, usuario: UpdateUsuarioPayload): Observable<Usuario> {
    return this.http
      .put<ApiUsuario>(API_ROUTES.usuarios.detail(id), this.toApi(usuario))
      .pipe(map((usuarioAtualizado) => this.fromApi(usuarioAtualizado)));
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(API_ROUTES.usuarios.detail(id));
  }

  login(payload: LoginPayload): Observable<Usuario> {
    return this.http
      .post<ApiUsuario>(API_ROUTES.usuarios.login, {
        email: payload.email.trim().toLowerCase(),
        senha: payload.senha,
      })
      .pipe(map((usuario) => this.fromApi(usuario)));
  }

  private fromApi(usuario: ApiUsuario): Usuario {
    return {
      id: Number(usuario.id),
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
    };
  }

  private toApi(usuario: UpdateUsuarioPayload): UpdateUsuarioPayload {
    return {
      ...usuario,
      cpf: usuario.cpf ? this.onlyDigits(usuario.cpf) : undefined,
      email: usuario.email?.trim().toLowerCase(),
      nome: usuario.nome?.trim(),
      senha: usuario.senha?.trim() || undefined,
    };
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}
