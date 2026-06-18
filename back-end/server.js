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

app.delete("/produtos/:id", (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM produtos WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao excluir produto"
                });
            }

            res.json({
                mensagem: "Produto excluído com sucesso"
            });

        }
    );

});

app.put("/produtos/:id/movimentar", (req, res) => {

    const { id } = req.params;
    const { tipo, quantidade } = req.body;

    db.query(
        "SELECT quantidade FROM produtos WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao buscar produto"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    erro: "Produto não encontrado"
                });
            }

            let estoqueAtual = results[0].quantidade;
            let novoEstoque;

            if (tipo === "entrada") {
                novoEstoque = estoqueAtual + Number(quantidade);
            } else {
                novoEstoque = estoqueAtual - Number(quantidade);

                if (novoEstoque < 0) {
                    return res.status(400).json({
                        erro: "Estoque insuficiente"
                    });
                }
            }

            db.query(
                "UPDATE produtos SET quantidade = ? WHERE id = ?",
                [novoEstoque, id],
                (err) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            erro: "Erro ao atualizar estoque"
                        });
                    }

                    res.json({
                        mensagem: "Movimentação realizada",
                        quantidade: novoEstoque
                    });

                }
            );

        }
    );

});

app.put("/produtos/:id", (req, res) => {

    const { id } = req.params;

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
        UPDATE produtos
        SET
            sku = ?,
            nome = ?,
            categoria = ?,
            preco = ?,
            quantidade = ?,
            quantidade_minima = ?,
            descricao = ?
        WHERE id = ?
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
            descricao,
            id
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao atualizar produto"
                });
            }

            res.json({
                mensagem: "Produto atualizado com sucesso"
            });

        }
    );
});

app.put("/produtos/:id", (req, res) => {

    const { id } = req.params;

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
        UPDATE produtos
        SET
            sku = ?,
            nome = ?,
            categoria = ?,
            preco = ?,
            quantidade = ?,
            quantidade_minima = ?,
            descricao = ?
        WHERE id = ?
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
            descricao,
            id
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao atualizar produto"
                });
            }

            res.json({
                mensagem: "Produto atualizado com sucesso"
            });

        }
    );
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});