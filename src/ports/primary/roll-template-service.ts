import { RollTemplateEntity } from '../../domain/entities/roll-template-entity.js';
import { TemplateEvaluationResult } from '../../use-cases/evaluate-template-use-case.js';

/**
 * Interface for roll template operations.
 */
export interface RollTemplateService {
  /**
   * Creates a new roll template.
   * @param name Template name.
   * @param description Optional description.
   * @param template The template string.
   * @returns The ID of the created template.
   */
  createTemplate(name: string, description: string, template: string): Promise<string>;

  /**
   * Gets a template by its ID.
   * @param id The ID of the template to get.
   * @returns The template, or null if not found.
   */
  getTemplate(id: string): Promise<RollTemplateEntity | null>;

  /**
   * Updates an existing template.
   * @param id The ID of the template to update.
   * @param updates Object containing the updates to apply.
   */
  updateTemplate(
    id: string,
    updates: {
      name?: string;
      description?: string;
      template?: string;
    },
  ): Promise<void>;

  /**
   * Lists templates based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of templates matching the filter.
   */
  listTemplates(filter?: Record<string, unknown>): Promise<RollTemplateEntity[]>;

  /**
   * Deletes a template by its ID.
   * @param id The ID of the template to delete.
   */
  deleteTemplate(id: string): Promise<void>;

  /**
   * Evaluates a template by resolving all references to tables.
   * @param id The ID of the template to evaluate.
   * @param count The number of evaluations to perform (default: 1).
   * @returns An array of template evaluation results.
   */
  evaluateTemplate(id: string, count?: number): Promise<TemplateEvaluationResult[]>;
}
