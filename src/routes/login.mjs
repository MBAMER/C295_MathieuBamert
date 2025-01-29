// Importation des modules nécessaires
import express from "express"; // Framework pour créer une application web avec Node.js
import bcrypt from "bcrypt"; // Librairie pour le hachage des mots de passe
import jwt from "jsonwebtoken"; // Librairie pour générer et vérifier les tokens JWT (JSON Web Token)
import { User } from "../db/sequelize.mjs"; // Importation du modèle User depuis la base de données
import { privateKey } from "../auth/private_key.mjs"; // Clé privée utilisée pour signer les tokens JWT
import { auth } from "../auth/auth.mjs"; // Middleware d'authentification (probablement non utilisé ici mais importé pour d'autres routes)

const loginRouter = express(); // Création d'un routeur express pour gérer la route de connexion

// Route POST pour la connexion de l'utilisateur
loginRouter.post("/", (req, res) => {
  // Recherche de l'utilisateur dans la base de données en fonction du nom d'utilisateur envoyé dans la requête
  User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      // Si l'utilisateur n'existe pas dans la base de données
      if (!user) {
        const message = `L'utilisateur demandé n'existe pas`; // Message d'erreur
        return res.status(404).json({ message }); // Renvoie une erreur 404 avec un message
      }

      // Comparaison du mot de passe envoyé avec le mot de passe haché stocké dans la base de données
      bcrypt
        .compare(req.body.password, user.password) // compare le mot de passe envoyé avec celui de la base
        .then((isPasswordValid) => {
          // Si le mot de passe est invalide
          if (!isPasswordValid) {
            const message = `Le mot de passe est incorrecte.`; // Message d'erreur
            return res.status(401).json({ message }); // Renvoie une erreur 401 pour mot de passe incorrect
          } else {
            // Si le mot de passe est correct, création d'un JWT
            const token = jwt.sign({ userId: user.id }, privateKey, {
              expiresIn: "1y", // Le token expirera après 1 an
            });

            // Message de succès et renvoi des données de l'utilisateur et du token JWT
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token }); // Renvoie la réponse avec l'utilisateur et le token
          }
        });
    })
    .catch((error) => {
      // En cas d'erreur (ex : problème de base de données)
      const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants`; // Message d'erreur générique
      return res.json({ message, data: error }); // Renvoie l'erreur avec un message d'erreur
    });
});

// Exportation du routeur pour qu'il soit utilisé dans l'application
export { loginRouter };
