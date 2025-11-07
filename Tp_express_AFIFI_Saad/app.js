const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();

// modele utilisateur avec une methode de comparaison des mots de passes
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.methods.comparePassword = async function (password) {
    return password === this.password;
};

// creation du modele a partir du schema

const User = mongoose.model("User", userSchema);

// Configuration Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/express_auth_tp")
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error(err));

//  Middlewares 
app.use(session({
  secret: "saad",
  resave: false,
  saveUninitialized: false
}));
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());
app.use(passport.session());

//  Configuration de Passport 
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: "Utilisateur non trouvé" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return done(null, false, { message: "Mot de passe incorrect" });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Routes

app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

// Inscription
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.send("Erreur : utilisateur déjà existant");
  }
});

// Connexion
app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
  })
);

// Protection des routes
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Liste des livres (visible uniquement si connecté)
const books = [
  { title: "L’Alchimiste", author: "Paulo Coelho" },
  { title: "1984", author: "George Orwell" },
  { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry" }
];

app.get("/books", isAuthenticated, (req, res) => {
  res.render("books", { user: req.user, books });
});

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login"));
});

app.listen(9000, () => console.log("serveur lancé : port 9000"));