import { TableEntry } from './table-entry';
import { RollResult } from './roll-result';

/**
 * Represents a random table with entries that can be rolled on.
 */
export class RandomTable {
  private _entries: Map<string, TableEntry> = new Map();

  /**
   * Creates a new RandomTable instance.
   * @param id Unique identifier for the table.
   * @param name Table name.
   * @param description Optional description.
   * @param entries Optional initial entries.
   */
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string = '',
    entries: TableEntry[] = [],
  ) {
    if (!id) {
      throw new Error('Table ID is required');
    }
    if (!name) {
      throw new Error('Table name is required');
    }

    // Add initial entries
    entries.forEach(entry => this.addEntry(entry));
  }

  /**
   * Gets all entries in this table.
   * @returns An array of TableEntry objects.
   */
  get entries(): TableEntry[] {
    return Array.from(this._entries.values());
  }

  /**
   * Gets the total weight of all entries in this table.
   * @returns The sum of all entry weights.
   */
  get totalWeight(): number {
    return this.entries.reduce((sum, entry) => sum + entry.weight, 0);
  }

  /**
   * Adds a new entry to the table.
   * @param entry The entry to add.
   * @throws Error if an entry with the same ID already exists.
   */
  addEntry(entry: TableEntry): void {
    if (this._entries.has(entry.id)) {
      throw new Error(`Entry with ID ${entry.id} already exists`);
    }
    this._entries.set(entry.id, entry);
  }

  /**
   * Removes an entry from the table.
   * @param entryId The ID of the entry to remove.
   * @throws Error if the entry does not exist.
   */
  removeEntry(entryId: string): void {
    if (!this._entries.has(entryId)) {
      throw new Error(`Entry with ID ${entryId} does not exist`);
    }
    this._entries.delete(entryId);
  }

  /**
   * Updates an existing entry in the table.
   * @param entryId The ID of the entry to update.
   * @param updates Object containing the properties to update.
   * @throws Error if the entry does not exist.
   */
  updateEntry(entryId: string, updates: Partial<Omit<TableEntry, 'id'>>): void {
    const entry = this._entries.get(entryId);
    if (!entry) {
      throw new Error(`Entry with ID ${entryId} does not exist`);
    }
    this._entries.set(entryId, entry.update(updates));
  }

  /**
   * Gets an entry by ID.
   * @param entryId The ID of the entry to get.
   * @returns The entry, or undefined if it does not exist.
   */
  getEntry(entryId: string): TableEntry | undefined {
    return this._entries.get(entryId);
  }

  /**
   * Performs a roll on the table using a random number generator.
   * @param rng A function that returns a random number between 0 and 1.
   * @returns A RollResult object.
   * @throws Error if the table has no entries.
   */
  roll(rng: () => number = Math.random): RollResult {
    if (this.entries.length === 0) {
      throw new Error('Cannot roll on an empty table');
    }

    // Handle tables with entries that have ranges
    const entriesWithRanges = this.entries.filter(entry => entry.range);
    if (entriesWithRanges.length > 0) {
      // Find the maximum range value across all entries
      const maxRange = Math.max(...entriesWithRanges.map(entry => entry.range!.max));

      // Roll a value within the range
      const rollValue = Math.floor(rng() * maxRange) + 1;

      // Find the entry that contains this value
      const foundEntry = this.entries.find(entry => entry.range && entry.isInRange(rollValue));

      if (foundEntry) {
        const isTemplate = foundEntry.isTemplate();
        return new RollResult(this.id, foundEntry.id, foundEntry.content, isTemplate);
      }
    }

    // For tables without ranges or if no range matched, use weighted random selection
    const totalWeight = this.totalWeight;
    let randomValue = rng() * totalWeight;

    for (const entry of this.entries) {
      randomValue -= entry.weight;
      if (randomValue <= 0) {
        const isTemplate = entry.isTemplate();
        return new RollResult(this.id, entry.id, entry.content, isTemplate);
      }
    }

    // Fallback (should never happen with proper weights)
    const fallbackEntry = this.entries[0];
    const isTemplate = fallbackEntry.isTemplate();
    return new RollResult(this.id, fallbackEntry.id, fallbackEntry.content, isTemplate);
  }

  /**
   * Creates a RandomTable from a plain object.
   * @param obj The object to create the table from.
   * @returns A new RandomTable instance.
   */
  static fromObject(obj: {
    id: string;
    name: string;
    description?: string;
    entries?: Array<{
      id: string;
      content: string;
      weight?: number;
      range?: { min: number; max: number };
    }>;
  }): RandomTable {
    const entries = obj.entries?.map(entry => TableEntry.fromObject(entry)) ?? [];
    return new RandomTable(obj.id, obj.name, obj.description ?? '', entries);
  }

  /**
   * Converts this table to a plain object.
   * @returns A plain object representation of this table.
   */
  toObject(): RandomTableDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      entries: this.entries.map(entry => entry.toObject()),
    };
  }
}

export interface RandomTableDTO {
  id: string;
  name: string;
  description: string;
  entries: Array<{
    id: string;
    content: string;
    weight: number;
    range?: { min: number; max: number };
  }>;
}
