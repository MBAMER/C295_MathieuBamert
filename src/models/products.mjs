// https://sequelize.org/docs/v7/models/data-types/
// Définition du modèle "Product" avec Sequelize
const ProductModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Product", // Le nom de la table sera "Product"
    {
      // Définition du champ "id" qui est la clé primaire de la table
      id: {
        type: DataTypes.INTEGER, // Type de données : entier
        primaryKey: true, // Définit ce champ comme clé primaire
        autoIncrement: true, // L'id sera auto-incrémenté à chaque insertion
      },
      // Définition du champ "name" pour le nom du produit
      name: {
        type: DataTypes.STRING, // Type de données : chaîne de caractères
        allowNull: false, // Ce champ ne peut pas être nul
        unique: {
          // Le nom doit être unique dans la base de données
          msg: "Ce nom est déjà pris.", // Message d'erreur personnalisé
        },
        validate: {
          // Validation des données d'entrée pour ce champ
          is: {
            args: /^[A-Za-z\s]*$/, // Expression régulière : accepte uniquement des lettres et des espaces
            msg: "Seules les lettres et les espaces sont autorisées.", // Message d'erreur personnalisé
          },
          notEmpty: {
            msg: "Le nom ne peut pas être vide.", // Le champ ne peut pas être vide
          },
          notNull: {
            msg: "Le nom est une propriété obligatoire.", // Le champ ne peut pas être nul
          },
        },
      },
      // Définition du champ "price" pour le prix du produit
      price: {
        type: DataTypes.FLOAT, // Type de données : nombre à virgule flottante
        allowNull: false, // Ce champ ne peut pas être nul
        validate: {
          // Validation des données d'entrée pour ce champ
          isFloat: {
            msg: "Utilisez uniquement des nombres pour le prix.", // Le prix doit être un nombre valide
          },
          notEmpty: {
            msg: "Le prix ne peut pas être vide.", // Le champ ne peut pas être vide
          },
          notNull: {
            msg: "Le prix est une propriété obligatoire.", // Le champ ne peut pas être nul
          },
          min: {
            args: [1.0], // Le prix doit être supérieur à 1$
            msg: "Le prix doit être supérieur à 1$.", // Message d'erreur personnalisé
          },
          max: {
            args: [1000.0], // Le prix doit être inférieur à 1000$
            msg: "Le prix doit être inférieur à 1000$.", // Message d'erreur personnalisé
          },
        },
      },
    },
    {
      timestamps: true, // Active les champs de gestion de timestamp (createdAt, updatedAt)
      createdAt: "created", // Renomme le champ createdAt en "created"
      updatedAt: false, // Désactive le champ updatedAt (ne sera pas mis à jour automatiquement)
    }
  );
};

export { ProductModel };
