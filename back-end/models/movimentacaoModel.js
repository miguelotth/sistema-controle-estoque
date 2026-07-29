const db = require("../db");

exports.listarMovimentacoes = (callback) => {

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

    db.query(sql, callback);

};