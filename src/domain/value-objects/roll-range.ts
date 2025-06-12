/**
 * Represents a range of values with a minimum and maximum.
 * Used by TableEntry to define the range of values this entry corresponds to.
 */
export class Range {
  /**
   * Creates a new Range instance.
   * @param min The minimum value of the range (inclusive).
   * @param max The maximum value of the range (inclusive).
   */
  constructor(
    public readonly min: number,
    public readonly max: number,
  ) {
    if (min > max) {
      throw new Error('Minimum value cannot be greater than maximum value');
    }
  }

  /**
   * Checks if a value is within this range (inclusive).
   * @param value The value to check.
   * @returns True if the value is within the range, false otherwise.
   */
  contains(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  /**
   * Returns a string representation of the range.
   * @returns A string in the format "min-max".
   */
  toString(): string {
    return `${this.min}-${this.max}`;
  }

  /**
   * Creates a Range from a string representation.
   * @param rangeStr A string in the format "min-max".
   * @returns A new Range instance.
   * @throws Error if the string format is invalid.
   */
  static fromString(rangeStr: string): Range {
    const parts = rangeStr.split('-');
    if (parts.length !== 2) {
      throw new Error('Invalid range format. Expected "min-max"');
    }

    const min = parseInt(parts[0], 10);
    const max = parseInt(parts[1], 10);

    if (isNaN(min) || isNaN(max)) {
      throw new Error('Invalid range values. Expected numbers');
    }

    return new Range(min, max);
  }
}
