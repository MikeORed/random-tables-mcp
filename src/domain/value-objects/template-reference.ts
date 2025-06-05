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
    public readonly separator: string = ", "
  ) {
    if (rollCount < 1) {
      throw new Error("Roll count must be at least 1");
    }
  }

  /**
   * Creates a TemplateReference from a string representation.
   * @param refString The string representation of the reference
   * @returns A new TemplateReference instance
   */
  static fromString(refString: string): TemplateReference {
    const parts = refString.split("::");

    return new TemplateReference(
      parts[0] || "",
      parts[1] || "",
      parts[2] || "",
      parts[3] ? parseInt(parts[3], 10) : 1,
      parts[4] || ", "
    );
  }

  /**
   * Gets the full reference string for this template reference.
   * @returns The reference string in the format {{title::tableId::tableName::rollCount::separator}}
   */
  toString(): string {
    return `{{${this.title}::${this.tableId}::${this.tableName}}}`;
  }

  /**
   * Gets the full reference string for this template reference, including all parts.
   * @returns The reference string in the format {{title::tableId::tableName::rollCount::separator}}
   */
  toFullString(): string {
    return `{{${this.title}::${this.tableId}::${this.tableName}::${this.rollCount}::${this.separator}}}`;
  }
}
