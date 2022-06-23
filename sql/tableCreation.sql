DROP DATABASE IF EXISTS dindin;

CREATE DATABASE dindin;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY UNIQUE,
  	nome VARCHAR(50) NOT NULL,
  	email TEXT NOT NULL UNIQUE,
  	senha TEXT NOT NULL
);

DROP TABLE IF EXISTS categorias;

CREATE TABLE categorias (
	id SERIAL PRIMARY KEY UNIQUE,
  	descricao TEXT NOT NULL
);


DROP TABLE IF EXISTS transacoes;

CREATE TABLE transacoes (
	id SERIAL PRIMARY KEY UNIQUE,
  	descricao TEXT NOT NULL,
  	valor INTEGER NOT NULL,
  	data TIMESTAMP NOT NULL,
  	categoria_id INTEGER REFERENCES categorias(id),
  	usuario_id INTEGER REFERENCES usuarios(id),
  	tipo VARCHAR(15) NOT NULL CHECK (tipo in ('entrada', 'saida'))
);