-- Senha de todos os usuarios: 123456

INSERT INTO usuarios (nome, cpf, email, senha)
VALUES
    ('Ana Silva', '12345678901', 'ana.silva@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Bruno Costa', '23456789012', 'bruno.costa@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Carla Souza', '34567890123', 'carla.souza@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Diego Lima', '45678901234', 'diego.lima@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Elisa Rocha', '56789012345', 'elisa.rocha@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Felipe Martins', '67890123456', 'felipe.martins@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Gabriela Alves', '78901234567', 'gabriela.alves@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Henrique Ramos', '89012345678', 'henrique.ramos@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Isabela Pereira', '90123456789', 'isabela.pereira@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC'),
    ('Joao Ferreira', '01234567890', 'joao.ferreira@example.com', '$2a$10$SubUk8FpRomjt3TsYE1m8ez.l6jwc3lnYoJBb6m6vs9vU0Cyhi/cC');

INSERT INTO produtos (nome, preco_atual, preco_promocao, tipo, descricao, data_validade)
VALUES
    ('Arroz Branco Tipo 1 5kg', 24.90, NULL, 'Mercearia', 'Pacote de arroz branco tipo 1 para consumo diario.', '2026-09-30'),
    ('Feijao Carioca 1kg', 8.99, NULL, 'Mercearia', 'Feijao carioca selecionado para refeicoes do dia a dia.', '2026-08-15'),
    ('Acucar Refinado 1kg', 4.79, NULL, 'Mercearia', 'Acucar refinado para bebidas, receitas e sobremesas.', '2026-10-10'),
    ('Leite Integral 1L', 5.49, 4.99, 'Laticinios', 'Leite integral UHT em embalagem longa vida.', '2026-05-20'),
    ('Cafe Torrado e Moido 500g', 18.90, 16.90, 'Bebidas', 'Cafe torrado e moido tradicional para preparo coado.', '2026-07-01'),
    ('Oleo de Soja 900ml', 7.59, NULL, 'Mercearia', 'Oleo de soja para refogados, frituras e preparo de alimentos.', '2026-11-30'),
    ('Macarrao Espaguete 500g', 5.29, 4.49, 'Massas', 'Macarrao espaguete de semola para refeicoes rapidas.', '2026-09-12'),
    ('Sabao em Po 1,6kg', 21.90, NULL, 'Limpeza', 'Sabao em po para lavagem de roupas brancas e coloridas.', '2027-01-28'),
    ('Papel Higienico Folha Dupla 12 Rolos', 19.99, 17.99, 'Higiene', 'Pacote com 12 rolos de papel higienico folha dupla.', '2027-03-25'),
    ('Peito de Frango Resfriado 1kg', 17.99, NULL, 'Acougue', 'Peito de frango resfriado embalado para preparo.', '2026-04-22');
