# Products Management API

API REST para gerenciamento de usuarios e produtos. O projeto usa Node.js, Express, TypeScript, Prisma ORM e PostgreSQL.

## Sumario

- [Requisitos](#requisitos)
- [Dependencias](#dependencias)
- [Estrutura da API](#estrutura-da-api)
- [Configuracao do ambiente](#configuracao-do-ambiente)
- [Banco de dados](#banco-de-dados)
- [Schema](#schema)
- [Inserts iniciais](#inserts-iniciais)
- [Como iniciar a aplicacao](#como-iniciar-a-aplicacao)
- [Rotas](#rotas)
- [Payloads e exemplos](#payloads-e-exemplos)
- [Scripts disponiveis](#scripts-disponiveis)
- [Erros comuns](#erros-comuns)

## Requisitos

Instale estes programas antes de rodar a API:

| Programa | Versao necessaria | Versao testada neste ambiente |
| --- | --- | --- |
| Node.js | 20 ou superior | 24.12.0 |
| npm | 10 ou superior | 11.6.2 |
| PostgreSQL | 14 ou superior | 14.21 |

O banco usado pelo projeto se chama `products_management`.

## Dependencias

As dependencias sao instaladas automaticamente com `npm install`. As versoes abaixo sao as declaradas em `package.json`.

### Dependencias de producao

| Pacote | Versao | Uso |
| --- | --- | --- |
| `@prisma/client` | `^5.22.0` | Cliente Prisma usado para acessar o PostgreSQL |
| `bcryptjs` | `^2.4.3` | Geracao e validacao de hash de senha |
| `cors` | `^2.8.5` | Libera requisicoes do frontend |
| `dotenv` | `^16.4.7` | Carrega variaveis do arquivo `.env` |
| `express` | `^4.21.2` | Servidor HTTP e rotas REST |
| `helmet` | `^8.0.0` | Headers basicos de seguranca HTTP |

### Dependencias de desenvolvimento

| Pacote | Versao | Uso |
| --- | --- | --- |
| `@types/bcryptjs` | `^2.4.6` | Tipos TypeScript do bcryptjs |
| `@types/cors` | `^2.8.17` | Tipos TypeScript do cors |
| `@types/express` | `^4.17.21` | Tipos TypeScript do Express |
| `@types/node` | `^22.10.2` | Tipos TypeScript do Node.js |
| `nodemon` | `^3.1.9` | Reinicia a API em desenvolvimento |
| `prisma` | `^5.22.0` | CLI do Prisma para migrations e Prisma Client |
| `ts-node` | `^10.9.2` | Executa TypeScript direto no ambiente de desenvolvimento |
| `typescript` | `^5.7.2` | Compilador TypeScript |




## Configuracao do ambiente

Entre na pasta da API:

```bash
cd api
```

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell, se `cp` nao funcionar:

```powershell
Copy-Item .env.example .env
```

Depois edite o `.env` com os dados do seu PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/products_management?schema=public"
PORT=3333
BCRYPT_SALT_ROUNDS=10
```

Campos do `.env`:

| Variavel | Obrigatoria | Exemplo | Descricao |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sim | `postgresql://postgres:SUA_SENHA@localhost:5432/products_management?schema=public` | String de conexao do PostgreSQL usada pelo Prisma |
| `PORT` | Nao | `3333` | Porta HTTP da API |
| `BCRYPT_SALT_ROUNDS` | Nao | `10` | Custo usado para gerar hash de senha |

## Banco de dados

Crie o banco no PostgreSQL antes de rodar as migrations.

Usando `psql`:

```bash
psql -U postgres
```

Dentro do console do PostgreSQL:

```sql
CREATE DATABASE products_management;
```

Saia com:

```sql
\q
```

Gere o Prisma Client:

```bash
npm run prisma:generate
```

Rode as migrations:

```bash
npm run prisma:migrate
```

Se estiver em ambiente de producao ou quiser aplicar migrations existentes sem criar uma nova:

```bash
npm run prisma:deploy
```

## Schema

O schema principal fica em `prisma/schema.prisma`.

### Usuario

Tabela no banco: `usuarios`

| Coluna | Tipo no banco | Obrigatoria | Restricao |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Sim | Chave primaria |
| `nome` | `VARCHAR(150)` | Sim | Maximo 150 caracteres |
| `cpf` | `CHAR(11)` | Sim | Unico, 11 digitos |
| `email` | `VARCHAR(150)` | Sim | Unico, email valido |
| `senha` | `TEXT` | Sim | Armazena hash bcrypt |
| `criado_em` | `TIMESTAMP` | Nao | Padrao `CURRENT_TIMESTAMP` |
| `atualizado_em` | `TIMESTAMP` | Nao | Atualizado automaticamente pelo Prisma |


### Produto

Tabela no banco: `produtos`

| Coluna | Tipo no banco | Obrigatoria | Restricao |
| --- | --- | --- | --- |
| `id` | `BIGSERIAL` | Sim | Chave primaria |
| `nome` | `VARCHAR(150)` | Sim | Maximo 150 caracteres |
| `preco_atual` | `NUMERIC(10,2)` | Sim | Valor maior ou igual a zero |
| `preco_promocao` | `NUMERIC(10,2)` | Nao | Valor maior ou igual a zero e menor que `preco_atual` |
| `tipo` | `VARCHAR(50)` | Sim | Maximo 50 caracteres |
| `descricao` | `VARCHAR(200)` | Sim | Maximo 200 caracteres |
| `data_validade` | `DATE` | Sim | Formato `YYYY-MM-DD` |
| `criado_em` | `TIMESTAMP` | Nao | Padrao `CURRENT_TIMESTAMP` |
| `atualizado_em` | `TIMESTAMP` | Nao | Atualizado automaticamente pelo Prisma |



O arquivo `data/schema.sql` contem a versao SQL para criar as tabelas manualmente, caso voce nao queira usar migrations do Prisma.

## Inserts iniciais

O arquivo `data/inserts.sql` contem:

- 10 usuarios.
- 10 produtos.
- Senha inicial de todos os usuarios: `123456`.

As senhas dos usuarios ja estao gravadas como hash bcrypt, no formato esperado pelo backend.

Usuario inicial para teste de login:

```text
E-mail: ana.silva@example.com
Senha: 123456
```

Para aplicar os inserts usando `psql`, rode a partir da pasta `api`:

```bash
psql -U postgres -d products_management -f data/inserts.sql
```

Se seu PostgreSQL pedir senha, informe a senha configurada no seu `DATABASE_URL`.

Observacao: os campos `cpf` e `email` sao unicos. Se voce executar o arquivo `data/inserts.sql` mais de uma vez no mesmo banco, o PostgreSQL vai retornar erro de duplicidade.

## Como iniciar a aplicacao

### Ambiente de desenvolvimento

Na pasta `api`, rode:

```bash
npm run dev
```

A API inicia em:

```text
http://localhost:3333
```

Teste se a API esta online:

```bash
curl http://localhost:3333/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

## Rotas

Base URL local:

```text
http://localhost:3333
```

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/health` | Verifica se a API esta online |
| `GET` | `/usuarios` | Lista todos os usuarios |
| `GET` | `/usuarios/:id` | Busca um usuario por ID |
| `POST` | `/usuarios` | Cria um usuario |
| `POST` | `/usuarios/login` | Valida e-mail e senha |
| `PUT` | `/usuarios/:id` | Atualiza um usuario |
| `DELETE` | `/usuarios/:id` | Remove um usuario |
| `GET` | `/produtos` | Lista todos os produtos |
| `GET` | `/produtos/:id` | Busca um produto por ID |
| `POST` | `/produtos` | Cria um produto |
| `PUT` | `/produtos/:id` | Atualiza um produto |
| `DELETE` | `/produtos/:id` | Remove um produto |

Esta API nao gera token JWT nem sessao. A rota de login apenas valida as credenciais e retorna os dados publicos do usuario.

IDs sao armazenados como `BigInt` no banco. Nas respostas JSON, eles podem voltar como string para evitar problema de serializacao.

## Payloads e exemplos

Os exemplos usam `curl`. No Windows PowerShell, se houver conflito com alias de `curl`, use `curl.exe`.

### Criar usuario

Payload:

```json
{
  "nome": "Maria Silva",
  "cpf": "11122233344",
  "email": "maria@example.com",
  "senha": "123456"
}
```

Regras:

- `nome`: obrigatorio, ate 150 caracteres.
- `cpf`: obrigatorio, exatamente 11 digitos, sem pontos ou tracos.
- `email`: obrigatorio, email valido, ate 150 caracteres.
- `senha`: obrigatoria, minimo 6 caracteres.

Resposta `201`:

```json
{
  "id": "1",
  "nome": "Maria Silva",
  "cpf": "11122233344",
  "email": "maria@example.com",
  "criadoEm": "2026-04-15T16:00:00.000Z",
  "atualizadoEm": "2026-04-15T16:00:00.000Z"
}
```

A senha nunca e retornada nas respostas de usuario.

### Login

Requisicao:

```bash
curl -X POST http://localhost:3333/usuarios/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"ana.silva@example.com\",\"senha\":\"123456\"}"
```

Payload:

```json
{
  "email": "ana.silva@example.com",
  "senha": "123456"
}
```

Resposta `200`:

```json
{
  "id": "1",
  "nome": "Ana Silva",
  "cpf": "12345678901",
  "email": "ana.silva@example.com",
  "criadoEm": "2026-04-15T16:00:00.000Z",
  "atualizadoEm": "2026-04-15T16:00:00.000Z"
}
```

Erro de login invalido:

```json
{
  "message": "E-mail ou senha invalidos."
}
```

### Atualizar usuario

Requisicao:

```bash
curl -X PUT http://localhost:3333/usuarios/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"nome\":\"Maria Souza\",\"email\":\"maria.souza@example.com\"}"
```

Payload parcial permitido:

```json
{
  "nome": "Maria Souza",
  "cpf": "22233344455",
  "email": "maria.souza@example.com",
  "senha": "123456"
}
```

Voce pode enviar apenas os campos que deseja alterar.

### Remover usuario

```bash
curl -X DELETE http://localhost:3333/usuarios/1
```

Resposta esperada:

```text
204 No Content
```

### Criar produto


Payload:

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

Regras:

- `nome`: obrigatorio, ate 150 caracteres.
- `precoAtual`: obrigatorio, decimal positivo com ate 2 casas.
- `precoPromocao`: opcional, decimal positivo com ate 2 casas ou `null`.
- `precoPromocao` deve ser menor que `precoAtual`.
- `tipo`: obrigatorio, ate 50 caracteres.
- `descricao`: obrigatoria, ate 200 caracteres.
- `dataValidade`: obrigatoria, formato `YYYY-MM-DD`.

Resposta `201`:

```json
{
  "id": "1",
  "nome": "Produto A",
  "precoAtual": "19.90",
  "precoPromocao": "14.90",
  "tipo": "alimento",
  "descricao": "Descricao do produto",
  "dataValidade": "2026-12-31T00:00:00.000Z",
  "criadoEm": "2026-04-15T16:00:00.000Z",
  "atualizadoEm": "2026-04-15T16:00:00.000Z"
}
```



## Scripts disponiveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia a API em desenvolvimento com `nodemon` e `ts-node` |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Inicia a API compilada em `dist/server.js` |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Roda migrations em desenvolvimento |
| `npm run prisma:deploy` | Aplica migrations existentes |
| `npm run prisma:studio` | Abre o Prisma Studio para visualizar dados |

## Erros comuns

### `Environment variable not found: DATABASE_URL`

O arquivo `.env` nao existe ou nao esta com `DATABASE_URL`.

Resolva criando o `.env` dentro da pasta `api`:

```bash
cp .env.example .env
```

Depois ajuste a senha, host, porta e nome do banco.

### `P1000: Authentication failed against database server`

O usuario ou senha do PostgreSQL esta errado no `DATABASE_URL`.

Confira este trecho:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/products_management?schema=public"
```

### `P1003: Database does not exist`

O banco `products_management` ainda nao foi criado.

Crie com:

```sql
CREATE DATABASE products_management;
```

### Erro de duplicidade ao rodar inserts

O arquivo `data/inserts.sql` ja foi executado antes. Como `cpf` e `email` sao unicos, executar novamente gera conflito.

Para recriar tudo em ambiente de desenvolvimento, voce pode apagar e recriar o banco, rodar as migrations e depois aplicar os inserts novamente.

### Frontend nao consegue chamar a API

Confirme se a API esta rodando em:

```text
http://localhost:3333
```

Teste:

```bash
curl http://localhost:3333/health
```

O backend ja usa `cors()`, entao chamadas do frontend local sao permitidas.
