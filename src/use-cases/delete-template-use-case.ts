import { RollTemplateRepository } from '../ports/secondary/roll-template-repository.js';

/**
 * Use case for deleting a roll template.
 */
export class DeleteTemplateUseCase {
  /**
   * Creates a new DeleteTemplateUseCase instance.
   * @param templateRepository The repository to use for template deletion.
   */
  constructor(private readonly templateRepository: RollTemplateRepository) {}

  /**
   * Executes the use case.
   * @param id The ID of the template to delete.
   * @throws Error if the template does not exist.
   */
  async execute(id: string): Promise<void> {
    await this.templateRepository.delete(id);
  }
}
