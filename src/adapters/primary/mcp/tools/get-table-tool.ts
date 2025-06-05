import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { TableService } from "../../../../ports/primary/table-service";

// Define input schema
const GetTableInputSchema = z.object({
  tableId: z.string().describe("ID of the table to retrieve"),
});

// Define output schema
const GetTableOutputSchema = z.object({
  table: z.any().describe("The retrieved table"),
});

/**
 * Tool for getting a specific table.
 */
export class GetTableTool {
  private readonly name = "get_table";
  private readonly description = "Get a specific random table by ID";

  /**
   * Creates a new GetTableTool instance.
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
      inputSchema: zodToJsonSchema(GetTableInputSchema),
    };
  }

  /**
   * Executes the tool.
   * @param args The tool arguments.
   * @returns The tool result.
   */
  public async execute(args: any): Promise<{ table: any }> {
    const parsed = GetTableInputSchema.parse(args);

    // Call the table service to get the table
    const table = await this.tableService.getTable(parsed.tableId);

    if (!table) {
      throw new Error(`Table with ID ${parsed.tableId} not found`);
    }

    // Return the table in a serializable format
    return { table: table.toObject() };
  }
}
