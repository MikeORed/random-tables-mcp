import { RollTemplateEntity } from '../domain/entities/roll-template-entity.js';
import { RollTemplateRepository } from '../ports/secondary/roll-template-repository.js';

/**
 * Use case for getting a roll template by ID.
 */
export class GetTemplateUseCase {
  /**
   * Creates a new GetTemplateUseCase instance.
   * @param templateRepository The repository to use for template retrieval.
   */
  constructor(private readonly templateRepository: RollTemplateRepository) {}

  /**
   * Executes the use case.
   * @param id The ID of the template to get.
   * @returns The template, or null if not found.
   */
  async execute(id: string): Promise<RollTemplateEntity | null> {
    return await this.templateRepository.getById(id);
  }
}
