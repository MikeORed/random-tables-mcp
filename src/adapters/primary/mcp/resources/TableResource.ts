import { TableService } from "../../../../ports/primary/TableService";

/**
 * Resource for accessing a specific table.
 */
export class TableResource {
  private readonly uriPattern = "table://{tableId}";

  /**
   * Creates a new TableResource instance.
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
   * @param params The resource parameters.
   * @returns The resource content.
   */
  public async getContent(params: { tableId: string }): Promise<any> {
    const table = await this.tableService.getTable(params.tableId);

    if (!table) {
      throw new Error(`Table with ID ${params.tableId} not found`);
    }

    return table.toObject();
  }
}
