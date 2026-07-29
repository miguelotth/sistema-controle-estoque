const express = require("express");
const movimentacoesController = require("../controllers/movimentacoesController");

const router = express.Router();

router.get(
    "/movimentacoes",
    movimentacoesController.listarMovimentacoes
);

module.exports = router;