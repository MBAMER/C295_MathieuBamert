// Importation des modules nécessaires
import express from "express"; // Framework Express pour la gestion des routes
import { Product } from "../db/sequelize.mjs"; // Le modèle Product pour interagir avec la base de données
import { success } from "./helper.mjs"; // Fonction helper pour structurer la réponse
import { ValidationError, Op } from "sequelize"; // Sequelize : ValidationError pour gérer les erreurs de validation, Op pour les opérateurs de requêtes
const productsRouter = express(); // Création d'un routeur express pour gérer les routes liées aux produits
import { auth } from "../auth/auth.mjs"; // Middleware d'authentification pour sécuriser certaines routes

// Route GET pour récupérer les produits avec possibilité de recherche par nom
productsRouter.get("/", auth, (req, res) => {
  // Si un terme de recherche (name) est fourni dans la requête
  if (req.query.name) {
    // Validation : le nom de la recherche doit avoir au moins 2 caractères
    if (req.query.name.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }

    // Limite du nombre de produits à retourner, par défaut 3
    let limit = 3;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    // Recherche de produits dont le nom correspond au terme de recherche
    return Product.findAndCountAll({
      where: { name: { [Op.like]: `%${req.query.name}%` } }, // Op.like pour la recherche par nom
      order: ["name"], // Tri des résultats par nom
      limit: limit, // Limitation du nombre de résultats
    }).then((products) => {
      const message = `Il y a ${products.count} produits qui correspondent au terme de la recherche`;
      res.json(success(message, products)); // Envoi de la réponse avec les produits et un message
    });
  }

  // Si aucun terme de recherche, on récupère tous les produits triés par nom
  Product.findAll({ order: ["name"] })
    .then((products) => {
      const message = "La liste des produits a bien été récupérée.";
      res.json(success(message, products)); // Réponse avec la liste des produits
    })
    .catch((error) => {
      const message =
        "La liste des produits n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error }); // Gestion des erreurs en cas de problème de récupération
    });
});

// Route GET pour récupérer un produit spécifique par ID
productsRouter.get("/:id", (req, res) => {
  Product.findByPk(req.params.id) // Recherche du produit par son ID
    .then((product) => {
      if (product === null) {
        // Si le produit n'existe pas
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message }); // Retourne une erreur 404 si le produit n'est pas trouvé
      }
      const message = `Le produit dont l'id vaut ${product.id} a bien été récupéré.`;
      res.json(success(message, product)); // Retourne le produit avec un message de succès
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error }); // Gestion des erreurs en cas de problème
    });
});

// Route POST pour ajouter un nouveau produit
productsRouter.post("/", (req, res) => {
  Product.create(req.body) // Création d'un nouveau produit avec les données envoyées dans le corps de la requête
    .then((createdProduct) => {
      const message = `Le produit ${createdProduct.name} a bien été créé !`;
      res.json(success(message, createdProduct)); // Retourne une réponse avec le produit créé et un message de succès
    })
    .catch((error) => {
      // Si une erreur de validation survient (par exemple si des données manquent)
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error }); // Erreur 400 pour validation échouée
      }
      const message =
        "Le produit n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error }); // Erreur générique en cas de problème lors de la création
    });
});

// Route DELETE pour supprimer un produit par ID
productsRouter.delete("/:id", (req, res) => {
  Product.findByPk(req.params.id) // Recherche du produit par ID
    .then((deletedProduct) => {
      if (deletedProduct === null) {
        // Si le produit n'existe pas
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message }); // Retourne une erreur 404 si le produit n'est pas trouvé
      }
      // Suppression du produit
      return Product.destroy({
        where: { id: deletedProduct.id },
      }).then((_) => {
        const message = `Le produit ${deletedProduct.name} a bien été supprimé !`;
        res.json(success(message, deletedProduct)); // Retourne un message de succès avec le produit supprimé
      });
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error }); // Gestion des erreurs en cas de problème lors de la suppression
    });
});

// Route PUT pour mettre à jour un produit par ID
productsRouter.put("/:id", (req, res) => {
  const productId = req.params.id; // Récupération de l'ID du produit à mettre à jour
  Product.update(req.body, { where: { id: productId } }) // Mise à jour du produit avec les nouvelles données
    .then((_) => {
      return Product.findByPk(productId).then((updatedProduct) => {
        if (updatedProduct === null) {
          // Si le produit n'existe pas
          const message =
            "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message }); // Retourne une erreur 404 si le produit n'est pas trouvé
        }
        const message = `Le produit ${updatedProduct.name} dont l'id vaut ${updatedProduct.id} a été mis à jour avec succès`;
        res.json(success(message, updatedProduct)); // Retourne un message de succès avec le produit mis à jour
      });
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error }); // Gestion des erreurs en cas de problème lors de la mise à jour
    });
});

// Exportation du routeur pour l'utiliser dans l'application
export { productsRouter };
