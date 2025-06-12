import { RandomTable, TableEntry, RollResult } from '../../../src/domain/index.js';
import { RollOnTableUseCase } from '../../../src/use-cases/roll-on-table-use-case.js';
import { RandomNumberGenerator, TableRepository } from '../../../src/ports/index.js';
import { InMemoryTableRepository } from '../../../src/adapters/secondary/persistence/in-memory-table-repository.js';

/**
 * Mock implementation of RandomNumberGenerator that returns predetermined values.
 */
class MockRandomNumberGenerator implements RandomNumberGenerator {
  private values: number[];
  private currentIndex = 0;

  constructor(values: number[] = [0.5]) {
    this.values = values;
  }

  getRandomNumber(min: number, max: number): number {
    const value = this.values[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.values.length;
    return min + value * (max - min);
  }

  getWeightedIndex(weights: number[]): number {
    const value = this.values[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.values.length;

    // Simulate weighted selection using our predetermined value
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let targetValue = value * totalWeight;

    for (let i = 0; i < weights.length; i++) {
      targetValue -= weights[i];
      if (targetValue <= 0) {
        return i;
      }
    }

    // Fallback (should never happen with proper weights)
    return weights.length - 1;
  }
}

describe('RollOnTableUseCase', () => {
  describe('execute', () => {
    it('should throw an error if tableId is empty', async () => {
      const repository = new InMemoryTableRepository();
      const rng = new MockRandomNumberGenerator();
      const useCase = new RollOnTableUseCase(repository, rng);

      await expect(useCase.execute('')).rejects.toThrow('Table ID is required');
    });

    it('should throw an error if count is less than 1', async () => {
      const repository = new InMemoryTableRepository();
      const rng = new MockRandomNumberGenerator();
      const useCase = new RollOnTableUseCase(repository, rng);

      await expect(useCase.execute('table1', 0)).rejects.toThrow('Count must be at least 1');
    });

    it('should throw an error if table is not found', async () => {
      const repository = new InMemoryTableRepository();
      const rng = new MockRandomNumberGenerator();
      const useCase = new RollOnTableUseCase(repository, rng);

      await expect(useCase.execute('nonexistent')).rejects.toThrow(
        'Table with ID nonexistent not found',
      );
    });

    it('should roll on a normal table with 5 colors of equal weight', async () => {
      // Create a table with 5 colors of equal weight
      const colorEntries = [
        new TableEntry('red', 'Red', 1),
        new TableEntry('blue', 'Blue', 1),
        new TableEntry('green', 'Green', 1),
        new TableEntry('yellow', 'Yellow', 1),
        new TableEntry('purple', 'Purple', 1),
      ];
      const colorTable = new RandomTable('colors', 'Colors', 'A table of colors', colorEntries);

      // Create the repository with the color table
      const repository = new InMemoryTableRepository();
      await repository.save(colorTable);

      // Create an RNG that will select each color in sequence
      const rng = new MockRandomNumberGenerator([0.1, 0.3, 0.5, 0.7, 0.9]);

      // Create the use case
      const useCase = new RollOnTableUseCase(repository, rng);

      // Roll on the table 5 times
      const results = await useCase.execute('colors', 5);

      // Verify the results
      expect(results).toHaveLength(5);
      expect(results[0].content).toBe('Red');
      expect(results[1].content).toBe('Blue');
      expect(results[2].content).toBe('Green');
      expect(results[3].content).toBe('Yellow');
      expect(results[4].content).toBe('Purple');

      // Verify that none of the results are templates
      results.forEach(result => {
        expect(result.isTemplate).toBe(false);
        expect(result.resolvedContent).toBeUndefined();
      });
    });

    it('should roll on a table with entries that reference another table', async () => {
      // Create a table with 5 colors of equal weight
      const colorEntries = [
        new TableEntry('red', 'Red', 1),
        new TableEntry('blue', 'Blue', 1),
        new TableEntry('green', 'Green', 1),
        new TableEntry('yellow', 'Yellow', 1),
        new TableEntry('purple', 'Purple', 1),
      ];
      const colorTable = new RandomTable('colors', 'Colors', 'A table of colors', colorEntries);

      // Create a table with 5 animals that reference the color table
      const animalEntries = [
        new TableEntry('dog', '{{Color::colors::Colors}} Dog', 1),
        new TableEntry('cat', '{{Color::colors::Colors}} Cat', 1),
        new TableEntry('bird', '{{Color::colors::Colors}} Bird', 1),
        new TableEntry('fish', '{{Color::colors::Colors}} Fish', 1),
        new TableEntry('rabbit', '{{Color::colors::Colors}} Rabbit', 1),
      ];
      const animalTable = new RandomTable(
        'animals',
        'Animals',
        'A table of animals',
        animalEntries,
      );

      // Create the repository with both tables
      const repository = new InMemoryTableRepository();
      await repository.save(colorTable);
      await repository.save(animalTable);

      // Create an RNG that will select specific entries
      // First value (0.1) selects the first animal (Dog)
      // Second value (0.1) selects the first color (Red) for the template resolution
      // Third value (0.3) selects the second animal (Cat)
      // Fourth value (0.3) selects the second color (Blue) for the template resolution
      const rng = new MockRandomNumberGenerator([0.1, 0.1, 0.3, 0.3, 0.5, 0.5, 0.7, 0.7, 0.9, 0.9]);

      // Create the use case
      const useCase = new RollOnTableUseCase(repository, rng);

      // Roll on the animal table 5 times
      const results = await useCase.execute('animals', 5);

      // Verify the results
      expect(results).toHaveLength(5);

      // Each result should be a template with resolved content
      expect(results[0].isTemplate).toBe(true);
      expect(results[0].content).toBe('{{Color::colors::Colors}} Dog');
      expect(results[0].resolvedContent).toBe('Red Dog');

      expect(results[1].isTemplate).toBe(true);
      expect(results[1].content).toBe('{{Color::colors::Colors}} Cat');
      expect(results[1].resolvedContent).toBe('Blue Cat');

      expect(results[2].isTemplate).toBe(true);
      expect(results[2].content).toBe('{{Color::colors::Colors}} Bird');
      expect(results[2].resolvedContent).toBe('Green Bird');

      expect(results[3].isTemplate).toBe(true);
      expect(results[3].content).toBe('{{Color::colors::Colors}} Fish');
      expect(results[3].resolvedContent).toBe('Yellow Fish');

      expect(results[4].isTemplate).toBe(true);
      expect(results[4].content).toBe('{{Color::colors::Colors}} Rabbit');
      expect(results[4].resolvedContent).toBe('Purple Rabbit');
    });

    it('should handle multiple rolls on the same template reference', async () => {
      // Create a table with 5 colors of equal weight
      const colorEntries = [
        new TableEntry('red', 'Red', 1),
        new TableEntry('blue', 'Blue', 1),
        new TableEntry('green', 'Green', 1),
        new TableEntry('yellow', 'Yellow', 1),
        new TableEntry('purple', 'Purple', 1),
      ];
      const colorTable = new RandomTable('colors', 'Colors', 'A table of colors', colorEntries);

      // Create a table with an entry that references the color table multiple times
      const multiColorEntries = [
        new TableEntry('multicolor', 'A {{Color::colors::Colors::3::, }} animal', 1),
      ];
      const multiColorTable = new RandomTable(
        'multicolor',
        'MultiColor',
        'A table with multiple color references',
        multiColorEntries,
      );

      // Create the repository with both tables
      const repository = new InMemoryTableRepository();
      await repository.save(colorTable);
      await repository.save(multiColorTable);

      // Create an RNG that will select specific entries
      // First value (0.1) selects the first multicolor entry
      // Next three values select colors for the template resolution (Red, Blue, Green)
      const rng = new MockRandomNumberGenerator([0.1, 0.1, 0.3, 0.5]);

      // Create the use case
      const useCase = new RollOnTableUseCase(repository, rng);

      // Roll on the multicolor table
      const results = await useCase.execute('multicolor', 1);

      // Verify the results
      expect(results).toHaveLength(1);

      // The result should be a template with resolved content
      expect(results[0].isTemplate).toBe(true);
      expect(results[0].content).toBe('A {{Color::colors::Colors::3::, }} animal');
      expect(results[0].resolvedContent).toBe('A Red, Blue, Green animal');
    });
  });
});
