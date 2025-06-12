import { TableService } from '../../../../ports/primary/table-service';
import { BaseResource } from './resource';

/**
 * Output type for the tables resource.
 */
type TablesResourceContent = {
  tables: Array<{
    id: string;
    name: string;
    description: string;
    entryCount: number;
  }>;
};

/**
 * Resource for accessing a list of tables.
 */
export class TablesResource extends BaseResource<Record<string, never>, TablesResourceContent> {
  /**
   * Creates a new TablesResource instance.
   * @param tableService The table service to use.
   */
  constructor(private readonly tableService: TableService) {
    super();
  }

  /**
   * Gets the URI pattern for this resource.
   * @returns The URI pattern.
   */
  protected getResourceUriPattern(): string {
    return 'tables://';
  }

  /**
   * Gets the content of the resource.
   * @returns The resource content.
   */
  protected async getResourceContent(): Promise<TablesResourceContent> {
    const tables = await this.tableService.listTables();

    return {
      tables: tables.map(table => ({
        id: table.id,
        name: table.name,
        description: table.description,
        entryCount: table.entries.length,
      })),
    };
  }
}
