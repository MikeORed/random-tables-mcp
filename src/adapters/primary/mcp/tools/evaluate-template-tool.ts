import { z } from 'zod';
import { RollTemplateService } from '../../../../ports/index.js';
import { TemplateEvaluationResult } from '../../../../use-cases/evaluate-template-use-case.js';
import { BaseTool } from './tool.js';

/**
 * Input type for the evaluate template tool.
 */
type EvaluateTemplateInput = {
  id: string;
  count?: number;
};

/**
 * Output type for the evaluate template tool.
 */
type EvaluateTemplateOutput = {
  results: TemplateEvaluationResult[];
};

/**
 * Tool for evaluating a roll template.
 */
export class EvaluateTemplateTool extends BaseTool<EvaluateTemplateInput, EvaluateTemplateOutput> {
  /**
   * Creates a new EvaluateTemplateTool instance.
   * @param templateService The template service to use.
   */
  constructor(private readonly templateService: RollTemplateService) {
    super();
  }

  /**
   * Gets the name of the tool.
   * @returns The tool name.
   */
  protected getToolName(): string {
    return 'evaluate_template';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Evaluate a roll template by resolving all references to tables.';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<EvaluateTemplateInput> {
    return z.object({
      id: z.string().describe('The ID of the template to evaluate'),
      count: z
        .number()
        .int()
        .positive()
        .optional()
        .describe('The number of evaluations to perform (default: 1)'),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<EvaluateTemplateOutput> {
    return z.object({
      results: z.array(
        z.object({
          originalTemplate: z.string().describe('The original template string'),
          evaluatedTemplate: z.string().describe('The evaluated template string'),
        }),
      ),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: EvaluateTemplateInput): Promise<EvaluateTemplateOutput> {
    const { id, count } = args;

    try {
      // Call the template service to evaluate the template
      const results = await this.templateService.evaluateTemplate(id, count);
      return { results };
    } catch (error) {
      throw new Error(
        `Failed to evaluate template: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
