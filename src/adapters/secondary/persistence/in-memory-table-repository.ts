import { RandomTable } from '../../../domain/index.js';
import { TableRepository } from '../../../ports/index.js';

/**
 * In-memory implementation of the TableRepository interface.
 * Stores tables in memory, useful for testing and development.
 */
export class InMemoryTableRepository implements TableRepository {
  private tables: Map<string, RandomTable> = new Map();

  /**
   * Saves a table to the repository.
   * @param table The table to save.
   * @returns The ID of the saved table.
   */
  async save(table: RandomTable): Promise<string> {
    this.tables.set(table.id, table);
    return await Promise.resolve(table.id);
  }

  /**
   * Gets a table by its ID.
   * @param id The ID of the table to get.
   * @returns The table, or null if not found.
   */
  async getById(id: string): Promise<RandomTable | null> {
    const table = this.tables.get(id);
    return await Promise.resolve(table ?? null);
  }

  /**
   * Updates an existing table.
   * @param table The updated table.
   * @throws Error if the table does not exist.
   */
  async update(table: RandomTable): Promise<void> {
    if (!this.tables.has(table.id)) {
      throw new Error(`Table with ID ${table.id} does not exist`);
    }
    this.tables.set(table.id, table);
    await Promise.resolve();
  }

  /**
   * Lists tables based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of tables matching the filter.
   */
  async list(filter?: Record<string, unknown>): Promise<RandomTable[]> {
    let tables = Array.from(this.tables.values());

    await Promise.resolve();

    if (filter) {
      tables = tables.filter(table => {
        // Check if all filter criteria match
        return Object.entries(filter).every(([key, value]) => {
          // Handle nested properties with dot notation (e.g., "entries.length")
          const keys = key.split('.');
          let obj: RandomTable = table;

          // Navigate to the nested property
          let currentObj: unknown = obj;
          for (let i = 0; i < keys.length - 1; i++) {
            currentObj = (currentObj as Record<string, unknown>)[keys[i]];
            if (currentObj === undefined) return false;
          }

          const prop = keys[keys.length - 1];

          // Special case for array length
          if (prop === 'length' && Array.isArray(currentObj)) {
            return currentObj.length === value;
          }

          // Regular property comparison
          return (currentObj as Record<string, unknown>)[prop] === value;
        });
      });
    }

    return tables;
  }

  /**
   * Deletes a table by its ID.
   * @param id The ID of the table to delete.
   * @throws Error if the table does not exist.
   */
  async delete(id: string): Promise<void> {
    if (!this.tables.has(id)) {
      throw new Error(`Table with ID ${id} does not exist`);
    }
    this.tables.delete(id);
    await Promise.resolve();
  }

  /**
   * Clears all tables from the repository.
   * Useful for testing.
   */
  clear(): void {
    this.tables.clear();
  }
}
