import { CryptoRandomNumberGenerator } from '../../../../../src/adapters/secondary/rng/crypto-random-number-generator';
import * as crypto from 'crypto';

// Mock the crypto module
jest.mock('crypto');

describe('CryptoRandomNumberGenerator', () => {
  let rng: CryptoRandomNumberGenerator;

  beforeEach(() => {
    jest.clearAllMocks();
    rng = new CryptoRandomNumberGenerator();
  });

  describe('getRandomNumber', () => {
    it('should return a number within the specified range for integers', () => {
      // Mock randomInt to return predictable values
      (crypto.randomInt as jest.Mock).mockImplementation((min, max) => min);

      const min = 1;
      const max = 10;

      const result = rng.getRandomNumber(min, max);

      expect(crypto.randomInt).toHaveBeenCalledWith(min, max + 1);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('should handle floating point values between 0 and 1', () => {
      // Create a mock buffer that will produce a known value when read
      const mockBuffer = Buffer.alloc(4);
      mockBuffer.writeUInt32LE(0x80000000, 0); // This will give 0.5 when divided by 0x100000000

      // Mock randomBytes to return our buffer
      (crypto.randomBytes as jest.Mock).mockReturnValue(mockBuffer);

      const result = rng.getRandomNumber(0, 1);

      expect(crypto.randomBytes).toHaveBeenCalledWith(4);
      expect(result).toBeCloseTo(0.5, 5);
    });

    it('should handle min equal to max', () => {
      const value = 5;
      const result = rng.getRandomNumber(value, value);

      // Should not call crypto functions for this case
      expect(crypto.randomInt).not.toHaveBeenCalled();
      expect(crypto.randomBytes).not.toHaveBeenCalled();

      expect(result).toBe(value);
    });

    it('should throw an error if min is greater than max', () => {
      expect(() => rng.getRandomNumber(10, 1)).toThrow('Min must be less than or equal to max');
    });
  });

  describe('getWeightedIndex', () => {
    it('should return an index within the bounds of the weights array', () => {
      // Mock getRandomNumber to return a predictable value
      jest.spyOn(rng, 'getRandomNumber').mockReturnValue(0.5);

      const weights = [1, 2, 3, 4];
      const result = rng.getWeightedIndex(weights);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(weights.length);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should throw an error for empty weights array', () => {
      expect(() => rng.getWeightedIndex([])).toThrow('Weights array cannot be empty');
    });

    it('should throw an error for weights containing non-positive values', () => {
      expect(() => rng.getWeightedIndex([1, 0, 3])).toThrow('All weights must be positive');
      expect(() => rng.getWeightedIndex([1, -1, 3])).toThrow('All weights must be positive');
    });

    it('should return the only index for a single-element weights array', () => {
      const result = rng.getWeightedIndex([5]);
      expect(result).toBe(0);
    });

    it('should respect the weights in probability distribution', () => {
      // Test with weights [1, 3, 6]
      const weights = [1, 3, 6];
      const totalWeight = weights.reduce((sum, w) => sum + w, 0); // 10

      // Mock getRandomNumber to return specific values
      const mockGetRandomNumber = jest.spyOn(rng, 'getRandomNumber');

      // For value 0.05 (5% of total), should select index 0
      mockGetRandomNumber.mockReturnValue(0.05);
      expect(rng.getWeightedIndex(weights)).toBe(0);

      // For value 0.15 (15% of total), should select index 1
      mockGetRandomNumber.mockReturnValue(0.15);
      expect(rng.getWeightedIndex(weights)).toBe(1);

      // For value 0.5 (50% of total), should select index 2
      mockGetRandomNumber.mockReturnValue(0.5);
      expect(rng.getWeightedIndex(weights)).toBe(2);

      // For value 0.99 (99% of total), should select index 2
      mockGetRandomNumber.mockReturnValue(0.99);
      expect(rng.getWeightedIndex(weights)).toBe(2);

      // Restore the original method
      mockGetRandomNumber.mockRestore();
    });
  });
});
