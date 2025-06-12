import { TableEntry } from '../domain/entities/table-entry';
import { RandomTable } from '../domain/entities/random-table';
import { TableRepository } from '../ports/secondary/table-repository';

/**
 * Use case for updating an existing random table.
 */
export class UpdateTableUseCase {
  /**
   * Creates a new UpdateTableUseCase instance.
   * @param repository The table repository to use.
   */
  constructor(private readonly repository: TableRepository) {}

  /**
   * Executes the use case.
   * @param id The ID of the table to update.
   * @param updates Object containing the updates to apply.
   */
  async execute(
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
  ): Promise<void> {
    // Validate inputs
    if (!id) {
      throw new Error('Table ID is required');
    }

    // Get the table from the repository
    const table = await this.repository.getById(id);
    if (!table) {
      throw new Error(`Table with ID ${id} not found`);
    }

    // Apply updates to the table
    let updatedTable = table;

    // Update name and/or description if provided
    if (updates.name !== undefined || updates.description !== undefined) {
      // Since RandomTable is immutable, we need to create a new instance
      // For now, we'll create a new table with the updated properties
      updatedTable = new RandomTable(
        updatedTable.id,
        updates.name ?? updatedTable.name,
        updates.description ?? updatedTable.description,
        updatedTable.entries,
      );
    }

    // Update entries if provided
    if (updates.entries) {
      // Add new entries
      if (updates.entries.add) {
        for (const entry of updates.entries.add) {
          updatedTable.addEntry(entry);
        }
      }

      // Update existing entries
      if (updates.entries.update) {
        for (const { id: entryId, updates: entryUpdates } of updates.entries.update) {
          updatedTable.updateEntry(entryId, entryUpdates);
        }
      }

      // Remove entries
      if (updates.entries.remove) {
        for (const entryId of updates.entries.remove) {
          updatedTable.removeEntry(entryId);
        }
      }
    }

    // Save the updated table to the repository
    await this.repository.update(updatedTable);
  }
}
