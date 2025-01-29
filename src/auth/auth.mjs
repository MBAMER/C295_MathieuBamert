import jwt from "jsonwebtoken"; // Importation du module jsonwebtoken pour gérer les tokens JWT
import bcrypt from "bcrypt"; // Importation de bcrypt pour le hachage des mots de passe (non utilisé ici mais souvent utilisé avec l'authentification)
import { privateKey } from "./private_key.mjs"; // Importation de la clé privée pour la vérification du token

// Middleware d'authentification
const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization; // Récupération de l'en-tête Authorization

  if (!authorizationHeader) {
    // Vérification de l'existence du token dans les en-têtes de la requête
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message }); // Retourne une erreur 401 si aucun token n'est fourni
  } else {
    const token = authorizationHeader.split(" ")[1]; // Extraction du token (format "Bearer token")

    // Vérification et décodage du token JWT
    jwt.verify(token, privateKey, (error, decodedToken) => {
      if (error) {
        // En cas d'erreur lors de la vérification du token
        const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
        return res.status(401).json({ message, data: error }); // Retourne une erreur 401 avec le détail de l'erreur
      }

      const userId = decodedToken.userId; // Récupération de l'identifiant utilisateur depuis le token

      if (req.body.userId && req.body.userId !== userId) {
        // Vérification que l'ID utilisateur fourni dans le corps de la requête correspond bien à celui du token
        const message = `L'identifiant de l'utilisateur est invalide`;
        return res.status(401).json({ message }); // Retourne une erreur 401 si l'ID ne correspond pas
      } else {
        next(); // Passe au middleware ou au contrôleur suivant si l'authentification est valide
      }
    });
  }
};

export { auth }; // Exportation du middleware pour l'utiliser dans d'autres fichiers
