import { RandomTable, TableEntry } from '../../domain/index.js';
import { TableService } from '../../ports/index.js';
import { CreateTableUseCase } from '../create-table-use-case.js';
import { GetTableUseCase } from '../get-table-use-case.js';
import { ListTablesUseCase } from '../list-tables-use-case.js';
import { UpdateTableUseCase } from '../update-table-use-case.js';

/**
 * Implementation of the TableService interface.
 */
export class TableServiceImpl implements TableService {
  /**
   * Creates a new TableServiceImpl instance.
   * @param createTableUseCase The use case for creating tables.
   * @param getTableUseCase The use case for getting tables.
   * @param listTablesUseCase The use case for listing tables.
   * @param updateTableUseCase The use case for updating tables.
   */
  constructor(
    private readonly createTableUseCase: CreateTableUseCase,
    private readonly getTableUseCase: GetTableUseCase,
    private readonly listTablesUseCase: ListTablesUseCase,
    private readonly updateTableUseCase: UpdateTableUseCase,
  ) {}

  /**
   * Creates a new table.
   * @param name Table name.
   * @param description Optional description.
   * @param entries Optional initial entries.
   * @returns The ID of the created table.
   */
  async createTable(name: string, description?: string, entries?: TableEntry[]): Promise<string> {
    return await this.createTableUseCase.execute(name, description, entries);
  }

  /**
   * Gets a table by its ID.
   * @param id The ID of the table to get.
   * @returns The table, or null if not found.
   */
  async getTable(id: string): Promise<RandomTable | null> {
    return await this.getTableUseCase.execute(id);
  }

  /**
   * Updates an existing table.
   * @param id The ID of the table to update.
   * @param updates Object containing the updates to apply.
   */
  async updateTable(
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
    await this.updateTableUseCase.execute(id, updates);
  }

  /**
   * Lists tables based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of tables matching the filter.
   */
  async listTables(filter?: Record<string, unknown>): Promise<RandomTable[]> {
    return await this.listTablesUseCase.execute(filter);
  }
}
