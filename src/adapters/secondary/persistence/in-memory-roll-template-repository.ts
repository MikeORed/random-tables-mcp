import { RollTemplateEntity } from '../../../domain/entities/roll-template-entity.js';
import { RollTemplateRepository } from '../../../ports/secondary/roll-template-repository.js';

/**
 * In-memory implementation of the RollTemplateRepository interface.
 * Stores templates in memory, useful for testing and development.
 */
export class InMemoryRollTemplateRepository implements RollTemplateRepository {
  private templates: Map<string, RollTemplateEntity> = new Map();

  /**
   * Saves a template to the repository.
   * @param template The template to save.
   * @returns The ID of the saved template.
   */
  async save(template: RollTemplateEntity): Promise<string> {
    this.templates.set(template.id, template);
    return await Promise.resolve(template.id);
  }

  /**
   * Gets a template by its ID.
   * @param id The ID of the template to get.
   * @returns The template, or null if not found.
   */
  async getById(id: string): Promise<RollTemplateEntity | null> {
    const template = this.templates.get(id);
    return await Promise.resolve(template ?? null);
  }

  /**
   * Updates an existing template.
   * @param template The updated template.
   * @throws Error if the template does not exist.
   */
  async update(template: RollTemplateEntity): Promise<void> {
    if (!this.templates.has(template.id)) {
      throw new Error(`Template with ID ${template.id} does not exist`);
    }
    this.templates.set(template.id, template);
    await Promise.resolve();
  }

  /**
   * Lists templates based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of templates matching the filter.
   */
  async list(filter?: Record<string, unknown>): Promise<RollTemplateEntity[]> {
    let templates = Array.from(this.templates.values());

    await Promise.resolve();

    if (filter) {
      templates = templates.filter(template => {
        // Check if all filter criteria match
        return Object.entries(filter).every(([key, value]) => {
          // Handle nested properties with dot notation (e.g., "template.template")
          const keys = key.split('.');

          // Navigate to the nested property
          let currentObj: unknown = template;
          for (let i = 0; i < keys.length - 1; i++) {
            currentObj = (currentObj as Record<string, unknown>)[keys[i]];
            if (currentObj === undefined) return false;
          }

          const prop = keys[keys.length - 1];

          // Special case for array length
          if (prop === 'length' && Array.isArray(currentObj)) {
            return currentObj.length === value;
          }

          // Regular property comparison
          return (currentObj as Record<string, unknown>)[prop] === value;
        });
      });
    }

    return templates;
  }

  /**
   * Deletes a template by its ID.
   * @param id The ID of the template to delete.
   * @throws Error if the template does not exist.
   */
  async delete(id: string): Promise<void> {
    if (!this.templates.has(id)) {
      throw new Error(`Template with ID ${id} does not exist`);
    }
    this.templates.delete(id);
    await Promise.resolve();
  }

  /**
   * Clears all templates from the repository.
   * Useful for testing.
   */
  clear(): void {
    this.templates.clear();
  }
}
