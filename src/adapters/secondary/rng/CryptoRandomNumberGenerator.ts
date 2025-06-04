import { RandomNumberGenerator } from "../../../ports/secondary/RandomNumberGenerator";
import * as crypto from "crypto";

/**
 * Implementation of the RandomNumberGenerator interface using Node's crypto module.
 * Provides cryptographically secure random numbers.
 */
export class CryptoRandomNumberGenerator implements RandomNumberGenerator {
  /**
   * Generates a cryptographically secure random number between min and max (inclusive).
   * @param min The minimum value (inclusive).
   * @param max The maximum value (inclusive).
   * @returns A random number between min and max.
   */
  getRandomNumber(min: number, max: number): number {
    // Ensure min is less than or equal to max
    if (min > max) {
      throw new Error("Min must be less than or equal to max");
    }

    // Handle special case where min equals max
    if (min === max) {
      return min;
    }

    // For floating point values between 0 and 1
    if (min === 0 && max === 1) {
      // Generate a random 32-bit unsigned integer and divide by 2^32
      const buffer = crypto.randomBytes(4);
      const randomValue = buffer.readUInt32LE(0) / 0x100000000;
      return randomValue;
    }

    // For integer ranges, use randomInt which is more efficient
    // randomInt is inclusive of min, exclusive of max+1
    return crypto.randomInt(min, max + 1);
  }

  /**
   * Gets a weighted random index based on the provided weights using
   * cryptographically secure random number generation.
   * @param weights An array of weights.
   * @returns A random index, with probability proportional to the weights.
   * @throws Error if the weights array is empty or contains non-positive values.
   */
  getWeightedIndex(weights: number[]): number {
    if (weights.length === 0) {
      throw new Error("Weights array cannot be empty");
    }

    if (weights.some((weight) => weight <= 0)) {
      throw new Error("All weights must be positive");
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    // Generate a random value between 0 and totalWeight
    const randomValue = this.getRandomNumber(0, 1) * totalWeight;

    let cumulativeWeight = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue < cumulativeWeight) {
        return i;
      }
    }

    // Fallback (should never happen with proper weights)
    return weights.length - 1;
  }
}
