import { RandomTable } from '../domain/entities/random-table';
import { TableRepository } from '../ports/secondary/table-repository';

/**
 * Use case for listing random tables.
 */
export class ListTablesUseCase {
  /**
   * Creates a new ListTablesUseCase instance.
   * @param repository The table repository to use.
   */
  constructor(private readonly repository: TableRepository) {}

  /**
   * Executes the use case.
   * @param filter Optional filter criteria.
   * @returns An array of tables matching the filter.
   */
  async execute(filter?: Record<string, unknown>): Promise<RandomTable[]> {
    return await this.repository.list(filter);
  }
}
