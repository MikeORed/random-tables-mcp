import { RandomTable } from '../../domain/entities/random-table';
import { TableEntry } from '../../domain/entities/table-entry';

/**
 * Interface for table operations.
 */
export interface TableService {
  /**
   * Creates a new table.
   * @param name Table name.
   * @param description Optional description.
   * @param entries Optional initial entries.
   * @returns The ID of the created table.
   */
  createTable(name: string, description?: string, entries?: TableEntry[]): Promise<string>;

  /**
   * Gets a table by its ID.
   * @param id The ID of the table to get.
   * @returns The table, or null if not found.
   */
  getTable(id: string): Promise<RandomTable | null>;

  /**
   * Updates an existing table.
   * @param id The ID of the table to update.
   * @param updates Object containing the updates to apply.
   */
  updateTable(
    id: string,
    updates: {
      name?: string;
      description?: string;
      entries?: {
        add?: TableEntry[];
        update?: { id: string; updates: Partial<Omit<TableEntry, 'id'>> }[];
        remove?: string[];
      };
    },
  ): Promise<void>;

  /**
   * Lists tables based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of tables matching the filter.
   */
  listTables(filter?: Record<string, unknown>): Promise<RandomTable[]>;
}
