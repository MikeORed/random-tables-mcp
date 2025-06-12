import { z } from 'zod';
import { TableService } from '../../../../ports/primary/table-service';
import { BaseTool } from './tool';

/**
 * Input type for the list tables tool.
 */
type ListTablesInput = {
  filter?: Record<string, unknown>;
};

/**
 * Output type for the list tables tool.
 */
type ListTablesOutput = {
  tables: {
    id: string;
    name: string;
    description?: string;
    entryCount: number;
  }[];
};

/**
 * Tool for listing tables.
 */
export class ListTablesTool extends BaseTool<ListTablesInput, ListTablesOutput> {
  /**
   * Creates a new ListTablesTool instance.
   * @param tableService The table service to use.
   */
  constructor(private readonly tableService: TableService) {
    super();
  }

  /**
   * Gets the name of the tool.
   * @returns The tool name.
   */
  protected getToolName(): string {
    return 'list_tables';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'List available random tables';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<ListTablesInput> {
    return z.object({
      filter: z.record(z.unknown()).optional().describe('Optional filter criteria'),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<ListTablesOutput> {
    return z.object({
      tables: z
        .array(
          z.object({
            id: z.string().describe('Table ID'),
            name: z.string().describe('Table name'),
            description: z.string().optional().describe('Table description'),
            entryCount: z.number().describe('Number of entries in the table'),
          }),
        )
        .describe('Array of tables matching the filter'),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: ListTablesInput): Promise<ListTablesOutput> {
    // Call the table service to list tables
    const tables = await this.tableService.listTables(args.filter);

    // Convert tables to a serializable format
    const serializedTables = tables.map(table => ({
      id: table.id,
      name: table.name,
      description: table.description,
      entryCount: table.entries.length,
    }));

    return { tables: serializedTables };
  }
}
