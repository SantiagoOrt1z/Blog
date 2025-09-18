import express from "express";
import bodyParser from "body-parser";

//Configuracion de express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Base de datos casera
const publicacionesAgregadas = [];

//Id casero
let publicacionId = 1;

app.get("/", (req, res) => {
  res.render("index.ejs", { publicaciones: publicacionesAgregadas });
});

app.get("/publicacion/:id", (req, res) => {
  const postId = req.params.id;
  const post = publicacionesAgregadas.find((p) => p.id == postId);

  if (post) {
    res.render("publicacion.ejs", { titulo: post.titulo, texto: post.texto });
  } else {
    res.status(404).send("Publicación no encontrada");
  }
});

app.post("/crear", (req, res) => {
  const publicacion = {
    titulo: req.body.titulo,
    texto: req.body.texto,
    id: publicacionId++,
  };
  publicacionesAgregadas.push(publicacion);

  res.redirect("/");
});

app.get("/crear", (req, res) => {
  res.render("crear.ejs");
});

app.listen(3000, () => {
  console.log("Servidor creado en el puerto 3000");
});
