/**
 * Vous devez faire la somme des entiers présent dans le tableau numbers
 */

let numbers = [1, 2, 3, 4, 5];
let sum = 0;

// Solution utilisant le paradigme procédurale
// A VOUS DE COMPLETER ICI
//for (let i = 0; i < numbers.length; i++) {
//  sum += numbers[i];
//}

// Solution utilisant le paradigme fonctionnel
// A VOUS DE COMPLETER ICI
sum = numbers.reduce((sum, number) => sum + number, 0);

console.log(sum); // 15
