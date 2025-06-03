import { RollResult } from "../../domain/entities/RollResult";
import { RollService } from "../../ports/primary/RollService";
import { RollOnTableUseCase } from "../RollOnTableUseCase";

/**
 * Implementation of the RollService interface.
 */
export class RollServiceImpl implements RollService {
  /**
   * Creates a new RollServiceImpl instance.
   * @param rollOnTableUseCase The use case for rolling on tables.
   */
  constructor(private readonly rollOnTableUseCase: RollOnTableUseCase) {}

  /**
   * Rolls on a table.
   * @param tableId The ID of the table to roll on.
   * @param count The number of rolls to perform (default: 1).
   * @returns An array of roll results.
   */
  async rollOnTable(tableId: string, count: number = 1): Promise<RollResult[]> {
    return await this.rollOnTableUseCase.execute(tableId, count);
  }
}
