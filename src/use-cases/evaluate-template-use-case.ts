import { RandomTable, RollTemplate, TemplateReference } from '../domain/index.js';
import { RandomNumberGenerator, TableRepository } from '../ports/index.js';
import { RollTemplateRepository } from '../ports/secondary/roll-template-repository.js';

/**
 * Result of a template evaluation.
 */
export interface TemplateEvaluationResult {
  /**
   * The original template string.
   */
  originalTemplate: string;

  /**
   * The evaluated template string.
   */
  evaluatedTemplate: string;
}

/**
 * Use case for evaluating a roll template.
 */
export class EvaluateTemplateUseCase {
  /**
   * Creates a new EvaluateTemplateUseCase instance.
   * @param templateRepository The template repository to use.
   * @param tableRepository The table repository to use.
   * @param rng The random number generator to use.
   */
  constructor(
    private readonly templateRepository: RollTemplateRepository,
    private readonly tableRepository: TableRepository,
    private readonly rng: RandomNumberGenerator,
  ) {}

  /**
   * Executes the use case.
   * @param templateId The ID of the template to evaluate.
   * @param count The number of evaluations to perform (default: 1).
   * @returns An array of template evaluation results.
   */
  async execute(templateId: string, count: number = 1): Promise<TemplateEvaluationResult[]> {
    // Validate inputs
    if (!templateId) {
      throw new Error('Template ID is required');
    }
    if (count < 1) {
      throw new Error('Count must be at least 1');
    }

    // Get the template from the repository
    const templateEntity = await this.templateRepository.getById(templateId);
    if (!templateEntity) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Get the template string
    const templateString = templateEntity.template.toString();

    // Perform the evaluations
    const results: TemplateEvaluationResult[] = [];
    for (let i = 0; i < count; i++) {
      // Create a new template instance for each evaluation
      const template = new RollTemplate(templateString);

      // Evaluate the template
      const evaluatedTemplate = await this.evaluateTemplate(template);

      // Add the result
      results.push({
        originalTemplate: templateString,
        evaluatedTemplate,
      });
    }

    return results;
  }

  /**
   * Evaluates a template by resolving all references.
   * @param template The template to evaluate.
   * @param maxDepth Maximum resolution depth to prevent infinite loops.
   * @param visitedTables Set of table IDs and names that have been visited in this resolution chain.
   * @returns The evaluated template string.
   */
  private async evaluateTemplate(
    template: RollTemplate,
    maxDepth: number = RollTemplate.MAX_RESOLUTION_DEPTH,
    visitedTables: Set<string> = new Set(),
  ): Promise<string> {
    // If max depth reached, return as is
    if (maxDepth <= 0) {
      return template.toString();
    }

    // Extract all references from the template
    const references = template.extractReferences();

    // If no references, return the original template
    if (references.length === 0) {
      return template.toString();
    }

    // Process each reference
    let evaluatedTemplate = template;
    for (const reference of references) {
      // Skip empty references
      if (!reference.tableId && !reference.tableName) {
        continue;
      }

      // Find the referenced table
      const referencedTable = await this.findReferencedTable(reference);

      // If table not found, skip this reference
      if (!referencedTable) {
        continue;
      }

      // Check for circular references
      if (
        visitedTables.has(referencedTable.id) ||
        (referencedTable.name && visitedTables.has(referencedTable.name))
      ) {
        // Replace with a warning message instead of causing an infinite loop
        const warningMessage = `[Circular reference detected: ${
          referencedTable.name || referencedTable.id
        }]`;
        evaluatedTemplate = evaluatedTemplate.replaceReference(reference, warningMessage);
        continue;
      }

      // Add this table to the visited set to track the resolution chain
      visitedTables.add(referencedTable.id);
      if (referencedTable.name) {
        visitedTables.add(referencedTable.name);
      }

      // Roll on the referenced table and get the results
      const referenceResults = await this.rollOnReferencedTable(
        referencedTable,
        reference.rollCount,
        maxDepth - 1,
        new Set(visitedTables), // Create a copy of the set to avoid modifying the original
      );

      // Join the results with the specified separator
      const replacementValue = referenceResults.join(reference.separator);

      // Replace the reference in the template
      evaluatedTemplate = evaluatedTemplate.replaceReference(reference, replacementValue);
    }

    // Check if there are still unresolved references and we haven't reached max depth
    if (evaluatedTemplate.hasUnresolvedReferences() && maxDepth > 1) {
      // Resolve remaining references recursively
      return this.evaluateTemplate(evaluatedTemplate, maxDepth - 1, visitedTables);
    }

    // Return the evaluated template
    return evaluatedTemplate.toString();
  }

  /**
   * Finds a table referenced by a template reference.
   * @param reference The template reference
   * @returns The referenced table, or null if not found
   */
  private async findReferencedTable(reference: TemplateReference): Promise<RandomTable | null> {
    // Try to get the referenced table by ID
    if (reference.tableId) {
      const table = await this.tableRepository.getById(reference.tableId);
      if (table) {
        return table;
      }
    }

    // If not found by ID and name is provided, try to find by name
    if (reference.tableName) {
      const tables = await this.tableRepository.list();
      return tables.find(t => t.name === reference.tableName) ?? null;
    }

    return null;
  }

  /**
   * Rolls on a referenced table multiple times and resolves any nested templates.
   * @param table The table to roll on
   * @param count Number of times to roll
   * @param maxDepth Maximum resolution depth for nested templates
   * @param visitedTables Set of table IDs and names that have been visited in this resolution chain
   * @returns Array of roll result contents
   */
  private async rollOnReferencedTable(
    table: RandomTable,
    count: number,
    maxDepth: number,
    visitedTables: Set<string> = new Set(),
  ): Promise<string[]> {
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      // Use the RNG to generate a random number between 0 and 1
      const randomValue = this.rng.getRandomNumber(0, 1);

      // Roll on the referenced table
      const rollResult = table.roll(() => randomValue);

      // If the result is also a template, create a RollTemplate and evaluate it
      if (rollResult.isTemplate) {
        const template = new RollTemplate(rollResult.content);
        const evaluatedContent = await this.evaluateTemplate(template, maxDepth, visitedTables);
        results.push(evaluatedContent);
      } else {
        // Add the content as is
        results.push(rollResult.content);
      }
    }

    return results;
  }
}
