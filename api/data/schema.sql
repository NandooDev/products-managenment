CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    cpf CHAR(11) NOT NULL UNIQUE,

    email VARCHAR(150) NOT NULL UNIQUE,

    senha TEXT NOT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
    id BIGSERIAL PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    preco_atual NUMERIC(10,2) NOT NULL CHECK (preco_atual >= 0),

    preco_promocao NUMERIC(10,2) NULL CHECK (preco_promocao >= 0),

    tipo VARCHAR(50) NOT NULL,

    descricao VARCHAR(200) NOT NULL,

    data_validade DATE NOT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE produtos
ADD CONSTRAINT chk_preco_promocao_valido
CHECK (
    preco_promocao IS NULL 
    OR preco_promocao < preco_atual
);