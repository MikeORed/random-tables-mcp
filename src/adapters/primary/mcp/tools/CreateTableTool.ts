import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { TableService } from "../../../../ports/primary/TableService";
import { TableEntry } from "../../../../domain/entities/TableEntry";
import { Range } from "../../../../domain/valueObjects/Range";
import { v4 as uuidv4 } from "uuid";

// Define input schema
const CreateTableInputSchema = z.object({
  name: z.string().describe("Table name"),
  description: z.string().optional().describe("Optional description"),
  entries: z
    .array(
      z.object({
        content: z.string().describe("The content of this entry"),
        weight: z
          .number()
          .optional()
          .default(1)
          .describe("Probability weight (default: 1)"),
        range: z
          .object({
            min: z.number().describe("Minimum value (inclusive)"),
            max: z.number().describe("Maximum value (inclusive)"),
          })
          .optional()
          .describe("Optional range of values this entry corresponds to"),
      })
    )
    .optional()
    .describe("Optional initial entries"),
});

// Define output schema
const CreateTableOutputSchema = z.object({
  tableId: z.string().describe("The ID of the created table"),
});

/**
 * Tool for creating tables.
 */
export class CreateTableTool {
  private readonly name = "create_table";
  private readonly description = "Create a new random table";

  /**
   * Creates a new CreateTableTool instance.
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
      inputSchema: zodToJsonSchema(CreateTableInputSchema),
    };
  }

  /**
   * Executes the tool.
   * @param args The tool arguments.
   * @returns The tool result.
   */
  public async execute(args: any): Promise<any> {
    const parsed = CreateTableInputSchema.parse(args);

    // Convert input entries to TableEntry objects
    const entries = parsed.entries?.map((entry) => {
      // Generate a unique ID for the entry
      const id = uuidv4();

      // Create a Range object if range is provided
      const range = entry.range
        ? new Range(entry.range.min, entry.range.max)
        : undefined;

      // Create the TableEntry with all required parameters
      return new TableEntry(id, entry.content, entry.weight ?? 1, range);
    });

    // Call the table service to create the table
    const tableId = await this.tableService.createTable(
      parsed.name,
      parsed.description,
      entries
    );

    return { tableId };
  }
}
