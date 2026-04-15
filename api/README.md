# Products Management API

Backend Node.js com Express, TypeScript, Prisma e padrao Repository.

## Requisitos

- Node.js 20+
- PostgreSQL

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie o `.env` a partir do exemplo:

```bash
cp .env.example .env
```

3. Ajuste `DATABASE_URL` no `.env`.

4. Gere o Prisma Client e rode a migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Suba o servidor em modo desenvolvimento:

```bash
npm run dev
```

## Rotas

- `GET /health`
- `GET /usuarios`
- `GET /usuarios/:id`
- `POST /usuarios`
- `PUT /usuarios/:id`
- `DELETE /usuarios/:id`
- `GET /produtos`
- `GET /produtos/:id`
- `POST /produtos`
- `PUT /produtos/:id`
- `DELETE /produtos/:id`

## Payloads

### Usuario

```json
{
  "nome": "Maria Silva",
  "cpf": "12345678901",
  "email": "maria@example.com",
  "senha": "senha-segura"
}
```

### Produto

```json
{
  "nome": "Produto A",
  "precoAtual": "19.90",
  "precoPromocao": "14.90",
  "tipo": "alimento",
  "descricao": "Descricao do produto",
  "dataValidade": "2026-12-31"
}
```
