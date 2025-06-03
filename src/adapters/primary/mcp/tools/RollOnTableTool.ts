import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { RollService } from "../../../../ports/primary/RollService";

// Define input schema
const RollOnTableInputSchema = z.object({
  tableId: z.string().describe("ID of the table to roll on"),
  count: z
    .number()
    .optional()
    .default(1)
    .describe("Number of rolls to perform (default: 1)"),
});

// Define output schema
const RollOnTableOutputSchema = z.object({
  results: z
    .array(
      z.object({
        tableId: z.string().describe("ID of the table rolled on"),
        entryId: z.string().describe("ID of the resulting entry"),
        content: z.string().describe("Content of the resulting entry"),
        timestamp: z.string().describe("When the roll occurred"),
      })
    )
    .describe("Array of roll results"),
});

/**
 * Tool for rolling on tables.
 */
export class RollOnTableTool {
  private readonly name = "roll_on_table";
  private readonly description = "Roll on a specific table";

  /**
   * Creates a new RollOnTableTool instance.
   * @param rollService The roll service to use.
   */
  constructor(private readonly rollService: RollService) {}

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
      inputSchema: zodToJsonSchema(RollOnTableInputSchema),
    };
  }

  /**
   * Executes the tool.
   * @param args The tool arguments.
   * @returns The tool result.
   */
  public async execute(args: any): Promise<any> {
    const parsed = RollOnTableInputSchema.parse(args);

    // Call the roll service to roll on the table
    const results = await this.rollService.rollOnTable(
      parsed.tableId,
      parsed.count
    );

    // Convert results to a serializable format
    const serializedResults = results.map((result) => ({
      tableId: result.tableId,
      entryId: result.entryId,
      content: result.content,
      timestamp: result.timestamp.toISOString(),
    }));

    return { results: serializedResults };
  }
}
