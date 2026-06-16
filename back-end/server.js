const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/produtos", (req, res) => {

    console.log("Consultando MySQL...");

    db.query(
        "SELECT * FROM produtos",
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao buscar produtos"
                });
            }

            res.json(results);
        }
    );

});

app.post("/produtos", (req, res) => {

    const {
        sku,
        nome,
        categoria,
        preco,
        quantidade,
        quantidade_minima,
        descricao
    } = req.body;

    const sql = `
        INSERT INTO produtos
        (
            sku,
            nome,
            categoria,
            preco,
            quantidade,
            quantidade_minima,
            descricao
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            sku,
            nome,
            categoria,
            preco,
            quantidade,
            quantidade_minima,
            descricao
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao cadastrar produto"
                });
            }

            res.status(201).json({
                mensagem: "Produto cadastrado",
                id: result.insertId
            });

        }
    );

});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});