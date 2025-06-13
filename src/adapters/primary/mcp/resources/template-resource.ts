import { RollTemplateService } from '../../../../ports/index.js';
import { BaseResource } from './resource.js';

/**
 * Parameters for the template resource.
 */
type TemplateResourceParams = {
  id: string;
};

/**
 * Content for the template resource.
 */
type TemplateResourceContent = {
  id: string;
  name: string;
  description: string;
  template: string;
};

/**
 * Resource for accessing a specific roll template.
 */
export class TemplateResource extends BaseResource<
  TemplateResourceParams,
  TemplateResourceContent
> {
  /**
   * Creates a new TemplateResource instance.
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
    return 'template://{id}';
  }

  /**
   * Gets the content of the resource.
   * @param params The resource parameters.
   * @returns The resource content.
   */
  protected async getResourceContent(
    params: TemplateResourceParams,
  ): Promise<TemplateResourceContent> {
    const template = await this.templateService.getTemplate(params.id);

    if (!template) {
      throw new Error(`Template with ID ${params.id} not found`);
    }

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      template: template.template.toString(),
    };
  }
}
