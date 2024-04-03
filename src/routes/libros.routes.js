const express = require("express");
const router = express.Router();
const Libro = require("../models/libros.model");

// MIDDLEWARE (DE AUTENTICACION)

const autenticarLibro = async (req, res, next) => {
  let libro;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID no es valido ",
    });
  }

  try {
    libro = await Libro.findById(id);
    if (!libro) {
      return res.status(404).json({
        message: "El libro no fue encontrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.libro = libro;
  next();
};

// Obtener todos los libros [GET ALL]

router.get("/", async (req, res) => {
  try {
    const todosLibros = await Libro.find();
    console.log(todosLibros, "Traje todos los libros!");
    if (todosLibros.length === 0) {
      return res.status(204).json({});
    }
    res.json(todosLibros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un libro por ID [GET ONE]

router.get("/:id", autenticarLibro, async (req, res) => {
  res.json(res.libro);
  console.log(res.libro, "Este es el libro que buscabas!");
});

// Crear un nuevo libro (recurso) [POST]

router.post("/", async (req, res) => {
  const { titulo, autor, genero, fecha_de_publicacion } = req?.body;
  if (!titulo || !autor || !genero || !fecha_de_publicacion) {
    return res.status(400).json({
      message:
        "Los campos titulo, autor, genero y fecha_de_publicacion son obligatorios",
    });
  }

  const libroVacio = new Libro({
    titulo,
    autor,
    genero,
    fecha_de_publicacion,
  });

  try {
    const nuevoLibro = await libroVacio.save();
    console.log(nuevoLibro);
    console.log("Libro creado con exito!");
    res.status(201).json({ nuevoLibro });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Modificar libro por ID [PUT]

router.put("/:id", autenticarLibro, async (req, res) => {
  try {
    const libro = res.libro;
    libro.titulo = req.body.titulo || libro.titulo;
    libro.autor = req.body.autor || libro.autor;
    libro.genero = req.body.genero || libro.genero;
    libro.fecha_de_publicacion =
      req.body.fecha_de_publicacion || libro.fecha_de_publicacion;

    const libroActualizado = await libro.save();
    res.json(libroActualizado);
    console.log("El libro se actualizo con exito!");
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Modificar libro por ID [PATCH]

router.patch("/:id", autenticarLibro, async (req, res) => {
  if (
    !req.body.titulo &&
    !req.body.autor &&
    !req.body.genero &&
    !req.body.fecha_de_publicacion
  ) {
    res.status(400).json({
      message:
        "al menos uno de estos debe ser enviado: titulo,autor,genero o fecha_de_publicacion",
    });
  }

  try {
    const libro = res.libro;
    libro.titulo = req.body.titulo || libro.titulo;
    libro.autor = req.body.autor || libro.autor;
    libro.genero = req.body.genero || libro.genero;
    libro.fecha_de_publicacion =
      req.body.fecha_de_publicacion || libro.fecha_de_publicacion;

    const libroActualizado = await libro.save();
    res.json(libroActualizado);
    console.log("El libro se actualizo con exito!");
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Eliminar libro (DELETE)

router.delete("/:id", autenticarLibro, async (req, res) => {
  try {
    const libro = res.libro;
    await libro.deleteOne({
      _id: libro._id,
    });
    res.json({
      message: `El libro ${libro.titulo} fue eliminado correctamente`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
