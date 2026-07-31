const express = require("express");
const produtosController = require("../controllers/produtosController");
const router = express.Router();
const validarProduto = require("../middlewares/validarProduto");

router.get("/produtos", produtosController.listarProdutos);

router.post(
    "/produtos",
    validarProduto,
    produtosController.criarProduto
);

router.put("/produtos/:id", produtosController.atualizarProduto);

router.delete("/produtos/:id", produtosController.excluirProduto);

router.put("/produtos/:id/movimentar", produtosController.movimentarProduto);

module.exports = router;