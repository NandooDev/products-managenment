const API_BASE_URL = 'http://localhost:3333';

export const API_ROUTES = {
  health: `${API_BASE_URL}/health`,
  produtos: {
    list: `${API_BASE_URL}/produtos`,
    detail: (id: number): string => `${API_BASE_URL}/produtos/${id}`,
  },
  usuarios: {
    list: `${API_BASE_URL}/usuarios`,
    detail: (id: number): string => `${API_BASE_URL}/usuarios/${id}`,
    login: `${API_BASE_URL}/usuarios/login`,
  },
} as const;
