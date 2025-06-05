import { RollResult } from "../domain/entities/roll-result";
import { RandomTable } from "../domain/entities/random-table";
import { TableRepository } from "../ports/secondary/table-repository";
import { RandomNumberGenerator } from "../ports/secondary/random-number-generator";
import { RollTemplate } from "../domain/value-objects/roll-template";
import { TemplateReference } from "../domain/value-objects/template-reference";

/**
 * Use case for rolling on a random table.
 */
export class RollOnTableUseCase {
  /**
   * Creates a new RollOnTableUseCase instance.
   * @param repository The table repository to use.
   * @param rng The random number generator to use.
   */
  constructor(
    private readonly repository: TableRepository,
    private readonly rng: RandomNumberGenerator
  ) {}

  /**
   * Executes the use case.
   * @param tableId The ID of the table to roll on.
   * @param count The number of rolls to perform (default: 1).
   * @returns An array of roll results.
   */
  async execute(tableId: string, count: number = 1): Promise<RollResult[]> {
    // Validate inputs
    if (!tableId) {
      throw new Error("Table ID is required");
    }
    if (count < 1) {
      throw new Error("Count must be at least 1");
    }

    // Get the table from the repository
    const table = await this.repository.getById(tableId);
    if (!table) {
      throw new Error(`Table with ID ${tableId} not found`);
    }

    // Perform the rolls
    const results: RollResult[] = [];
    for (let i = 0; i < count; i++) {
      // Use the RNG to generate a random number between 0 and 1
      const randomValue = this.rng.getRandomNumber(0, 1);

      // Roll on the table using the random value
      const result = table.roll(() => randomValue);

      // If the result is a template, resolve it
      if (result.isTemplate) {
        const resolvedResult = await this.resolveTemplateResult(result);
        results.push(resolvedResult);
      } else {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Resolves a template result by rolling on referenced tables.
   * @param result The roll result to resolve.
   * @param maxDepth Maximum resolution depth to prevent infinite loops.
   * @returns A resolved roll result.
   */
  private async resolveTemplateResult(
    result: RollResult,
    maxDepth: number = RollTemplate.MAX_RESOLUTION_DEPTH
  ): Promise<RollResult> {
    // If not a template or max depth reached, return as is
    if (!result.isTemplate || maxDepth <= 0) {
      return result;
    }

    // Create a template from the content
    let template = new RollTemplate(result.content);

    // Extract all references from the template
    const references = template.extractReferences();

    // If no references, return the original result
    if (references.length === 0) {
      return result;
    }

    // Process each reference
    for (const reference of references) {
      // Skip empty references
      if (!reference.tableId && !reference.tableName) {
        continue;
      }

      // Try to get the referenced table by ID
      let referencedTable = null;
      if (reference.tableId) {
        referencedTable = await this.repository.getById(reference.tableId);
      }

      // If not found by ID and name is provided, try to find by name
      if (!referencedTable && reference.tableName) {
        const tables = await this.repository.list();
        referencedTable = tables.find(
          (t: RandomTable) => t.name === reference.tableName
        );
      }

      // If table not found, skip this reference
      if (!referencedTable) {
        continue;
      }

      // Roll on the referenced table the specified number of times
      const referenceResults: string[] = [];
      for (let i = 0; i < reference.rollCount; i++) {
        // Use the RNG to generate a random number between 0 and 1
        const randomValue = this.rng.getRandomNumber(0, 1);

        // Roll on the referenced table
        const rollResult = referencedTable.roll(() => randomValue);

        // If the result is also a template, resolve it recursively
        const resolvedRollResult = rollResult.isTemplate
          ? await this.resolveTemplateResult(rollResult, maxDepth - 1)
          : rollResult;

        // Add the content (resolved if available, otherwise original)
        referenceResults.push(
          resolvedRollResult.resolvedContent || resolvedRollResult.content
        );
      }

      // Join the results with the specified separator
      const replacementValue = referenceResults.join(reference.separator);

      // Replace the reference in the template
      template = template.replaceReference(reference, replacementValue);
    }

    // Check if there are still unresolved references and we haven't reached max depth
    if (template.hasUnresolvedReferences() && maxDepth > 1) {
      // Create a new result with the partially resolved template
      const partialResult = result.withResolvedContent(template.toString());

      // Resolve remaining references recursively
      return this.resolveTemplateResult(partialResult, maxDepth - 1);
    }

    // Return the result with resolved content
    return result.withResolvedContent(template.toString());
  }
}
