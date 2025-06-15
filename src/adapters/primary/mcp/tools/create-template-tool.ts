import { z } from 'zod';
import { RollTemplateService } from '../../../../ports/index.js';
import { BaseTool } from './tool.js';

/**
 * Input type for the create template tool.
 */
type CreateTemplateInput = {
  name: string;
  description?: string;
  template: string;
};

/**
 * Output type for the create template tool.
 */
type CreateTemplateOutput = {
  templateId: string;
  name: string;
  description: string;
  template: string;
};

/**
 * Tool for creating a new roll template.
 */
export class CreateTemplateTool extends BaseTool<CreateTemplateInput, CreateTemplateOutput> {
  /**
   * Creates a new CreateTemplateTool instance.
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
    return 'create_template';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Create a new roll template. Templates can include references to tables using the format {{reference-title::table-id::table-name::roll-number::separator}}.';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<CreateTemplateInput> {
    return z.object({
      name: z.string().describe('Template name'),
      description: z.string().optional().describe('Optional description'),
      template: z
        .string()
        .describe(
          'The template string. Can include references to tables in the format {{reference-title::table-id::table-name::roll-number::separator}}.',
        ),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<CreateTemplateOutput> {
    return z.object({
      templateId: z.string().describe('The ID of the created template'),
      name: z.string().describe('The name of the template'),
      description: z.string().describe('The description of the template'),
      template: z.string().describe('The template string'),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: CreateTemplateInput): Promise<CreateTemplateOutput> {
    const { name, description = '', template } = args;

    // Call the template service to create the template
    const templateId = await this.templateService.createTemplate(name, description, template);

    return {
      templateId,
      name,
      description,
      template,
    };
  }
}
