import { DefaultRandomNumberGenerator } from "../../../../../src/adapters/secondary/rng/DefaultRandomNumberGenerator";

describe("DefaultRandomNumberGenerator", () => {
  let rng: DefaultRandomNumberGenerator;

  beforeEach(() => {
    rng = new DefaultRandomNumberGenerator();
  });

  describe("getRandomNumber", () => {
    it("should return a number within the specified range", () => {
      const min = 1;
      const max = 10;

      // Test multiple times to ensure range is respected
      for (let i = 0; i < 100; i++) {
        const result = rng.getRandomNumber(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it("should handle min equal to max", () => {
      const value = 5;
      const result = rng.getRandomNumber(value, value);
      expect(result).toBe(value);
    });
  });

  describe("getWeightedIndex", () => {
    it("should return an index within the bounds of the weights array", () => {
      const weights = [1, 2, 3, 4];

      // Test multiple times to ensure bounds are respected
      for (let i = 0; i < 100; i++) {
        const result = rng.getWeightedIndex(weights);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(weights.length);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it("should throw an error for empty weights array", () => {
      expect(() => rng.getWeightedIndex([])).toThrow(
        "Weights array cannot be empty"
      );
    });

    it("should throw an error for weights containing non-positive values", () => {
      expect(() => rng.getWeightedIndex([1, 0, 3])).toThrow(
        "All weights must be positive"
      );
      expect(() => rng.getWeightedIndex([1, -1, 3])).toThrow(
        "All weights must be positive"
      );
    });

    it("should return the only index for a single-element weights array", () => {
      const result = rng.getWeightedIndex([5]);
      expect(result).toBe(0);
    });

    it("should respect the weights in probability distribution", () => {
      // Mock Math.random to return predictable values
      const originalRandom = Math.random;

      try {
        // Test with weights [1, 3, 6]
        const weights = [1, 3, 6];
        const totalWeight = weights.reduce((sum, w) => sum + w, 0); // 10

        // For value 0.05 (5% of total), should select index 0
        Math.random = jest.fn().mockReturnValue(0.05);
        expect(rng.getWeightedIndex(weights)).toBe(0);

        // For value 0.15 (15% of total), should select index 1
        Math.random = jest.fn().mockReturnValue(0.15);
        expect(rng.getWeightedIndex(weights)).toBe(1);

        // For value 0.5 (50% of total), should select index 2
        Math.random = jest.fn().mockReturnValue(0.5);
        expect(rng.getWeightedIndex(weights)).toBe(2);

        // For value 0.99 (99% of total), should select index 2
        Math.random = jest.fn().mockReturnValue(0.99);
        expect(rng.getWeightedIndex(weights)).toBe(2);
      } finally {
        // Restore original Math.random
        Math.random = originalRandom;
      }
    });
  });
});
