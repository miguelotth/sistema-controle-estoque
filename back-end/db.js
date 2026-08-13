const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "PASSWORD",
    database: "estoque"
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar:", err);
        return;
    }

    console.log("Banco conectado!");
});

module.exports = db;
