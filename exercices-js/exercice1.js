/**
 * Vous devez constuire un tableau contenant le carré de chaque entier présent dans le tableau 'numbers'
 */

let numbers = [1, 2, 3, 4, 5];

// Solution utilisant le paradigme procédurale

let squaredNumbers = [];

// A VOUS DE COMPLETER ICI

for (let i = 0; i < numbers.length; i++) {
  squaredNumbers[i] = numbers[i] * numbers[i];
}

// Solution utilisant le paradigme fonctionnel
for (let num of numbers) {
  squaredNumbers.push(num * num);
}

const squaredNumberss = numbers.map((num) => {
  return num * num;
});
// A VOUS DE COMPLETER ICI

console.log(squaredNumbers); // [1, 4, 9, 16, 25]
