import { z } from 'zod';
import { TableService } from '../../../../ports/primary/table-service';
import { BaseTool } from './tool';
import { RandomTableDTO } from '@/domain/entities/random-table';

/**
 * Input type for the get table tool.
 */
type GetTableInput = {
  tableId: string;
};

/**
 * Output type for the get table tool.
 */
type GetTableOutput = {
  table: RandomTableDTO;
};

/**
 * Tool for getting a specific table.
 */
export class GetTableTool extends BaseTool<GetTableInput, GetTableOutput> {
  /**
   * Creates a new GetTableTool instance.
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
    return 'get_table';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Get a specific random table by ID';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<GetTableInput> {
    return z.object({
      tableId: z.string().describe('ID of the table to retrieve'),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<GetTableOutput> {
    // Define a schema that matches the PlainRandomTable interface structure
    return z
      .object({
        table: z
          .object({
            id: z.string().describe('Table ID'),
            name: z.string().describe('Table name'),
            description: z.string().describe('Table description'),
            entries: z
              .array(
                z.object({
                  id: z.string().describe('Entry ID'),
                  content: z.string().describe('Entry content'),
                  weight: z.number().describe('Entry weight'),
                  range: z
                    .object({
                      min: z.number().describe('Minimum value (inclusive)'),
                      max: z.number().describe('Maximum value (inclusive)'),
                    })
                    .optional()
                    .describe('Optional range of values this entry corresponds to'),
                }),
              )
              .describe('Array of table entries'),
          })
          .describe('The retrieved table'),
      })
      .strict();
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: GetTableInput): Promise<GetTableOutput> {
    // Call the table service to get the table
    const table = await this.tableService.getTable(args.tableId);

    if (!table) {
      throw new Error(`Table with ID ${args.tableId} not found`);
    }

    // Return the table in a serializable format
    return { table: table.toObject() };
  }
}
