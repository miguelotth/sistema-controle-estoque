module.exports = (req, res, next) => {

    const {
        sku,
        nome,
        categoria,
        preco,
        quantidade,
        quantidade_minima
    } = req.body;


    if (!sku || !sku.trim()) {
        return res.status(400).json({
            erro: "O SKU é obrigatório."
        });
    }


    if (!nome || !nome.trim()) {
        return res.status(400).json({
            erro: "O nome é obrigatório."
        });
    }


    if (!categoria || !categoria.trim()) {
        return res.status(400).json({
            erro: "A categoria é obrigatória."
        });
    }


    if (Number(preco) < 0) {
        return res.status(400).json({
            erro: "O preço não pode ser negativo."
        });
    }


    if (Number(quantidade) < 0) {
        return res.status(400).json({
            erro: "A quantidade não pode ser negativa."
        });
    }


    if (Number(quantidade_minima) < 0) {
        return res.status(400).json({
            erro: "A quantidade mínima não pode ser negativa."
        });
    }


    next();

};
