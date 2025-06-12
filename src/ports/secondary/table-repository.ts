import { RandomTable } from '../../domain/entities/random-table';

/**
 * Interface for table persistence operations.
 */
export interface TableRepository {
  /**
   * Saves a table to the repository.
   * @param table The table to save.
   * @returns The ID of the saved table.
   */
  save(table: RandomTable): Promise<string>;

  /**
   * Gets a table by its ID.
   * @param id The ID of the table to get.
   * @returns The table, or null if not found.
   */
  getById(id: string): Promise<RandomTable | null>;

  /**
   * Updates an existing table.
   * @param table The updated table.
   */
  update(table: RandomTable): Promise<void>;

  /**
   * Lists tables based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of tables matching the filter.
   */
  list(filter?: Record<string, unknown>): Promise<RandomTable[]>;

  /**
   * Deletes a table by its ID.
   * @param id The ID of the table to delete.
   */
  delete(id: string): Promise<void>;
}
