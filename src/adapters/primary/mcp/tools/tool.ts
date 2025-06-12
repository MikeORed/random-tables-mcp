import { z } from 'zod';
import { JsonSchema7Type, zodToJsonSchema } from 'zod-to-json-schema';

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: JsonSchema7Type & {
    $schema?: string | undefined;
    definitions?:
      | {
          [key: string]: JsonSchema7Type;
        }
      | undefined;
  };
}

/**
 * Interface for MCP tools.
 * @template TInput - The type of input the tool accepts
 * @template TOutput - The type of output the tool produces
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Tool<TInput = unknown, TOutput = unknown> {
  /**
   * Gets the name of the tool.
   * @returns The tool name.
   */
  getName(): string;

  /**
   * Gets the tool definition for MCP.
   * @returns The tool definition.
   */
  getToolDefinition(): ToolDefinition;

  /**
   * Executes the tool.
   * @param args The tool arguments.
   * @returns The tool result.
   */
  execute(args: unknown): Promise<TOutput>;
}

/**
 * Base class for MCP tools.
 */
export abstract class BaseTool<TInput = unknown, TOutput = unknown>
  implements Tool<TInput, TOutput>
{
  /**
   * Gets the name of the tool.
   * @returns The tool name.
   */
  public getName(): string {
    return this.getToolName();
  }

  /**
   * Gets the tool definition for MCP.
   * @returns The tool definition.
   */
  public getToolDefinition(): ToolDefinition {
    return {
      name: this.getToolName(),
      description: this.getToolDescription(),
      inputSchema: zodToJsonSchema(this.getInputSchema(), {
        $refStrategy: 'none',
      }),
    };
  }

  /**
   * Gets the name of the tool.
   * @returns The tool name.
   */
  protected abstract getToolName(): string;

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected abstract getToolDescription(): string;

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected abstract getInputSchema(): z.ZodType<TInput>;

  /**
   * Gets the output schema for the tool.
   * @returns The output schema, or undefined if not needed.
   */
  protected getOutputSchema(): z.ZodType<TOutput> | undefined {
    return undefined;
  }

  /**
   * Validates the input arguments against the input schema.
   * @param args The arguments to validate.
   * @returns The validated arguments.
   * @throws If the arguments are invalid.
   */
  protected validateInput(args: unknown): TInput {
    return this.getInputSchema().parse(args);
  }

  /**
   * Validates the output result against the output schema.
   * @param result The result to validate.
   * @returns The validated result.
   * @throws If the result is invalid.
   */
  protected validateOutput(result: TOutput): TOutput {
    const outputSchema = this.getOutputSchema();
    if (outputSchema) {
      return outputSchema.parse(result);
    }
    return result;
  }

  /**
   * Executes the tool.
   * @param args The tool arguments.
   * @returns The tool result.
   */
  public async execute(args: unknown): Promise<TOutput> {
    // Validate input
    const validatedInput = this.validateInput(args);

    // Execute the tool implementation
    const result = await this.executeImpl(validatedInput);

    // Validate output if an output schema is provided
    return this.validateOutput(result);
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected abstract executeImpl(args: TInput): Promise<TOutput>;
}
