import { TableService } from "../../../../ports/primary/table-service";

/**
 * Resource for accessing a list of tables.
 */
export class TablesResource {
  private readonly uriPattern = "tables://";

  /**
   * Creates a new TablesResource instance.
   * @param tableService The table service to use.
   */
  constructor(private readonly tableService: TableService) {}

  /**
   * Gets the URI pattern for this resource.
   * @returns The URI pattern.
   */
  public getUriPattern(): string {
    return this.uriPattern;
  }

  /**
   * Gets the content of the resource.
   * @returns The resource content.
   */
  public async getContent(): Promise<any> {
    const tables = await this.tableService.listTables();

    return {
      tables: tables.map((table) => ({
        id: table.id,
        name: table.name,
        description: table.description,
        entryCount: table.entries.length,
      })),
    };
  }
}
