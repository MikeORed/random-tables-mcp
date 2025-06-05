import { Range } from "../value-objects/roll-range";
import { RollTemplate } from "../value-objects/roll-template";

/**
 * Represents an entry in a random table.
 */
export class TableEntry {
  /**
   * Creates a new TableEntry instance.
   * @param id Unique identifier for the entry.
   * @param content The content of this entry (text, reference to another table, etc.).
   * @param weight Probability weight (default: 1).
   * @param range Optional range of values this entry corresponds to (e.g., "1-5" on a d20).
   */
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly weight: number = 1,
    public readonly range?: Range
  ) {
    if (weight <= 0) {
      throw new Error("Weight must be greater than zero");
    }
  }

  /**
   * Checks if a value is within this entry's range.
   * @param value The value to check.
   * @returns True if the entry has no range or if the value is within the range, false otherwise.
   */
  isInRange(value: number): boolean {
    if (!this.range) {
      return false;
    }
    return this.range.contains(value);
  }

  /**
   * Checks if this entry's content is a template.
   * @returns True if the content contains template references, false otherwise.
   */
  isTemplate(): boolean {
    return RollTemplate.isTemplate(this.content);
  }

  /**
   * Creates a copy of this entry with updated properties.
   * @param updates Object containing the properties to update.
   * @returns A new TableEntry instance with updated properties.
   */
  update(updates: Partial<Omit<TableEntry, "id">>): TableEntry {
    return new TableEntry(
      this.id,
      updates.content ?? this.content,
      updates.weight ?? this.weight,
      updates.range ?? this.range
    );
  }

  /**
   * Creates a TableEntry from a plain object.
   * @param obj The object to create the entry from.
   * @returns A new TableEntry instance.
   */
  static fromObject(obj: {
    id: string;
    content: string;
    weight?: number;
    range?: { min: number; max: number };
  }): TableEntry {
    return new TableEntry(
      obj.id,
      obj.content,
      obj.weight,
      obj.range ? new Range(obj.range.min, obj.range.max) : undefined
    );
  }

  /**
   * Converts this entry to a plain object.
   * @returns A plain object representation of this entry.
   */
  toObject(): {
    id: string;
    content: string;
    weight: number;
    range?: { min: number; max: number };
  } {
    return {
      id: this.id,
      content: this.content,
      weight: this.weight,
      range: this.range
        ? { min: this.range.min, max: this.range.max }
        : undefined,
    };
  }
}
