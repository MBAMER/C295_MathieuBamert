// Importation du module express pour gérer les routes et les requêtes HTTP
import express from "express";
const app = express(); // Création de l'application express
app.use(express.json()); // Middleware pour parser le corps des requêtes HTTP au format JSON

const port = 3000; // Port d'écoute de l'application

// Importation de la connexion à la base de données et de la fonction d'initialisation
import { sequelize, initDb } from "./db/sequelize.mjs";

// Tentative de connexion à la base de données avec Sequelize
sequelize
  .authenticate() // Vérifie la connexion à la base de données
  .then(
    (_) => console.log("La connexion à la base de données a bien été établie") // Si la connexion est réussie
  )
  .catch((error) => console.error("Impossible de se connecter à la DB")); // En cas d'échec de la connexion

// Initialisation de la base de données (création/synchronisation des tables)
initDb();

// Route d'accueil de l'API
app.get("/", (req, res) => {
  res.send("API REST of self service machine !"); // Message de bienvenue
});

// Route redirigeant l'utilisateur vers l'accueil
app.get("/api/", (req, res) => {
  res.redirect(`http://localhost:${port}/`); // Redirige vers la racine de l'API
});

// Importation du routeur pour la gestion de la connexion
import { loginRouter } from "./routes/login.mjs";
// Utilisation du routeur pour les connexions sur /api/login
app.use("/api/login", loginRouter);

// Importation du routeur pour la gestion des produits
import { productsRouter } from "./routes/products.mjs";
// Utilisation du routeur pour les produits sur /api/products
app.use("/api/products", productsRouter);

// Si aucune route ne correspond à l'URL demandée, cette route gère les erreurs 404
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json(message); // Envoi d'une réponse 404 avec un message d'erreur
});

// Lancement du serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`); // Affiche un message dans la console quand le serveur est lancé
});
