import { RollResult } from '../../domain/entities/roll-result';

/**
 * Interface for roll operations.
 */
export interface RollService {
  /**
   * Rolls on a table.
   * @param tableId The ID of the table to roll on.
   * @param count The number of rolls to perform (default: 1).
   * @returns An array of roll results.
   */
  rollOnTable(tableId: string, count?: number): Promise<RollResult[]>;
}
