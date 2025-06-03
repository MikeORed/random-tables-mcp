import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { TableService } from "../../../../ports/primary/TableService";

// Define input schema
const ListTablesInputSchema = z.object({
  filter: z.record(z.any()).optional().describe("Optional filter criteria"),
});

// Define output schema
const ListTablesOutputSchema = z.object({
  tables: z
    .array(
      z.object({
        id: z.string().describe("Table ID"),
        name: z.string().describe("Table name"),
        description: z.string().optional().describe("Table description"),
        entryCount: z.number().describe("Number of entries in the table"),
      })
    )
    .describe("Array of tables matching the filter"),
});

/**
 * Tool for listing tables.
 */
export class ListTablesTool {
  private readonly name = "list_tables";
  private readonly description = "List available random tables";

  /**
   * Creates a new ListTablesTool instance.
   * @param tableService The table service to use.
   */
  constructor(private readonly tableService: TableService) {}

  /**
   * Gets the name of the tool.
   * @returns The tool name.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Gets the tool definition for MCP.
   * @returns The tool definition.
   */
  public getToolDefinition(): any {
    return {
      name: this.name,
      description: this.description,
      inputSchema: zodToJsonSchema(ListTablesInputSchema),
    };
  }

  /**
   * Executes the tool.
   * @param args The tool arguments.
   * @returns The tool result.
   */
  public async execute(args: any): Promise<any> {
    const parsed = ListTablesInputSchema.parse(args);

    // Call the table service to list tables
    const tables = await this.tableService.listTables(parsed.filter);

    // Convert tables to a serializable format
    const serializedTables = tables.map((table) => ({
      id: table.id,
      name: table.name,
      description: table.description,
      entryCount: table.entries.length,
    }));

    return { tables: serializedTables };
  }
}
