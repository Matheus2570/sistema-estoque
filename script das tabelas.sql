CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    login VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(50) NOT NULL
);

INSERT INTO usuarios (nome, login, senha)
VALUES ('Administrador', 'admin', '123');

CREATE TABLE produtos (
    idp SERIAL PRIMARY KEY,
    nomep VARCHAR(100) NOT NULL,
    fabricante VARCHAR(50),
    preco NUMERIC(10,2),
    especificacoes TEXT,
    estoque_minimo INTEGER DEFAULT 1,
    voltagem VARCHAR(10),
    cor VARCHAR(30),
    peso VARCHAR(20),
    material VARCHAR(50)
);

INSERT INTO produtos (nomep, fabricante, preco, especificacoes, estoque_minimo, voltagem, cor, peso, material)
VALUES 
('Notebook Dell Inspiron 15', 'Dell', 2800.00, 'Intel i5, 8GB RAM, SSD 256GB, Tela 15.6"', 2, 'Bivolt', 'Prata', '1.8kg', 'Plástico e alumínio'),
('Mouse Logitech M170', 'Logitech', 85.90, 'Conexão USB sem fio, 1000 DPI', 5, 'Bateria AA', 'Preto', '70g', 'Plástico'),
('HD Externo Seagate 1TB', 'Seagate', 399.90, 'USB 3.0, compatível com Windows e Mac', 3, 'USB', 'Preto', '200g', 'Plástico'),
('Cabo HDMI 2m', 'Multilaser', 29.90, 'Compatível com 4K, comprimento 2 metros', 10, 'N/A', 'Preto', '100g', 'Borracha'),
('Monitor LG 24"', 'LG', 799.90, 'Full HD, 75Hz, HDMI e VGA', 2, 'Bivolt', 'Preto', '3.2kg', 'Plástico'),
('Teclado Mecânico Redragon Kumara', 'Redragon', 279.00, 'Switch Blue, retroiluminação vermelha', 3, 'USB', 'Preto', '900g', 'Plástico'),
('Notebook Lenovo IdeaPad 3', 'Lenovo', 2500.00, 'AMD Ryzen 5, 8GB RAM, SSD 512GB', 2, 'Bivolt', 'Cinza', '1.7kg', 'Plástico'),
('Cabo USB-C para USB-A 1m', 'Anker', 49.90, 'Carregamento rápido 3.0, 1 metro', 10, 'N/A', 'Branco', '50g', 'Borracha'),
('Webcam Full HD 1080p', 'Microsoft', 249.90, 'Full HD, microfone embutido, USB', 4, 'USB', 'Preto', '150g', 'Plástico'),
('Caixa de Som Bluetooth JBL GO 3', 'JBL', 349.90, 'Bluetooth 5.1, até 5h de bateria', 5, 'Bateria', 'Azul', '210g', 'Plástico');


CREATE TABLE saldos (
    idp INTEGER PRIMARY KEY REFERENCES produtos(idp) ON DELETE CASCADE,
    saldo INTEGER DEFAULT 0
);

INSERT INTO saldos (idp, saldo) VALUES
(1, 5),
(2, 20),
(3, 8),
(4, 30),
(5, 6),
(6, 10),
(7, 4),
(8, 25),
(9, 7),
(10, 12);

CREATE TABLE movimento (
    idm SERIAL PRIMARY KEY,
    idp INTEGER REFERENCES produtos(idp) ON DELETE CASCADE,
    tipom CHAR(1) CHECK (tipom IN ('E', 'S')),
    qtd INTEGER NOT NULL,
    data_movimento TIMESTAMP DEFAULT NOW()
);

INSERT INTO movimento (idp, tipom, qtd)
VALUES
(1, 'E', 5),
(2, 'E', 20),
(3, 'E', 8),
(4, 'E', 30),
(5, 'E', 6),
(6, 'E', 10),
(7, 'E', 4),
(8, 'E', 25),
(9, 'E', 7),
(10, 'E', 12);
