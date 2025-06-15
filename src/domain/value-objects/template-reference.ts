/**
 * Represents a reference to another table within a template string.
 * Format: {{reference-title::table-id::table-name::roll-number::separator}}
 * Where:
 * - reference-title: A label for the reference
 * - table-id: The ID of the table to roll on
 * - table-name: A fallback if the ID can't be found
 * - roll-number: (optional) How many times to roll on the table (default: 1)
 * - separator: (optional) What to use when joining multiple roll results (default: ", ")
 */
export class TemplateReference {
  /**
   * Creates a new TemplateReference instance.
   * @param title A label for the reference
   * @param tableId The ID of the table to roll on
   * @param tableName A fallback if the ID can't be found
   * @param rollCount How many times to roll on the table
   * @param separator What to use when joining multiple roll results
   */
  constructor(
    public readonly title: string,
    public readonly tableId: string,
    public readonly tableName: string,
    public readonly rollCount: number = 1,
    public readonly separator: string = ', ',
  ) {
    if (rollCount < 1) {
      throw new Error('Roll count must be at least 1');
    }
  }

  /**
   * Creates a TemplateReference from a string representation.
   * @param refString The string representation of the reference
   * @returns A new TemplateReference instance
   */
  static fromString(refString: string): TemplateReference {
    // Handle empty string case
    if (!refString || refString.trim() === '') {
      return new TemplateReference('', '', '');
    }

    const parts = refString.split('::');

    // Extract and validate parts
    const title = parts[0] || '';
    const tableId = parts[1] || '';
    const tableName = parts[2] || '';

    // Parse rollCount, defaulting to 1 if invalid
    let rollCount = 1;
    if (parts.length > 3 && parts[3]) {
      const parsed = parseInt(parts[3], 10);
      if (!isNaN(parsed) && parsed > 0) {
        rollCount = parsed;
      }
    }

    // Get separator, defaulting to ", " if not provided
    const separator = parts.length > 4 ? parts[4] : ', ';

    return new TemplateReference(title, tableId, tableName, rollCount, separator);
  }

  /**
   * Gets the reference string for this template reference.
   * Returns the short form if rollCount and separator are at default values,
   * otherwise returns the full form.
   * @returns The reference string in the appropriate format
   */
  toString(): string {
    // If using default values for rollCount and separator, return short form
    if (this.rollCount === 1 && this.separator === ', ') {
      return `{{${this.title}::${this.tableId}::${this.tableName}}}`;
    }
    // Otherwise return the full form with all parameters
    return this.toFullString();
  }

  /**
   * Gets the full reference string for this template reference, including all parts.
   * @returns The reference string in the format {{title::tableId::tableName::rollCount::separator}}
   */
  toFullString(): string {
    return `{{${this.title}::${this.tableId}::${this.tableName}::${this.rollCount}::${this.separator}}}`;
  }
}
