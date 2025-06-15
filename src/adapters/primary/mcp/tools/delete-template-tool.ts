import { z } from 'zod';
import { RollTemplateService } from '../../../../ports/index.js';
import { BaseTool } from './tool.js';

/**
 * Input type for the delete template tool.
 */
type DeleteTemplateInput = {
  id: string;
};

/**
 * Output type for the delete template tool.
 */
type DeleteTemplateOutput = {
  success: boolean;
};

/**
 * Tool for deleting a roll template.
 */
export class DeleteTemplateTool extends BaseTool<DeleteTemplateInput, DeleteTemplateOutput> {
  /**
   * Creates a new DeleteTemplateTool instance.
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
    return 'delete_template';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'Delete a roll template by ID.';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<DeleteTemplateInput> {
    return z.object({
      id: z.string().describe('The ID of the template to delete'),
    });
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<DeleteTemplateOutput> {
    return z.object({
      success: z.boolean().describe('Whether the deletion was successful'),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(args: DeleteTemplateInput): Promise<DeleteTemplateOutput> {
    const { id } = args;

    try {
      // Call the template service to delete the template
      await this.templateService.deleteTemplate(id);
      return { success: true };
    } catch (error) {
      throw new Error(
        `Failed to delete template: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
