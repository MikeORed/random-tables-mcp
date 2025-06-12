import { z } from 'zod';
import { TableService } from '../../../../ports/index.js';
import { Range, TableEntry } from '../../../../domain/index.js';
import { v4 as uuidv4 } from 'uuid';
import { BaseTool } from './tool.js';

/**
 * Input type for the create table tool.
 */
type CreateTableInput = {
  name: string;
  description?: string;
  entries?: Array<{
    content: string;
    weight?: number;
    range?: {
      min: number;
      max: number;
    };
  }>;
};

/**
 * Output type for the create table tool.
 */
type CreateTableOutput = {
  tableId: string;
};

/**
 * Tool for creating tables.
 */
export class CreateTableTool extends BaseTool<CreateTableInput, CreateTableOutput> {
  /**
   * Creates a new CreateTableTool instance.
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
    return 'create_table';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Create a new random table. Table entries can include templates to reference other tables using the format {{reference-title::table-id::table-name::roll-number::separator}}.';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<CreateTableInput> {
    return z.object({
      name: z.string().describe('Table name'),
      description: z.string().optional().describe('Optional description'),
      entries: z
        .array(
          z.object({
            content: z
              .string()
              .describe(
                'The content of this entry. Can include templates in the format {{reference-title::table-id::table-name::roll-number::separator}} to reference other tables.',
              ),
            weight: z.number().optional().default(1).describe('Probability weight (default: 1)'),
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
        .describe('Optional initial entries'),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<CreateTableOutput> {
    return z.object({
      tableId: z.string().describe('The ID of the created table'),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: CreateTableInput): Promise<CreateTableOutput> {
    // Convert input entries to TableEntry objects
    const entries = args.entries?.map(entry => {
      // Generate a unique ID for the entry
      const id = uuidv4();

      // Create a Range object if range is provided
      const range = entry.range ? new Range(entry.range.min, entry.range.max) : undefined;

      // Create the TableEntry with all required parameters
      return new TableEntry(id, entry.content, entry.weight ?? 1, range);
    });

    // Call the table service to create the table
    const tableId = await this.tableService.createTable(args.name, args.description, entries);

    return { tableId };
  }
}
