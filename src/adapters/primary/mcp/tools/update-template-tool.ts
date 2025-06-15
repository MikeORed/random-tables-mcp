import { z } from 'zod';
import { RollTemplateService } from '../../../../ports/index.js';
import { BaseTool } from './tool.js';

/**
 * Input type for the update template tool.
 */
type UpdateTemplateInput = {
  id: string;
  name?: string;
  description?: string;
  template?: string;
};

/**
 * Output type for the update template tool.
 */
type UpdateTemplateOutput = {
  success: boolean;
};

/**
 * Tool for updating a roll template.
 */
export class UpdateTemplateTool extends BaseTool<UpdateTemplateInput, UpdateTemplateOutput> {
  /**
   * Creates a new UpdateTemplateTool instance.
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
    return 'update_template';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Update an existing roll template.';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<UpdateTemplateInput> {
    return z.object({
      id: z.string().describe('The ID of the template to update'),
      name: z.string().optional().describe('New template name'),
      description: z.string().optional().describe('New template description'),
      template: z
        .string()
        .optional()
        .describe(
          'New template string. Can include references to tables in the format {{reference-title::table-id::table-name::roll-number::separator}}.',
        ),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<UpdateTemplateOutput> {
    return z.object({
      success: z.boolean().describe('Whether the update was successful'),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: UpdateTemplateInput): Promise<UpdateTemplateOutput> {
    const { id, name, description, template } = args;

    // Check if at least one update field is provided
    if (!name && !description && !template) {
      throw new Error(
        'At least one update field (name, description, or template) must be provided',
      );
    }

    // Create the updates object with only the provided fields
    const updates: {
      name?: string;
      description?: string;
      template?: string;
    } = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (template !== undefined) updates.template = template;

    try {
      // Call the template service to update the template
      await this.templateService.updateTemplate(id, updates);
      return { success: true };
    } catch (error) {
      throw new Error(
        `Failed to update template: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
