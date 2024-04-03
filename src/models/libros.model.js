const mongoose = require("mongoose");

const esquemaLibro = new mongoose.Schema({
  titulo: String,
  autor: String,
  genero: String,
  fecha_de_publicacion: String,
});

module.exports = mongoose.model("Libro", esquemaLibro);
