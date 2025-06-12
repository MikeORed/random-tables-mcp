import { TableService } from '../../../../ports/primary/table-service';
import { BaseResource } from './resource';
import { RandomTableDTO } from '../../../../domain/entities/random-table';

/**
 * Parameters for the table resource.
 */
type TableResourceParams = {
  tableId: string;
};

/**
 * Resource for accessing a specific table.
 */
export class TableResource extends BaseResource<TableResourceParams, RandomTableDTO> {
  /**
   * Creates a new TableResource instance.
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
    return 'table://{tableId}';
  }

  /**
   * Gets the content of the resource.
   * @param params The resource parameters.
   * @returns The resource content.
   */
  protected async getResourceContent(params: TableResourceParams): Promise<RandomTableDTO> {
    const table = await this.tableService.getTable(params.tableId);

    if (!table) {
      throw new Error(`Table with ID ${params.tableId} not found`);
    }

    return table.toObject();
  }
}
