const movimentacaoModel = require("../models/movimentacaoModel");

exports.listarMovimentacoes = (req, res) => {

    movimentacaoModel.listarMovimentacoes((err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                erro: "Erro ao buscar movimentações"
            });
        }

        res.json(results);

    });

};