import { Range } from '../../../../src/domain/value-objects/roll-range';

describe('Range', () => {
  describe('constructor', () => {
    it('should create a Range with valid min and max values', () => {
      const range = new Range(1, 10);
      expect(range.min).toBe(1);
      expect(range.max).toBe(10);
    });

    it('should throw an error if min is greater than max', () => {
      expect(() => new Range(10, 1)).toThrow('Minimum value cannot be greater than maximum value');
    });

    it('should allow min and max to be equal', () => {
      const range = new Range(5, 5);
      expect(range.min).toBe(5);
      expect(range.max).toBe(5);
    });
  });

  describe('contains', () => {
    const range = new Range(5, 10);

    it('should return true for values within the range', () => {
      expect(range.contains(5)).toBe(true);
      expect(range.contains(7)).toBe(true);
      expect(range.contains(10)).toBe(true);
    });

    it('should return false for values outside the range', () => {
      expect(range.contains(4)).toBe(false);
      expect(range.contains(11)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return a string representation of the range', () => {
      const range = new Range(1, 10);
      expect(range.toString()).toBe('1-10');
    });
  });

  describe('fromString', () => {
    it('should create a Range from a valid string', () => {
      const range = Range.fromString('1-10');
      expect(range.min).toBe(1);
      expect(range.max).toBe(10);
    });

    it('should throw an error for invalid format', () => {
      expect(() => Range.fromString('invalid')).toThrow('Invalid range format. Expected "min-max"');
    });

    it('should throw an error for non-numeric values', () => {
      expect(() => Range.fromString('a-b')).toThrow('Invalid range values. Expected numbers');
    });
  });
});
