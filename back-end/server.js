const express = require("express");
const cors = require("cors");

const movimentacoesRoutes = require("./routes/movimentacoes");
const produtosRoutes = require("./routes/produtos");

const app = express();

app.use(cors());
app.use(express.json());


app.use(produtosRoutes);
app.use(movimentacoesRoutes);


app.listen(3000, "127.0.0.1", () => {
    console.log("Servidor rodando na porta 3000");
});