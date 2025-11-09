/**
 * Returns a random integer between `min` and `max` both inclusive.
 * @param {number} min 
 * @param {number} max
 * @returns {number} The generated random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { randomInt };