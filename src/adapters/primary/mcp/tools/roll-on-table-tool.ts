import { z } from 'zod';
import { RollService } from '../../../../ports/primary/roll-service';
import { BaseTool } from './tool';

/**
 * Input type for the roll on table tool.
 */
type RollOnTableInput = {
  tableId: string;
  count?: number;
};

/**
 * Output type for the roll on table tool.
 */
type RollOnTableOutput = {
  results: Array<{
    tableId: string;
    entryId: string;
    content: string;
    timestamp: string;
  }>;
};

/**
 * Tool for rolling on tables.
 */
export class RollOnTableTool extends BaseTool<RollOnTableInput, RollOnTableOutput> {
  /**
   * Creates a new RollOnTableTool instance.
   * @param rollService The roll service to use.
   */
  constructor(private readonly rollService: RollService) {
    super();
  }

  /**
   * Gets the name of the tool.
   * @returns The tool name.
   */
  protected getToolName(): string {
    return 'roll_on_table';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Roll on a specific table';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<RollOnTableInput> {
    return z.object({
      tableId: z.string().describe('ID of the table to roll on'),
      count: z.number().optional().default(1).describe('Number of rolls to perform (default: 1)'),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<RollOnTableOutput> {
    return z.object({
      results: z
        .array(
          z.object({
            tableId: z.string().describe('ID of the table rolled on'),
            entryId: z.string().describe('ID of the resulting entry'),
            content: z.string().describe('Content of the resulting entry'),
            timestamp: z.string().describe('When the roll occurred'),
          }),
        )
        .describe('Array of roll results'),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: RollOnTableInput): Promise<RollOnTableOutput> {
    // Call the roll service to roll on the table
    const results = await this.rollService.rollOnTable(args.tableId, args.count);

    // Convert results to a serializable format
    const serializedResults = results.map(result => ({
      tableId: result.tableId,
      entryId: result.entryId,
      content: result.content,
      timestamp: result.timestamp.toISOString(),
    }));

    return { results: serializedResults };
  }
}
