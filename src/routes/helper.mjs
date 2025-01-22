import { products } from "../db/mock-product.mjs";

const success = (message, data) => {
  return {
    message: message,
    data: data,
  };
};

export { success };

// .map = La méthode map() des instances de tableau crée un nouveau tableau contenant les résultats de l'appel d'une fonction fournie sur chaque élément du tableau appelant.
/* .reduce = La méthode reduce() des instances de tableau exécute une fonction de rappel « reducer » fournie par l'utilisateur sur chaque élément du tableau, dans l'ordre,
en transmettant la valeur de retour du calcul effectué sur l'élément précédent.
Le résultat final de l'exécution du réducteur sur tous les éléments du tableau est une valeur unique.*/
