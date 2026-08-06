<div align="center">

# 📦 Sistema de Controle de Estoque

### Sistema web para gerenciamento de produtos, movimentações e controle de estoque em tempo real.

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</p>

<p align="center">

<img src="./assets/demo.gif" width="900">

</p>

</div>

---

# 📖 Sobre o projeto

O **Sistema de Controle de Estoque (SGE)** é uma aplicação Full Stack desenvolvida com foco em boas práticas de arquitetura e organização de código.

O sistema permite gerenciar produtos, controlar entradas e saídas de estoque e registrar todo o histórico de movimentações, proporcionando uma visão completa do inventário em tempo real.

O projeto foi desenvolvido utilizando arquitetura **MVC (Model-View-Controller)** no backend e comunicação via API REST entre frontend e servidor.

---

# ✨ Funcionalidades

## 📦 Produtos

- Cadastro de produtos
- Edição de produtos
- Exclusão de produtos
- Cadastro de SKU
- Descrição do produto
- Categoria
- Preço
- Quantidade atual
- Quantidade mínima

---

## 📊 Dashboard

- Total de produtos cadastrados
- Total de itens em estoque
- Valor total do patrimônio
- Produtos abaixo do estoque mínimo

---

## 📈 Controle de Estoque

- Entrada de estoque
- Saída de estoque
- Validação de estoque insuficiente
- Atualização automática das quantidades

---

## 📝 Histórico

Cada movimentação registra:

- Produto
- SKU
- Tipo (Entrada/Saída)
- Quantidade
- Motivo
- Data
- Hora

---

# 🏗️ Arquitetura

O backend segue o padrão **MVC**, separando responsabilidades entre rotas, controladores e acesso ao banco.

```
Cliente
    │
    ▼
Routes
    │
    ▼
Controllers
    │
    ▼
Models
    │
    ▼
MySQL
```

---

# 📂 Estrutura do Projeto

```
controle-estoque/

│
├── backend/
│   │
│   ├── controllers/
│   │      movimentacoesController.js
│   │      produtosController.js
│   │
│   ├── middlewares/
│   │      validarProduto.js
│   │
│   ├── models/
│   │      movimentacaoModel.js
│   │      produtoModel.js
│   │
│   ├── routes/
│   │      movimentacoes.js
│   │      produtos.js
│   │
│   ├── db.js
│   └── server.js
│
├── frontend/
│   │
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── api.js
│
└── README.md
```

---

# 🗄️ Banco de Dados

## Tabela Produtos

| Campo | Tipo |
|--------|------|
| id | INT |
| sku | VARCHAR |
| nome | VARCHAR |
| categoria | VARCHAR |
| preco | DECIMAL |
| quantidade | INT |
| quantidade_minima | INT |
| descricao | TEXT |

---

## Tabela Movimentações

| Campo | Tipo |
|--------|------|
| id | INT |
| produto_id | INT |
| tipo | ENUM |
| quantidade | INT |
| motivo | VARCHAR |
| data_movimentacao | DATETIME |

---

# 🚀 Tecnologias

## Front-end

- HTML5
- CSS3
- JavaScript

## Back-end

- Node.js
- Express

## Banco de Dados

- MySQL

## Ferramentas

- Git
- GitHub
- VS Code

---

# ▶️ Como executar

## Clone o projeto

```bash
git clone https://github.com/miguelotth/sistema-controle-estoque.git
```

---

## Entre na pasta

```bash
cd sistema-controle-estoque
```

---

## Instale as dependências

```bash
npm install
```

---

## Configure o banco MySQL

Crie um banco de dados e ajuste as credenciais do arquivo:

```
backend/db.js
```

---

## Inicie o servidor

```bash
node server.js
```

ou

```bash
npm start
```

---

## Abra o Front-end

Basta abrir o arquivo:

```
index.html
```

ou utilizar uma extensão como **Live Server**.

---

# 📸 Demonstração

## Dashboard

<img src="./assets/dashboard.png">

---

## Cadastro

<img src="./assets/cadastro.png">

---

## Movimentação

<img src="./assets/movimentacao.png">

---

## Histórico

<img src="./assets/historico.png">

---

# 📌 Próximas melhorias

- Login de usuários
- JWT
- Docker
- Swagger
- Exportação em Excel
- Relatórios em PDF
- Dashboard com gráficos
- Controle de usuários e permissões
- Paginação
- Pesquisa avançada
- Logs de auditoria

---

# 🎯 Objetivos do projeto

- Aplicar arquitetura MVC
- Praticar integração Front-end e Back-end
- Desenvolver uma API REST
- Trabalhar com MySQL
- Utilizar boas práticas de organização de código
- Criar um projeto para portfólio

---

# 👨‍💻 Autor

**Miguel Othon**

[![GitHub](https://img.shields.io/badge/GitHub-miguelotth-181717?style=for-the-badge&logo=github)](https://github.com/miguelotth)

---

<div align="center">

### ⭐ Se este projeto foi útil, considere deixar uma estrela no repositório!

</div>