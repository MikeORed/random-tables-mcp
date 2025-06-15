import { RollTemplateEntity } from '../domain/entities/roll-template-entity.js';
import { RollTemplate } from '../domain/value-objects/roll-template.js';
import { RollTemplateRepository } from '../ports/secondary/roll-template-repository.js';

/**
 * Use case for updating an existing roll template.
 */
export class UpdateTemplateUseCase {
  /**
   * Creates a new UpdateTemplateUseCase instance.
   * @param templateRepository The repository to use for template updates.
   */
  constructor(private readonly templateRepository: RollTemplateRepository) {}

  /**
   * Executes the use case.
   * @param id The ID of the template to update.
   * @param updates Object containing the updates to apply.
   * @throws Error if the template does not exist.
   */
  async execute(
    id: string,
    updates: {
      name?: string;
      description?: string;
      template?: string;
    },
  ): Promise<void> {
    // Get the existing template
    const existingTemplate = await this.templateRepository.getById(id);
    if (!existingTemplate) {
      throw new Error(`Template with ID ${id} does not exist`);
    }

    // Create a new template entity with updated values
    const updatedTemplate = new RollTemplateEntity(
      id,
      updates.name ?? existingTemplate.name,
      updates.description ?? existingTemplate.description,
      updates.template ? new RollTemplate(updates.template) : existingTemplate.template,
    );

    // Update the template in the repository
    await this.templateRepository.update(updatedTemplate);
  }
}
