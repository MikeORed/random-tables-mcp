import { RandomTable, TableEntry } from '../domain/index.js';
import { TableRepository } from '../ports/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Use case for creating a new random table.
 */
export class CreateTableUseCase {
  /**
   * Creates a new CreateTableUseCase instance.
   * @param repository The table repository to use.
   */
  constructor(private readonly repository: TableRepository) {}

  /**
   * Executes the use case.
   * @param name Table name.
   * @param description Optional description.
   * @param entries Optional initial entries.
   * @returns The ID of the created table.
   */
  async execute(
    name: string,
    description: string = '',
    entries: TableEntry[] = [],
  ): Promise<string> {
    // Validate inputs
    if (!name) {
      throw new Error('Table name is required');
    }

    // Generate a unique ID for the table
    const id = uuidv4();

    // Create the table
    const table = new RandomTable(id, name, description, entries);

    // Save the table to the repository
    await this.repository.save(table);

    return id;
  }
}
