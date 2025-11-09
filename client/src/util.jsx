/**
 * Returns a random integer between `min` and `max` both inclusive.
 * @param {number} min 
 * @param {number} max
 * @returns {number} The generated random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns `num` clamped between `min` and `max`.
 * ```js
 * clamp(5, 1, 6); // 5
 * clamp(7, 1, 6); // 6
 * clamp(0, 1, 6); // 1
 * ```
 * @param {number} num 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} The clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(min, num), max);
}

export { randomInt, clamp };