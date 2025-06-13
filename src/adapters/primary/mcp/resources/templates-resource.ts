import { RollTemplateService } from '../../../../ports/index.js';
import { BaseResource } from './resource.js';

/**
 * Parameters for the templates resource.
 */
type TemplatesResourceParams = Record<string, never>;

/**
 * Content for the templates resource.
 */
type TemplatesResourceContent = {
  templates: Array<{
    id: string;
    name: string;
    description: string;
  }>;
};

/**
 * Resource for accessing all roll templates.
 */
export class TemplatesResource extends BaseResource<
  TemplatesResourceParams,
  TemplatesResourceContent
> {
  /**
   * Creates a new TemplatesResource instance.
   * @param templateService The template service to use.
   */
  constructor(private readonly templateService: RollTemplateService) {
    super();
  }

  /**
   * Gets the URI pattern for this resource.
   * @returns The URI pattern.
   */
  protected getResourceUriPattern(): string {
    return 'templates';
  }

  /**
   * Gets the content of the resource.
   * @returns The resource content.
   */
  protected async getResourceContent(): Promise<TemplatesResourceContent> {
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
