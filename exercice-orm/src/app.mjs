import { Op } from "sequelize";
import { sequelize, initDb, Product } from "./db/sequelize.mjs";

(async () => {
  try {
    // Authentification avec Sequelize
    await sequelize.authenticate();
    console.log("La connexion à la base de données a bien été établie");

    // Initialisation de la base de données
    await initDb();
    console.log("La base de données a bien été initialisée");

    // Requete 1 :
    // SELECT *
    // FROM Product;

    // A compléter
    const products = await Product.findAll();
    console.log("-- Requete 1 --");
    console.log(
      "Produits trouvés :",
      products.map((p) => p.toJSON())
    );

    // Requete 2 :
    // SELECT *
    // FROM Product
    // WHERE id = 1;
    const product = await Product.findByPk(1);
    console.log("-- Requete 2 --");
    console.log("Produit trouvé :", product.toJSON());

    // Requete 3 :
    // SELECT *
    // FROM t_product
    // WHERE name = "Fries";

    const products_query3 = await Product.findAll({
      where: { name: "Fries" },
    });
    console.log("-- Requete 3 --");
    console.log(products_query3.map((p) => p.toJSON()));

    // Requete 4 :
    // SELECT *
    // FROM Products
    // WHERE price > 3;

    const products_query4 = await Product.findAll({
      where: { price: { [Op.gt]: 3 } },
    });
    console.log("-- Requete 4 --");
    console.log(products_query4.map((p) => p.toJSON()));

    // Requete 5 :
    // SELECT name, price
    // FROM Products;
    const products_query5 = await Product.findAll({
      attributes: ["name", "price"],
    });
    console.log("-- Requete 5 --");
    console.log(products_query5.map((p) => p.toJSON()));

    // Requete 6 :
    // SELECT name, price
    // FROM Products
    // ORDER BY price DESC;
    const products_query6 = await Product.findAll({
      attributes: ["name", "price"], // Sélectionner uniquement les colonnes name et price
      order: [["price", "DESC"]], // Trier par price en ordre décroissant
    });

    console.log("-- Requete 6 --");
    console.log(products_query6.map((p) => p.toJSON())); // Afficher les résultats

    // Requete 7 :
    // SELECT *
    // FROM Products
    // WHERE name LIKE '%c%';
    const products_query7 = await Product.findAll({
      where: {
        name: {
          [Op.like]: "%c%",
        },
      },
    });

    console.log("-- Requete 7 --");
    console.log(products_query7.map((p) => p.toJSON())); // Afficher les résultats

    // Requete 8 :
    // SELECT *
    // FROM Products
    // WHERE name LIKE 'Mc%'
    // AND price > 3;
    // ORDER BY name, price DESC
    console.log("-- Requete 8 --");
    const products_query8 = await Product.findAll({
      where: {
        name: {
          [Op.like]: "Mc%", // Recherche les noms qui commencent par "Mc"
        },
        price: {
          [Op.gt]: 3, // Filtre les produits avec un prix supérieur à 3
        },
      },
      order: [
        ["name", "ASC"], // Trie par nom (ordre croissant par défaut)
        ["price", "DESC"], // Trie ensuite par prix (ordre décroissant)
      ],
    });
    console.log(products_query8.map((p) => p.toJSON())); // Afficher les résultats

    // Requete 9 :
    // Rechercher le produit le moins cher
    // SELECT *
    // FROM Products
    // ORDER BY price
    // LIMIT 1;
    console.log("-- Requete 9 --");
    const cheapestProduct = await Product.findOne({
      order: [["price", "ASC"]],
    });
    console.log(cheapestProduct.toJSON());

    // Requete 10 :
    // INSERT INTO Products (name, price, created)
    // VALUES ('Mc Deluxe', 9.99, '2025-01-01');
    console.log("-- Requete 10 --");
    const products_query10 = await Product.create({
      name: "Mc Deluxe",
      price: 9.99,
      created: "2025-01-01",
    });
    console.log(products_query10.toJSON()); // Afficher les résultats

    // Requete 11 :
    // UPDATE Products
    // SET price = 5.99
    // WHERE id = 1;
    console.log("-- Requete 11 --");
    const products_query11 = await Product.update(
      { price: 25.99 },
      { where: { id: 1 } }
    );
    console.log(products_query11); // Afficher les résultats

    // Requete 12 :
    // DELETE FROM Products
    // WHERE price < 3;
    const products_query12 = await Product.destroy({
      where: { price: { [Op.lt]: 3 } },
    });
    console.log("-- Requete 12 --");
    console.log(products_query12); // Afficher les résultats

    //
  } catch (error) {
    console.error("Erreur :", error);
  }
})();
