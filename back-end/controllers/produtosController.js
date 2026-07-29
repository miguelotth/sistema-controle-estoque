const produtoModel = require("../models/produtoModel");

exports.listarProdutos = (req, res) => {

    produtoModel.listarProdutos((err, results) => {

        if (err) {
            return res.status(500).json({
                erro: "Erro ao buscar produtos"
            });
        }

        res.json(results);

    });

};

exports.criarProduto = (req, res) => {

        const {
            sku,
            nome,
            categoria,
            preco,
            quantidade,
            quantidade_minima,
            descricao
        } = req.body;

        produtoModel.criarProduto(
        {
            sku,
            nome,
            categoria,
            preco,
            quantidade,
            quantidade_minima,
            descricao
        },
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
};

exports.atualizarProduto = (req, res) => {

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

        produtoModel.atualizarProduto(
        id,
        {
            sku,
            nome,
            categoria,
            preco,
            quantidade,
            quantidade_minima,
            descricao
        },
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

};

exports.excluirProduto = (req, res) => {

    const { id } = req.params;

    produtoModel.excluirProduto(id, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                erro: "Erro ao excluir produto"
            });
        }

        res.json({
            mensagem: "Produto excluído com sucesso"
        });

    });

};

exports.movimentarProduto = (req, res) => {

    const { id } = req.params;
    const { tipo, quantidade, motivo } = req.body;

    produtoModel.movimentarProduto(
        id,
        tipo,
        quantidade,
        motivo,
        (err, resultado) => {

            if (err) {

                if (err.status) {
                    return res.status(err.status).json({
                        erro: err.erro
                    });
                }

                console.error(err);

                return res.status(500).json({
                    erro: "Erro ao movimentar produto"
                });

            }

            res.json(resultado);

        }
    );

};