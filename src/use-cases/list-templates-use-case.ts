import { RollTemplateEntity } from '../domain/entities/roll-template-entity.js';
import { RollTemplateRepository } from '../ports/secondary/roll-template-repository.js';

/**
 * Use case for listing roll templates.
 */
export class ListTemplatesUseCase {
  /**
   * Creates a new ListTemplatesUseCase instance.
   * @param templateRepository The repository to use for template listing.
   */
  constructor(private readonly templateRepository: RollTemplateRepository) {}

  /**
   * Executes the use case.
   * @param filter Optional filter criteria.
   * @returns An array of templates matching the filter.
   */
  async execute(filter?: Record<string, unknown>): Promise<RollTemplateEntity[]> {
    return await this.templateRepository.list(filter);
  }
}
