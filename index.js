import express from "express";
import bodyParser from "body-parser";
import { insertPost, selectPostByUser, updatePost, deletePost } from "./models/postModel.js";
import { selectUserByEmail, insertUser } from "./models/userModel.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let login = false;
let user = {
  id: 0,
  email: "",
  username: "",
  password: ""
};

app.use((req, res, next) => {
  res.locals.login = login;
  res.locals.user = user;
  next();
});

app.get("/", async (req, res) => {
  if (login) {
    const publicacionesAgregadas = await selectPostByUser(user.id);
    res.render("index.ejs", { publicaciones: publicacionesAgregadas });
  } else {
    res.redirect("/login");
  }
});

app.get("/crear", (req, res) => {
  res.render("crear.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await selectUserByEmail(email);

  if (!result) {
    res.status(500).send("Usuario no encontrado");
  } else if (result.password === password) {
    login = true;
    user.id = result.id
    user.email = result.email;
    user.password = result.password;
    user.username = result.username;

    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const result = await insertUser(username, email, password);

  if (result) {
    login = true;
    res.redirect("/");
  } else {
    res.redirect("/register");
  }
});

app.get("/logout", (req, res) => {
  login = false;
  user = { id: 0, email: "", username: "", password: "" };
  res.redirect("/");
});

app.get("/publicacion/:id", async (req, res) => {
  const postId = req.params.id;
  const publicaciones = await selectPostByUser(user.id);
  const post = publicaciones.find((p) => p.id == postId);

  if (post) {
    res.render("publicacion.ejs", { titulo: post.title, texto: post.content });
  } else {
    res.status(404).send("Publicación no encontrada");
  }
});

app.post("/crear", async (req, res) => {
  const userId = user.id
  const { title, content } = req.body;
  await insertPost(userId, title, content);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Servidor creado en el puerto 3000");
});
