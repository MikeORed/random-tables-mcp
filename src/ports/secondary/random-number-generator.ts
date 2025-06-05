/**
 * Interface for generating random numbers.
 */
export interface RandomNumberGenerator {
  /**
   * Generates a random number between min and max (inclusive).
   * @param min The minimum value (inclusive).
   * @param max The maximum value (inclusive).
   * @returns A random number between min and max.
   */
  getRandomNumber(min: number, max: number): number;

  /**
   * Gets a weighted random index based on the provided weights.
   * @param weights An array of weights.
   * @returns A random index, with probability proportional to the weights.
   */
  getWeightedIndex(weights: number[]): number;
}
