import { z } from 'zod';
import { TableService } from '../../../../ports/index.js';
import { Range, TableEntry } from '../../../../domain/index.js';
import { v4 as uuidv4 } from 'uuid';
import { BaseTool } from './tool.js';

/**
 * Input type for the update table tool.
 */
type UpdateTableInput = {
  tableId: string;
  updates: {
    name?: string;
    description?: string;
    entries?: {
      add?: Array<{
        content: string;
        weight?: number;
        range?: {
          min: number;
          max: number;
        };
      }>;
      update?: Array<{
        id: string;
        updates: {
          content?: string;
          weight?: number;
          range?: {
            min: number;
            max: number;
          };
        };
      }>;
      remove?: string[];
    };
  };
};

/**
 * Output type for the update table tool.
 */
type UpdateTableOutput = {
  success: boolean;
};

/**
 * Tool for updating tables.
 */
export class UpdateTableTool extends BaseTool<UpdateTableInput, UpdateTableOutput> {
  /**
   * Creates a new UpdateTableTool instance.
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
    return 'update_table';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Update an existing random table';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<UpdateTableInput> {
    return z.object({
      tableId: z.string().describe('ID of the table to update'),
      updates: z
        .object({
          name: z.string().optional().describe('New table name'),
          description: z.string().optional().describe('New table description'),
          entries: z
            .object({
              add: z
                .array(
                  z.object({
                    content: z.string().describe('The content of this entry'),
                    weight: z
                      .number()
                      .optional()
                      .default(1)
                      .describe('Probability weight (default: 1)'),
                    range: z
                      .object({
                        min: z.number().describe('Minimum value (inclusive)'),
                        max: z.number().describe('Maximum value (inclusive)'),
                      })
                      .optional()
                      .describe('Optional range of values this entry corresponds to'),
                  }),
                )
                .optional()
                .describe('Entries to add'),
              update: z
                .array(
                  z.object({
                    id: z.string().describe('ID of the entry to update'),
                    updates: z
                      .object({
                        content: z.string().optional().describe('New content'),
                        weight: z.number().optional().describe('New weight'),
                        range: z
                          .object({
                            min: z.number().describe('Minimum value (inclusive)'),
                            max: z.number().describe('Maximum value (inclusive)'),
                          })
                          .optional()
                          .describe('New range'),
                      })
                      .describe('Updates to apply to the entry'),
                  }),
                )
                .optional()
                .describe('Entries to update'),
              remove: z.array(z.string()).optional().describe('IDs of entries to remove'),
            })
            .optional()
            .refine(
              data =>
                data === undefined ||
                data.add !== undefined ||
                data.update !== undefined ||
                data.remove !== undefined,
              {
                message:
                  "At least one of 'add', 'update', or 'remove' must be provided when updating entries",
              },
            )
            .describe('Entry updates'),
        })
        .refine(
          data =>
            data.name !== undefined || data.description !== undefined || data.entries !== undefined,
          {
            message:
              'At least one update property (name, description, or entries) must be provided',
          },
        )
        .describe('Updates to apply to the table'),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<UpdateTableOutput> {
    return z.object({
      success: z.boolean().describe('Whether the update was successful'),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: UpdateTableInput): Promise<UpdateTableOutput> {
    // Prepare the updates object
    const updates: {
      name?: string;
      description?: string;
      entries?: {
        add?: TableEntry[];
        update?: { id: string; updates: Partial<Omit<TableEntry, 'id'>> }[];
        remove?: string[];
      };
    } = {};

    // Add name and description updates if provided
    if (args.updates.name !== undefined) {
      updates.name = args.updates.name;
    }
    if (args.updates.description !== undefined) {
      updates.description = args.updates.description;
    }

    // Add entry updates if provided
    if (args.updates.entries) {
      updates.entries = {};

      // Add new entries
      if (args.updates.entries.add) {
        updates.entries.add = args.updates.entries.add.map(entry => {
          // Generate a unique ID for the entry
          const id = uuidv4();

          // Create a Range object if range is provided
          const range = entry.range ? new Range(entry.range.min, entry.range.max) : undefined;

          // Create the TableEntry with all required parameters
          return new TableEntry(id, entry.content, entry.weight ?? 1, range);
        });
      }

      // Update existing entries
      if (args.updates.entries.update) {
        updates.entries.update = args.updates.entries.update.map(
          ({ id, updates: entryUpdatesData }) => {
            // Create a plain object with the properties to update
            const entryUpdates: Record<string, unknown> = {};

            // Copy content if provided
            if (entryUpdatesData.content !== undefined) {
              entryUpdates.content = entryUpdatesData.content;
            }

            // Copy weight if provided
            if (entryUpdatesData.weight !== undefined) {
              entryUpdates.weight = entryUpdatesData.weight;
            }

            // Create Range object if range is provided
            if (entryUpdatesData.range !== undefined) {
              entryUpdates.range = new Range(
                entryUpdatesData.range.min,
                entryUpdatesData.range.max,
              );
            }

            return {
              id,
              updates: entryUpdates as Partial<Omit<TableEntry, 'id'>>,
            };
          },
        );
      }

      // Remove entries
      if (args.updates.entries.remove) {
        updates.entries.remove = args.updates.entries.remove;
      }
    }

    // Call the table service to update the table
    await this.tableService.updateTable(args.tableId, updates);

    return { success: true };
  }
}
