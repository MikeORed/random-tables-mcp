import { RollResult } from "../domain/entities/RollResult";
import { TableRepository } from "../ports/secondary/TableRepository";
import { RandomNumberGenerator } from "../ports/secondary/RandomNumberGenerator";
import { RollTemplate } from "../domain/valueObjects/RollTemplate";

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

      // If the result is a template, we would need to resolve it
      // This would involve looking up other tables and rolling on them
      // For now, we'll just return the unresolved result
      results.push(result);
    }

    return results;
  }

  /**
   * Resolves a template result by rolling on referenced tables.
   * This is a placeholder for future implementation.
   * @param result The roll result to resolve.
   * @param maxDepth Maximum resolution depth to prevent infinite loops.
   * @returns A resolved roll result.
   */
  private async resolveTemplateResult(
    result: RollResult,
    maxDepth: number = RollTemplate.MAX_RESOLUTION_DEPTH
  ): Promise<RollResult> {
    if (!result.isTemplate || maxDepth <= 0) {
      return result;
    }

    // This would involve:
    // 1. Extracting template references from the content
    // 2. For each reference, looking up the referenced table
    // 3. Rolling on the referenced table
    // 4. Replacing the reference with the roll result
    // 5. Recursively resolving any nested templates

    // For now, we'll just return the original result
    return result;
  }
}
