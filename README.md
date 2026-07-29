# Inventory Control System / Sistema de Controle de Estoque

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js CI](https://img.shields.io/badge/node-%3E%3D14-brightgreen)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-%3E%3D5.7-blue)](https://www.mysql.com/)

Lightweight Inventory Control System built to practice Full Stack development with JavaScript, Node.js, Express and MySQL.

Versão em Português abaixo.

---

## Table of contents

- [Features / Funcionalidades](#features--funcionalidades)
- [Tech / Tecnologias](#tech--tecnologias)
- [Demo / Capturas de tela](#demo--capturas-de-tela)
- [Prerequisites / Pré-requisitos](#prerequisites--pré-requisitos)
- [Installation / Instalação](#installation--instalação)
- [Environment / Variáveis de ambiente](#environment--variáveis-de-ambiente)
- [Database / Banco de dados](#database--banco-de-dados)
- [Run / Executar](#run--executar)
- [API Endpoints / Endpoints da API](#api-endpoints--endpoints-da-api)
- [Contributing / Contribuindo](#contributing--contribuindo)
- [Future improvements / Melhorias futuras](#future-improvements--melhorias-futuras)
- [License / Licença](#license--licença)
- [Contact / Contato](#contact--contato)

---

## Features / Funcionalidades

- Product registration / Cadastro de produtos
- Product listing / Listagem de produtos
- MySQL integration / Integração com banco de dados MySQL
- REST API with Express / API REST com Express
- Responsive interface / Interface responsiva

## Tech / Tecnologias

- HTML, CSS, JavaScript
- Node.js, Express
- MySQL
- Git & GitHub

## Demo / Capturas de tela

(Add screenshots or a short GIF here. Example:)
![Screenshot](./docs/screenshot.png)

## Prerequisites / Pré-requisitos

- Node.js >= 14
- npm or yarn
- MySQL server

## Installation / Instalação

1. Clone the repo
   - git clone https://github.com/miguelotth/sistema-controle-estoque.git
   - cd sistema-controle-estoque

2. Install dependencies
   - npm install
   - or
   - yarn install

## Environment / Variáveis de ambiente

Create a `.env` file in the project root (do not commit it). Example variables:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_db
DB_PORT=3306
```

Consider adding `.env.example` to the repo with the keys (not real secrets).

## Database / Banco de dados

1. Create the database:

```sql
CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventory_db;
```

2. Create a simple products table (example):

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Update `.env` with DB credentials and run the app (it should connect and use that table). Add migration scripts or a seed script for repeatable setups.

## Run / Executar

- Start in development:
  - npm run dev
- Start production:
  - npm start

(Adjust scripts in package.json if needed: `dev` -> nodemon, `start` -> node index.js/app.js)

## API Endpoints / Endpoints da API

Example endpoints (update to reflect your actual routes):

- GET /api/products — List products
- GET /api/products/:id — Get product by id
- POST /api/products — Create new product
  - Body: { "name": "Product", "description": "...", "price": 10.5, "quantity": 5 }
- PUT /api/products/:id — Update product
- DELETE /api/products/:id — Delete product

Example curl:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Pen","description":"Ballpoint","price":1.25,"quantity":100}'
```

## Contributing / Contribuindo

- Fork the repo
- Create a feature branch: git checkout -b feature/your-feature
- Commit your changes and open a PR
- Add tests or instructions for manual QA
- Keep changes small and focused

If you'd like, open issues for planned features (editing, deletion, movement history). Label them as `enhancement`.

## Future improvements / Melhorias futuras

- Product editing / Edição de produtos
- Product deletion / Exclusão de produtos
- Stock movement history / Histórico de movimentações de estoque
- Dashboard with indicators / Dashboard com indicadores
- User authentication / Autenticação de usuários
- Add Docker setup, migrations, and tests

## License / Licença

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Contact / Contato

Maintainer: Miguel Otth — https://github.com/miguelotth

If you'd like, I can:
- Create a PR with this README.
- Add .env.example, a basic Dockerfile/docker-compose, and DB migration/seed scripts.
- Add a screenshots folder and update README with images.
- Generate example Postman collection or tests.
