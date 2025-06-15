import { RollTemplateEntity } from '../../domain/entities/roll-template-entity.js';
import { RollTemplateService } from '../../ports/primary/roll-template-service.js';
import { CreateTemplateUseCase } from '../create-template-use-case.js';
import { DeleteTemplateUseCase } from '../delete-template-use-case.js';
import {
  EvaluateTemplateUseCase,
  TemplateEvaluationResult,
} from '../evaluate-template-use-case.js';
import { GetTemplateUseCase } from '../get-template-use-case.js';
import { ListTemplatesUseCase } from '../list-templates-use-case.js';
import { UpdateTemplateUseCase } from '../update-template-use-case.js';

/**
 * Implementation of the RollTemplateService interface.
 */
export class RollTemplateServiceImpl implements RollTemplateService {
  /**
   * Creates a new RollTemplateServiceImpl instance.
   * @param createTemplateUseCase The use case for creating templates.
   * @param getTemplateUseCase The use case for getting templates.
   * @param listTemplatesUseCase The use case for listing templates.
   * @param updateTemplateUseCase The use case for updating templates.
   * @param deleteTemplateUseCase The use case for deleting templates.
   * @param evaluateTemplateUseCase The use case for evaluating templates.
   */
  constructor(
    private readonly createTemplateUseCase: CreateTemplateUseCase,
    private readonly getTemplateUseCase: GetTemplateUseCase,
    private readonly listTemplatesUseCase: ListTemplatesUseCase,
    private readonly updateTemplateUseCase: UpdateTemplateUseCase,
    private readonly deleteTemplateUseCase: DeleteTemplateUseCase,
    private readonly evaluateTemplateUseCase: EvaluateTemplateUseCase,
  ) {}

  /**
   * Creates a new roll template.
   * @param name Template name.
   * @param description Template description.
   * @param template The template string.
   * @returns The ID of the created template.
   */
  async createTemplate(name: string, description: string, template: string): Promise<string> {
    return await this.createTemplateUseCase.execute(name, description, template);
  }

  /**
   * Gets a template by its ID.
   * @param id The ID of the template to get.
   * @returns The template, or null if not found.
   */
  async getTemplate(id: string): Promise<RollTemplateEntity | null> {
    return await this.getTemplateUseCase.execute(id);
  }

  /**
   * Updates an existing template.
   * @param id The ID of the template to update.
   * @param updates Object containing the updates to apply.
   */
  async updateTemplate(
    id: string,
    updates: {
      name?: string;
      description?: string;
      template?: string;
    },
  ): Promise<void> {
    await this.updateTemplateUseCase.execute(id, updates);
  }

  /**
   * Lists templates based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of templates matching the filter.
   */
  async listTemplates(filter?: Record<string, unknown>): Promise<RollTemplateEntity[]> {
    return await this.listTemplatesUseCase.execute(filter);
  }

  /**
   * Deletes a template by its ID.
   * @param id The ID of the template to delete.
   */
  async deleteTemplate(id: string): Promise<void> {
    await this.deleteTemplateUseCase.execute(id);
  }

  /**
   * Evaluates a template by resolving all references to tables.
   * @param id The ID of the template to evaluate.
   * @param count The number of evaluations to perform (default: 1).
   * @returns An array of template evaluation results.
   */
  async evaluateTemplate(id: string, count: number = 1): Promise<TemplateEvaluationResult[]> {
    return await this.evaluateTemplateUseCase.execute(id, count);
  }
}
