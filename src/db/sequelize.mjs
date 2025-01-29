// Importation des modules nécessaires
import { Sequelize, DataTypes } from "sequelize"; // Sequelize pour gérer la base de données et DataTypes pour définir les types des champs
import { ProductModel } from "../models/products.mjs"; // Modèle pour la table des produits
import { UserModel } from "../models/userModel.mjs"; // Modèle pour la table des utilisateurs
import bcrypt from "bcrypt"; // bcrypt pour hasher les mots de passe des utilisateurs de manière sécurisée

// Création de la connexion à la base de données
const sequelize = new Sequelize(
  "db_products", // Nom de la base de données à utiliser
  "root", // Nom d'utilisateur pour la connexion à la base de données
  "root", // Mot de passe de l'utilisateur
  {
    host: "localhost", // Hôte de la base de données (en local dans ce cas)
    port: "6033", // Port utilisé pour la connexion à MySQL
    dialect: "mysql", // Type de base de données (MySQL ici)
    logging: false, // Désactive l'affichage des requêtes SQL dans la console
  }
);

// Importation des données fictives des produits depuis le fichier mock-product.mjs
import { products } from "./mock-product.mjs"; // Liste de produits à insérer dans la base de données

// Définition des modèles pour les tables Product et User
const Product = ProductModel(sequelize, DataTypes); // Crée le modèle pour les produits en fonction du modèle Sequelize et des types de données
const User = UserModel(sequelize, DataTypes); // Crée le modèle pour les utilisateurs

// Fonction pour initialiser la base de données en synchronisant les modèles
let initDb = () => {
  return sequelize
    .sync({ force: true }) // Force la synchronisation des modèles, ce qui supprime les données existantes
    .then((_) => {
      // Une fois la base synchronisée, on importe les produits et utilisateurs fictifs
      importProducts(); // Appelle la fonction d'importation des produits
      importUsers(); // Appelle la fonction d'importation des utilisateurs
      console.log("La base de données db_products a bien été synchronisée"); // Affiche un message de confirmation
    });
};

// Fonction pour importer les produits fictifs dans la base de données
const importProducts = () => {
  // Parcourt chaque produit du tableau 'products' et l'insère dans la table Product
  products.map((product) => {
    Product.create({
      name: product.name, // Nom du produit
      price: product.price, // Prix du produit
    }).then((product) => console.log(product.toJSON())); // Affiche les informations du produit créé en JSON dans la console
  });
};

// Fonction pour importer un utilisateur fictif dans la base de données
const importUsers = () => {
  // Utilise bcrypt pour hacher le mot de passe de l'utilisateur avant de l'enregistrer
  bcrypt
    .hash("etml", 10) // "etml" est le mot de passe à hacher avec un sel (ici 10 tours pour le hachage)
    .then((hash) =>
      User.create({
        username: "etml", // Nom d'utilisateur
        password: hash, // Mot de passe haché
      })
    )
    .then((user) => console.log(user.toJSON())); // Affiche les informations de l'utilisateur créé en JSON dans la console
};

// Export des éléments nécessaires pour être utilisés dans d'autres parties de l'application
export { sequelize, initDb, Product, User };
