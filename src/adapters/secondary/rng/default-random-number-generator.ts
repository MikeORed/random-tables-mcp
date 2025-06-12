import { RandomNumberGenerator } from '../../../ports/index.js';

/**
 * Default implementation of the RandomNumberGenerator interface.
 * Uses JavaScript's Math.random() for generating random numbers.
 */
export class DefaultRandomNumberGenerator implements RandomNumberGenerator {
  /**
   * Generates a random number between min and max (inclusive).
   * @param min The minimum value (inclusive).
   * @param max The maximum value (inclusive).
   * @returns A random number between min and max.
   */
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Gets a weighted random index based on the provided weights.
   * @param weights An array of weights.
   * @returns A random index, with probability proportional to the weights.
   * @throws Error if the weights array is empty or contains non-positive values.
   */
  getWeightedIndex(weights: number[]): number {
    if (weights.length === 0) {
      throw new Error('Weights array cannot be empty');
    }

    if (weights.some(weight => weight <= 0)) {
      throw new Error('All weights must be positive');
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let randomValue = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
      randomValue -= weights[i];
      if (randomValue <= 0) {
        return i;
      }
    }

    // Fallback (should never happen with proper weights)
    return weights.length - 1;
  }
}
