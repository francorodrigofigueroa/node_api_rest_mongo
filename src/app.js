const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { config } = require("dotenv");
config();

const librosRutas = require("./routes/libros.routes");

// usamos express para los middlewares
const app = express();
app.use(bodyParser.json()); //parseador de bodies

// aca conectaremos la base de datos
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const db = mongoose.connection;

app.use("/libros", librosRutas);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
