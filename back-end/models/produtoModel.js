const db = require("../db");

exports.listarProdutos = (callback) => {

    db.query(
        "SELECT * FROM produtos",
        callback
    );

};

exports.criarProduto = (dados, callback) => {

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
            dados.sku,
            dados.nome,
            dados.categoria,
            dados.preco,
            dados.quantidade,
            dados.quantidade_minima,
            dados.descricao
        ],
        callback
    );

};

exports.atualizarProduto = (id, dados, callback) => {

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
            dados.sku,
            dados.nome,
            dados.categoria,
            dados.preco,
            dados.quantidade,
            dados.quantidade_minima,
            dados.descricao,
            id
        ],
        callback
    );

};

exports.movimentarProduto = (id, tipo, quantidade, motivo, callback) => {

    const qtd = Number(quantidade);

    db.query(
        "SELECT * FROM produtos WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                return callback(err);
            }

            if (results.length === 0) {
                return callback({ status: 404, erro: "Produto não encontrado" });
            }

            const produto = results[0];

            let novaQuantidade;

            if (tipo === "entrada") {
                novaQuantidade = produto.quantidade + qtd;
            } else {

                if (produto.quantidade < qtd) {
                    return callback({
                        status: 400,
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
                        return callback(err);
                    }

                    db.query(
                        `INSERT INTO movimentacoes
                        (produto_id, tipo, quantidade, motivo)
                        VALUES (?, ?, ?, ?)`,
                        [id, tipo, qtd, motivo],
                        (err, result) => {

                            if (err) {
                                return callback(err);
                            }

                            callback(null, {
                                mensagem: "Movimentação registrada",
                                quantidade: novaQuantidade
                            });

                        }
                    );

                }
            );

        }
    );

};

exports.excluirProduto = (id, callback) => {

    db.query(
        "DELETE FROM movimentacoes WHERE produto_id = ?",
        [id],
        (err) => {

            if (err) {
                return callback(err);
            }

            db.query(
                "DELETE FROM produtos WHERE id = ?",
                [id],
                callback
            );

        }
    );

};

exports.excluirProduto = (id, callback) => {

    db.query(
        "DELETE FROM produtos WHERE id = ?",
        [id],
        callback
    );

};