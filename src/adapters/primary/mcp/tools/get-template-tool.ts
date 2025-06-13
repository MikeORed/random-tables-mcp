import { z } from 'zod';
import { RollTemplateService } from '../../../../ports/index.js';
import { BaseTool } from './tool.js';

/**
 * Input type for the get template tool.
 */
type GetTemplateInput = {
  id: string;
};

/**
 * Output type for the get template tool.
 */
type GetTemplateOutput = {
  id: string;
  name: string;
  description: string;
  template: string;
} | null;

/**
 * Tool for getting a roll template by ID.
 */
export class GetTemplateTool extends BaseTool<GetTemplateInput, GetTemplateOutput> {
  /**
   * Creates a new GetTemplateTool instance.
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
    return 'get_template';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Get a roll template by ID.';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<GetTemplateInput> {
    return z.object({
      id: z.string().describe('The ID of the template to get'),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<GetTemplateOutput> {
    return z
      .object({
        id: z.string().describe('The ID of the template'),
        name: z.string().describe('The name of the template'),
        description: z.string().describe('The description of the template'),
        template: z.string().describe('The template string'),
      })
      .nullable();
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: GetTemplateInput): Promise<GetTemplateOutput> {
    const { id } = args;

    // Call the template service to get the template
    const template = await this.templateService.getTemplate(id);

    if (!template) {
      return null;
    }

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      template: template.template.toString(),
    };
  }
}
