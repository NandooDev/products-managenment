export interface CreateUsuarioInput {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
}

export interface UpdateUsuarioInput {
  nome?: string;
  cpf?: string;
  email?: string;
  senha?: string;
}

export interface LoginUsuarioInput {
  email: string;
  senha: string;
}
