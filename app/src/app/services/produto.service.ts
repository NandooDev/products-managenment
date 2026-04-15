import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_ROUTES } from './api-routes';

interface ApiProduto {
  id: number | string;
  nome: string;
  precoAtual: number | string;
  precoPromocao: number | string | null;
  tipo: string;
  descricao: string;
  dataValidade: string;
}

export interface Produto {
  id: number;
  nome: string;
  preco_atual: number;
  preco_promocao: number | null;
  tipo: string;
  descricao: string;
  data_validade: string;
}

export interface ProdutoPayload {
  nome: string;
  preco_atual: number;
  preco_promocao: number | null;
  tipo: string;
  descricao: string;
  data_validade: string;
}

type ApiProdutoPayload = {
  nome?: string;
  precoAtual?: number;
  precoPromocao?: number | null;
  tipo?: string;
  descricao?: string;
  dataValidade?: string;
};

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Produto[]> {
    return this.http
      .get<ApiProduto[]>(API_ROUTES.produtos.list)
      .pipe(map((produtos) => produtos.map((produto) => this.fromApi(produto))));
  }

  criar(produto: ProdutoPayload): Observable<Produto> {
    return this.http
      .post<ApiProduto>(API_ROUTES.produtos.list, this.toApi(produto))
      .pipe(map((produtoCriado) => this.fromApi(produtoCriado)));
  }

  atualizar(id: number, produto: Partial<ProdutoPayload>): Observable<Produto> {
    return this.http
      .put<ApiProduto>(API_ROUTES.produtos.detail(id), this.toApi(produto))
      .pipe(map((produtoAtualizado) => this.fromApi(produtoAtualizado)));
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(API_ROUTES.produtos.detail(id));
  }

  private fromApi(produto: ApiProduto): Produto {
    return {
      id: Number(produto.id),
      nome: produto.nome,
      preco_atual: Number(produto.precoAtual),
      preco_promocao:
        produto.precoPromocao === null || produto.precoPromocao === undefined
          ? null
          : Number(produto.precoPromocao),
      tipo: produto.tipo,
      descricao: produto.descricao,
      data_validade: this.toDateInputValue(produto.dataValidade),
    };
  }

  private toApi(produto: Partial<ProdutoPayload>): ApiProdutoPayload {
    return {
      nome: produto.nome,
      precoAtual: produto.preco_atual,
      precoPromocao: produto.preco_promocao,
      tipo: produto.tipo,
      descricao: produto.descricao,
      dataValidade: produto.data_validade,
    };
  }

  private toDateInputValue(value: string): string {
    return value.includes('T') ? value.split('T')[0] : value;
  }
}
