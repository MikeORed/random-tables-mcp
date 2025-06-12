import { RandomTable } from '../domain/entities/random-table';
import { TableRepository } from '../ports/secondary/table-repository';

/**
 * Use case for getting a random table by ID.
 */
export class GetTableUseCase {
  /**
   * Creates a new GetTableUseCase instance.
   * @param repository The table repository to use.
   */
  constructor(private readonly repository: TableRepository) {}

  /**
   * Executes the use case.
   * @param id The ID of the table to get.
   * @returns The table, or null if not found.
   */
  async execute(id: string): Promise<RandomTable | null> {
    // Validate inputs
    if (!id) {
      throw new Error('Table ID is required');
    }

    // Get the table from the repository
    return await this.repository.getById(id);
  }
}
