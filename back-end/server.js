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


app.put("/produtos/:id/movimentar", (req, res) => {

    console.log("=== PUT MOVIMENTAR ===");
    console.log(req.params);
    console.log(req.body);

    const { id } = req.params;
    const { tipo, quantidade, motivo } = req.body;
    const qtd = Number(quantidade);

    db.query(
        "SELECT * FROM produtos WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ erro: "Erro ao buscar produto" });
            }

            if (results.length === 0) {
                return res.status(404).json({ erro: "Produto não encontrado" });
            }

            const produto = results[0];

            let novaQuantidade;

            if (tipo === "entrada") {
                novaQuantidade = produto.quantidade + qtd;
            } else {
                if (produto.quantidade < qtd) {
                    return res.status(400).json({
                        erro: "Estoque insuficiente"
                    });
                }

                novaQuantidade = produto.quantidade - qtd;
            }

            db.query(
                "UPDATE produtos SET quantidade = ? WHERE id = ?",
                [novaQuantidade, id],
                (err) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            erro: "Erro ao atualizar estoque"
                        });
                    }

                    console.log("Inserindo movimentação...");
                    console.log(id, tipo, qtd, motivo);

                    db.query(
                        `INSERT INTO movimentacoes
                        (produto_id, tipo, quantidade, motivo)
                        VALUES (?, ?, ?, ?)`,
                        [id, tipo, qtd, motivo],
                        (err, result) => {

                            if (err) {
                                console.error("ERRO INSERT:");
                                console.error(err);
                                return res.status(500).json({
                                    erro: "Erro ao registrar movimentação"
                                });
                            }

                            console.log("Movimentação salva!");
                            console.log(result);

                            res.json({
                                mensagem: "Movimentação registrada",
                                quantidade: novaQuantidade
                            });

                        }
                    );

                }
            );

        }
    );

});


app.get("/movimentacoes", (req, res) => {
    const sql = `
        SELECT
            m.id,
            m.produto_id,
            p.nome,
            p.sku,
            m.tipo,
            m.quantidade,
            m.motivo,
            m.data_movimentacao
        FROM movimentacoes m
        INNER JOIN produtos p
            ON p.id = m.produto_id
        ORDER BY m.data_movimentacao DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                erro: "Erro ao buscar movimentações"
            });
        }

        res.json(results);

    });

});

app.listen(3000, "127.0.0.1", () => {
    console.log("Servidor rodando na porta 3000");
});