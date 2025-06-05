import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { TableService } from "../../../../ports/primary/table-service";
import { TableEntry } from "../../../../domain/entities/table-entry";
import { Range } from "../../../../domain/value-objects/roll-range";
import { v4 as uuidv4 } from "uuid";

// Define input schema
const UpdateTableInputSchema = z.object({
  tableId: z.string().describe("ID of the table to update"),
  updates: z
    .object({
      name: z.string().optional().describe("New table name"),
      description: z.string().optional().describe("New table description"),
      entries: z
        .object({
          add: z
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
                  .describe(
                    "Optional range of values this entry corresponds to"
                  ),
              })
            )
            .optional()
            .describe("Entries to add"),
          update: z
            .array(
              z.object({
                id: z.string().describe("ID of the entry to update"),
                updates: z
                  .object({
                    content: z.string().optional().describe("New content"),
                    weight: z.number().optional().describe("New weight"),
                    range: z
                      .object({
                        min: z.number().describe("Minimum value (inclusive)"),
                        max: z.number().describe("Maximum value (inclusive)"),
                      })
                      .optional()
                      .describe("New range"),
                  })
                  .describe("Updates to apply to the entry"),
              })
            )
            .optional()
            .describe("Entries to update"),
          remove: z
            .array(z.string())
            .optional()
            .describe("IDs of entries to remove"),
        })
        .optional()
        .refine(
          (data) =>
            data === undefined ||
            data.add !== undefined ||
            data.update !== undefined ||
            data.remove !== undefined,
          {
            message:
              "At least one of 'add', 'update', or 'remove' must be provided when updating entries",
          }
        )
        .describe("Entry updates"),
    })
    .refine(
      (data) =>
        data.name !== undefined ||
        data.description !== undefined ||
        data.entries !== undefined,
      {
        message:
          "At least one update property (name, description, or entries) must be provided",
      }
    )
    .describe("Updates to apply to the table"),
});

// Define output schema
const UpdateTableOutputSchema = z.object({
  success: z.boolean().describe("Whether the update was successful"),
});

/**
 * Tool for updating tables.
 */
export class UpdateTableTool {
  private readonly name = "update_table";
  private readonly description = "Update an existing random table";

  /**
   * Creates a new UpdateTableTool instance.
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
      inputSchema: zodToJsonSchema(UpdateTableInputSchema, {
        $refStrategy: "none",
      }),
    };
  }

  /**
   * Executes the tool.
   * @param args The tool arguments.
   * @returns The tool result.
   */
  public async execute(args: any): Promise<any> {
    const parsed = UpdateTableInputSchema.parse(args);

    // Prepare the updates object
    const updates: {
      name?: string;
      description?: string;
      entries?: {
        add?: TableEntry[];
        update?: { id: string; updates: Partial<Omit<TableEntry, "id">> }[];
        remove?: string[];
      };
    } = {};

    // Add name and description updates if provided
    if (parsed.updates.name !== undefined) {
      updates.name = parsed.updates.name;
    }
    if (parsed.updates.description !== undefined) {
      updates.description = parsed.updates.description;
    }

    // Add entry updates if provided
    if (parsed.updates.entries) {
      updates.entries = {};

      // Add new entries
      if (parsed.updates.entries.add) {
        updates.entries.add = parsed.updates.entries.add.map((entry) => {
          // Generate a unique ID for the entry
          const id = uuidv4();

          // Create a Range object if range is provided
          const range = entry.range
            ? new Range(entry.range.min, entry.range.max)
            : undefined;

          // Create the TableEntry with all required parameters
          return new TableEntry(id, entry.content, entry.weight ?? 1, range);
        });
      }

      // Update existing entries
      if (parsed.updates.entries.update) {
        updates.entries.update = parsed.updates.entries.update.map(
          ({ id, updates }) => {
            // Create a plain object with the properties to update
            const entryUpdates: Record<string, any> = {};

            // Copy content if provided
            if (updates.content !== undefined) {
              entryUpdates.content = updates.content;
            }

            // Copy weight if provided
            if (updates.weight !== undefined) {
              entryUpdates.weight = updates.weight;
            }

            // Create Range object if range is provided
            if (updates.range !== undefined) {
              entryUpdates.range = new Range(
                updates.range.min,
                updates.range.max
              );
            }

            return {
              id,
              updates: entryUpdates as Partial<Omit<TableEntry, "id">>,
            };
          }
        );
      }

      // Remove entries
      if (parsed.updates.entries.remove) {
        updates.entries.remove = parsed.updates.entries.remove;
      }
    }

    // Call the table service to update the table
    await this.tableService.updateTable(parsed.tableId, updates);

    return { success: true };
  }
}
