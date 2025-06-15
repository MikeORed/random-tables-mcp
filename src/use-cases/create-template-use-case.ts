import { RollTemplateEntity } from '../domain/entities/roll-template-entity.js';
import { RollTemplate } from '../domain/value-objects/roll-template.js';
import { RollTemplateRepository } from '../ports/secondary/roll-template-repository.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Use case for creating a new roll template.
 */
export class CreateTemplateUseCase {
  /**
   * Creates a new CreateTemplateUseCase instance.
   * @param templateRepository The repository to use for template persistence.
   */
  constructor(private readonly templateRepository: RollTemplateRepository) {}

  /**
   * Executes the use case.
   * @param name Template name.
   * @param description Template description.
   * @param template The template string.
   * @returns The ID of the created template.
   */
  async execute(name: string, description: string, template: string): Promise<string> {
    // Generate a unique ID for the template
    const id = uuidv4();

    // Create a new RollTemplate value object
    const rollTemplate = new RollTemplate(template);

    // Create a new RollTemplateEntity
    const templateEntity = new RollTemplateEntity(id, name, description, rollTemplate);

    // Save the template to the repository
    return await this.templateRepository.save(templateEntity);
  }
}
