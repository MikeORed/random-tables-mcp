import { RollTemplateEntity } from '../../domain/entities/roll-template-entity.js';

/**
 * Interface for roll template persistence operations.
 */
export interface RollTemplateRepository {
  /**
   * Saves a roll template to the repository.
   * @param template The template to save.
   * @returns The ID of the saved template.
   */
  save(template: RollTemplateEntity): Promise<string>;

  /**
   * Gets a roll template by its ID.
   * @param id The ID of the template to get.
   * @returns The template, or null if not found.
   */
  getById(id: string): Promise<RollTemplateEntity | null>;

  /**
   * Updates an existing roll template.
   * @param template The updated template.
   */
  update(template: RollTemplateEntity): Promise<void>;

  /**
   * Lists roll templates based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of templates matching the filter.
   */
  list(filter?: Record<string, unknown>): Promise<RollTemplateEntity[]>;

  /**
   * Deletes a roll template by its ID.
   * @param id The ID of the template to delete.
   */
  delete(id: string): Promise<void>;
}
