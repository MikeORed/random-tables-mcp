import { z } from 'zod';
import { RollTemplateService } from '../../../../ports/index.js';
import { BaseTool } from './tool.js';

/**
 * Input type for the list templates tool.
 */
type ListTemplatesInput = Record<string, never>;

/**
 * Output type for the list templates tool.
 */
type ListTemplatesOutput = {
  templates: Array<{
    id: string;
    name: string;
    description: string;
  }>;
};

/**
 * Tool for listing roll templates.
 */
export class ListTemplateTool extends BaseTool<ListTemplatesInput, ListTemplatesOutput> {
  /**
   * Creates a new ListTemplateTool instance.
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
    return 'list_templates';
  }

  /**
   * Gets the description of the tool.
   * @returns The tool description.
   */
  protected getToolDescription(): string {
    return 'List all available roll templates.';
  }

  /**
   * Gets the input schema for the tool.
   * @returns The input schema.
   */
  protected getInputSchema(): z.ZodType<ListTemplatesInput> {
    return z.object({}).strict();
  }

  /**
   * Gets the output schema for the tool.
   * @returns The output schema.
   */
  protected getOutputSchema(): z.ZodType<ListTemplatesOutput> {
    return z.object({
      templates: z.array(
        z.object({
          id: z.string().describe('The ID of the template'),
          name: z.string().describe('The name of the template'),
          description: z.string().describe('The description of the template'),
        }),
      ),
    });
  }

  /**
   * Implements the tool execution logic.
   * @param args The validated tool arguments.
   * @returns The tool result.
   */
  protected async executeImpl(_args: ListTemplatesInput): Promise<ListTemplatesOutput> {
    // Call the template service to list templates
    const templates = await this.templateService.listTemplates();

    return {
      templates: templates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
      })),
    };
  }
}
