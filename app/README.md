# Products Management Frontend

Frontend Angular do sistema de gerenciamento de produtos e usuarios.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Backend da API rodando em `http://localhost:3333`

Versoes usadas no projeto:

- Angular `21.1`
- npm `11.6.2`
- TypeScript `5.9`

## Instalar dependencias

Entre na pasta do frontend:

```bash
cd app
```

Instale as dependencias:

```bash
npm install
```

## Rodar o frontend

Antes de abrir o frontend, deixe a API ligada na porta `3333`.

Depois rode:

```bash
npm start
```

O Angular vai iniciar normalmente em:

```text
http://localhost:4200
```

## API usada pelo frontend

As chamadas da API ficam centralizadas em:

```text
src/app/services/api-routes.ts
```

Hoje a URL base configurada e:

```text
http://localhost:3333
```

## Comandos disponiveis

| Comando | O que faz |
| --- | --- |
| `npm start` | Inicia o servidor Angular em desenvolvimento |
| `npm run build` | Gera a build de producao |
| `npm run watch` | Gera build em modo watch para desenvolvimento |
| `npm test` | Executa os testes do frontend |

## Login para teste

Se voce aplicou os inserts iniciais da API, pode usar:

```text
E-mail: ana.silva@example.com
Senha: 123456
```

## Fluxo basico

1. Inicie o PostgreSQL.
2. Inicie a API dentro da pasta `api`.
3. Inicie o frontend dentro da pasta `app`.
4. Acesse `http://localhost:4200`.
