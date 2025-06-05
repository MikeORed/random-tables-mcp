/**
 * Represents the result of a roll on a random table.
 */
export class RollResult {
  /**
   * Creates a new RollResult instance.
   * @param tableId ID of the table rolled on.
   * @param entryId ID of the resulting entry.
   * @param content Content of the resulting entry.
   * @param isTemplate Whether the content is a template.
   * @param resolvedContent Optional resolved content if the original content was a template.
   * @param timestamp When the roll occurred (defaults to current time).
   */
  constructor(
    public readonly tableId: string,
    public readonly entryId: string,
    public readonly content: string,
    public readonly isTemplate: boolean = false,
    public readonly resolvedContent?: string,
    public readonly timestamp: Date = new Date()
  ) {}

  /**
   * Creates a RollResult from a plain object.
   * @param obj The object to create the result from.
   * @returns A new RollResult instance.
   */
  static fromObject(obj: {
    tableId: string;
    entryId: string;
    content: string;
    isTemplate?: boolean;
    resolvedContent?: string;
    timestamp?: string | Date;
  }): RollResult {
    const timestamp = obj.timestamp
      ? obj.timestamp instanceof Date
        ? obj.timestamp
        : new Date(obj.timestamp)
      : new Date();

    return new RollResult(
      obj.tableId,
      obj.entryId,
      obj.content,
      obj.isTemplate || false,
      obj.resolvedContent,
      timestamp
    );
  }

  /**
   * Converts this result to a plain object.
   * @returns A plain object representation of this result.
   */
  toObject(): {
    tableId: string;
    entryId: string;
    content: string;
    isTemplate: boolean;
    resolvedContent?: string;
    timestamp: string;
  } {
    return {
      tableId: this.tableId,
      entryId: this.entryId,
      content: this.content,
      isTemplate: this.isTemplate,
      resolvedContent: this.resolvedContent,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Creates a new RollResult with resolved content.
   * @param resolvedContent The resolved content.
   * @returns A new RollResult with the same properties but with resolved content.
   */
  withResolvedContent(resolvedContent: string): RollResult {
    return new RollResult(
      this.tableId,
      this.entryId,
      this.content,
      this.isTemplate,
      resolvedContent,
      this.timestamp
    );
  }
}
