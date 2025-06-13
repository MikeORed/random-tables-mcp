import { RollTemplateEntity } from '../../../src/domain/entities/roll-template-entity.js';
import { RandomTable, TableEntry } from '../../../src/domain/index.js';
import { RollTemplate } from '../../../src/domain/value-objects/roll-template.js';
import { RandomNumberGenerator } from '../../../src/ports/secondary/random-number-generator.js';
import { RollTemplateRepository } from '../../../src/ports/secondary/roll-template-repository.js';
import { TableRepository } from '../../../src/ports/secondary/table-repository.js';
import { EvaluateTemplateUseCase } from '../../../src/use-cases/evaluate-template-use-case.js';

/**
 * Mock implementation of RollTemplateRepository
 */
class MockRollTemplateRepository implements RollTemplateRepository {
  private templates: Map<string, RollTemplateEntity> = new Map();

  constructor(initialTemplates: RollTemplateEntity[] = []) {
    initialTemplates.forEach(template => this.templates.set(template.id, template));
  }

  async save(template: RollTemplateEntity): Promise<string> {
    this.templates.set(template.id, template);
    return template.id;
  }

  async getById(id: string): Promise<RollTemplateEntity | null> {
    return this.templates.get(id) || null;
  }

  async update(template: RollTemplateEntity): Promise<void> {
    if (!this.templates.has(template.id)) {
      throw new Error(`Template with ID ${template.id} does not exist`);
    }
    this.templates.set(template.id, template);
  }

  async list(filter?: Record<string, unknown>): Promise<RollTemplateEntity[]> {
    let templates = Array.from(this.templates.values());

    if (filter) {
      templates = templates.filter(template => {
        return Object.entries(filter).every(([key, value]) => {
          const keys = key.split('.');
          let currentObj: unknown = template;
          for (let i = 0; i < keys.length - 1; i++) {
            currentObj = (currentObj as Record<string, unknown>)[keys[i]];
            if (currentObj === undefined) return false;
          }
          const prop = keys[keys.length - 1];
          return (currentObj as Record<string, unknown>)[prop] === value;
        });
      });
    }

    return templates;
  }

  async delete(id: string): Promise<void> {
    if (!this.templates.has(id)) {
      throw new Error(`Template with ID ${id} does not exist`);
    }
    this.templates.delete(id);
  }
}

/**
 * Mock implementation of TableRepository
 */
class MockTableRepository implements TableRepository {
  private tables: Map<string, RandomTable> = new Map();

  constructor(initialTables: RandomTable[] = []) {
    initialTables.forEach(table => this.tables.set(table.id, table));
  }

  async save(table: RandomTable): Promise<string> {
    this.tables.set(table.id, table);
    return table.id;
  }

  async getById(id: string): Promise<RandomTable | null> {
    return this.tables.get(id) || null;
  }

  async update(table: RandomTable): Promise<void> {
    if (!this.tables.has(table.id)) {
      throw new Error(`Table with ID ${table.id} does not exist`);
    }
    this.tables.set(table.id, table);
  }

  async list(filter?: Record<string, unknown>): Promise<RandomTable[]> {
    let tables = Array.from(this.tables.values());

    if (filter) {
      tables = tables.filter(table => {
        return Object.entries(filter).every(([key, value]) => {
          return (table as unknown as Record<string, unknown>)[key] === value;
        });
      });
    }

    return tables;
  }

  async delete(id: string): Promise<void> {
    if (!this.tables.has(id)) {
      throw new Error(`Table with ID ${id} does not exist`);
    }
    this.tables.delete(id);
  }
}

/**
 * Mock implementation of RandomNumberGenerator
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

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let targetValue = value * totalWeight;

    for (let i = 0; i < weights.length; i++) {
      targetValue -= weights[i];
      if (targetValue <= 0) {
        return i;
      }
    }

    return weights.length - 1;
  }
}

describe('EvaluateTemplateUseCase', () => {
  describe('execute', () => {
    it('should throw an error if templateId is empty', async () => {
      const templateRepository = new MockRollTemplateRepository();
      const tableRepository = new MockTableRepository();
      const rng = new MockRandomNumberGenerator();
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      await expect(useCase.execute('')).rejects.toThrow('Template ID is required');
    });

    it('should throw an error if count is less than 1', async () => {
      const templateRepository = new MockRollTemplateRepository();
      const tableRepository = new MockTableRepository();
      const rng = new MockRandomNumberGenerator();
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      await expect(useCase.execute('template1', 0)).rejects.toThrow('Count must be at least 1');
    });

    it('should throw an error if template is not found', async () => {
      const templateRepository = new MockRollTemplateRepository();
      const tableRepository = new MockTableRepository();
      const rng = new MockRandomNumberGenerator();
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      await expect(useCase.execute('nonexistent')).rejects.toThrow(
        'Template with ID nonexistent not found',
      );
    });

    it('should evaluate a simple template without references', async () => {
      // Create a simple template without references
      const simpleTemplate = new RollTemplateEntity(
        'simple-template',
        'Simple Template',
        'A template without references',
        new RollTemplate('This is a simple template without references'),
      );

      // Set up repositories
      const templateRepository = new MockRollTemplateRepository([simpleTemplate]);
      const tableRepository = new MockTableRepository();
      const rng = new MockRandomNumberGenerator();

      // Create the use case
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      // Execute the use case
      const results = await useCase.execute('simple-template');

      // Verify the results
      expect(results).toHaveLength(1);
      expect(results[0].originalTemplate).toBe('This is a simple template without references');
      expect(results[0].evaluatedTemplate).toBe('This is a simple template without references');
    });

    it('should evaluate a template with a single reference', async () => {
      // Create a table with colors
      const colorEntries = [
        new TableEntry('red', 'Red', 1),
        new TableEntry('blue', 'Blue', 1),
        new TableEntry('green', 'Green', 1),
      ];
      const colorTable = new RandomTable('colors', 'Colors', 'A table of colors', colorEntries);

      // Create a template that references the color table
      const colorTemplate = new RollTemplateEntity(
        'color-template',
        'Color Template',
        'A template that references the color table',
        new RollTemplate('My favorite color is {{Color::colors::Colors}}'),
      );

      // Set up repositories
      const templateRepository = new MockRollTemplateRepository([colorTemplate]);
      const tableRepository = new MockTableRepository([colorTable]);

      // Create an RNG that will select the first color (Red)
      const rng = new MockRandomNumberGenerator([0.1]);

      // Create the use case
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      // Execute the use case
      const results = await useCase.execute('color-template');

      // Verify the results
      expect(results).toHaveLength(1);
      expect(results[0].originalTemplate).toBe('My favorite color is {{Color::colors::Colors}}');
      expect(results[0].evaluatedTemplate).toBe('My favorite color is Red');
    });

    it('should evaluate a template with multiple references', async () => {
      // Create tables
      const colorEntries = [
        new TableEntry('red', 'Red', 1),
        new TableEntry('blue', 'Blue', 1),
        new TableEntry('green', 'Green', 1),
      ];
      const colorTable = new RandomTable('colors', 'Colors', 'A table of colors', colorEntries);

      const animalEntries = [
        new TableEntry('dog', 'Dog', 1),
        new TableEntry('cat', 'Cat', 1),
        new TableEntry('bird', 'Bird', 1),
      ];
      const animalTable = new RandomTable(
        'animals',
        'Animals',
        'A table of animals',
        animalEntries,
      );

      // Create a template that references both tables
      const multiRefTemplate = new RollTemplateEntity(
        'multi-ref-template',
        'Multi-Reference Template',
        'A template with multiple references',
        new RollTemplate('I have a {{Color::colors::Colors}} {{Animal::animals::Animals}}'),
      );

      // Set up repositories
      const templateRepository = new MockRollTemplateRepository([multiRefTemplate]);
      const tableRepository = new MockTableRepository([colorTable, animalTable]);

      // Create an RNG that will select specific entries (Red, Dog)
      const rng = new MockRandomNumberGenerator([0.1, 0.1]);

      // Create the use case
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      // Execute the use case
      const results = await useCase.execute('multi-ref-template');

      // Verify the results
      expect(results).toHaveLength(1);
      expect(results[0].originalTemplate).toBe(
        'I have a {{Color::colors::Colors}} {{Animal::animals::Animals}}',
      );
      expect(results[0].evaluatedTemplate).toBe('I have a Red Dog');
    });

    it('should evaluate a template with nested references', async () => {
      // Create tables
      const colorEntries = [new TableEntry('red', 'Red', 1), new TableEntry('blue', 'Blue', 1)];
      const colorTable = new RandomTable('colors', 'Colors', 'A table of colors', colorEntries);

      const animalEntries = [new TableEntry('dog', 'Dog', 1), new TableEntry('cat', 'Cat', 1)];
      const animalTable = new RandomTable(
        'animals',
        'Animals',
        'A table of animals',
        animalEntries,
      );

      // Create a table with entries that reference other tables
      const petEntries = [
        new TableEntry('pet', 'a {{Color::colors::Colors}} {{Animal::animals::Animals}}', 1),
      ];
      const petTable = new RandomTable('pets', 'Pets', 'A table of pets', petEntries);

      // Create a template that references the pet table
      const nestedTemplate = new RollTemplateEntity(
        'nested-template',
        'Nested Template',
        'A template with nested references',
        new RollTemplate('I have {{Pet::pets::Pets}}'),
      );

      // Set up repositories
      const templateRepository = new MockRollTemplateRepository([nestedTemplate]);
      const tableRepository = new MockTableRepository([colorTable, animalTable, petTable]);

      // Create an RNG that will select specific entries (pet entry, Red, Dog)
      const rng = new MockRandomNumberGenerator([0.1, 0.1, 0.1]);

      // Create the use case
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      // Execute the use case
      const results = await useCase.execute('nested-template');

      // Verify the results
      expect(results).toHaveLength(1);
      expect(results[0].originalTemplate).toBe('I have {{Pet::pets::Pets}}');
      expect(results[0].evaluatedTemplate).toBe('I have a Red Dog');
    });

    it('should evaluate a template with multiple rolls on the same table', async () => {
      // Create a table with colors
      const colorEntries = [
        new TableEntry('red', 'Red', 1),
        new TableEntry('blue', 'Blue', 1),
        new TableEntry('green', 'Green', 1),
      ];
      const colorTable = new RandomTable('colors', 'Colors', 'A table of colors', colorEntries);

      // Create a template that references the color table multiple times
      const multiRollTemplate = new RollTemplateEntity(
        'multi-roll-template',
        'Multi-Roll Template',
        'A template that rolls multiple times on the same table',
        new RollTemplate('My favorite colors are {{Colors::colors::Colors::3::, }}'),
      );

      // Set up repositories
      const templateRepository = new MockRollTemplateRepository([multiRollTemplate]);
      const tableRepository = new MockTableRepository([colorTable]);

      // Create an RNG that will select specific colors (Red, Blue, Green)
      const rng = new MockRandomNumberGenerator([0.1, 0.4, 0.7]);

      // Create the use case
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      // Execute the use case
      const results = await useCase.execute('multi-roll-template');

      // Verify the results
      expect(results).toHaveLength(1);
      expect(results[0].originalTemplate).toBe(
        'My favorite colors are {{Colors::colors::Colors::3::, }}',
      );
      expect(results[0].evaluatedTemplate).toBe('My favorite colors are Red, Blue, Green');
    });

    it('should handle circular references gracefully', async () => {
      // Create tables with circular references
      const aEntries = [new TableEntry('a1', 'A references B: {{B::b-table::B}}', 1)];
      const aTable = new RandomTable('a-table', 'A', 'Table A', aEntries);

      const bEntries = [new TableEntry('b1', 'B references A: {{A::a-table::A}}', 1)];
      const bTable = new RandomTable('b-table', 'B', 'Table B', bEntries);

      // Create a template that starts the circular reference
      const circularTemplate = new RollTemplateEntity(
        'circular-template',
        'Circular Template',
        'A template that triggers a circular reference',
        new RollTemplate('Start with A: {{A::a-table::A}}'),
      );

      // Set up repositories
      const templateRepository = new MockRollTemplateRepository([circularTemplate]);
      const tableRepository = new MockTableRepository([aTable, bTable]);

      // Create an RNG
      const rng = new MockRandomNumberGenerator([0.1, 0.1]);

      // Create the use case
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      // Execute the use case
      const results = await useCase.execute('circular-template');

      // Verify the results - should contain a warning about circular references
      expect(results).toHaveLength(1);
      expect(results[0].originalTemplate).toBe('Start with A: {{A::a-table::A}}');
      expect(results[0].evaluatedTemplate).toContain(
        'Start with A: A references B: B references A: [Circular reference detected:',
      );
    });

    it('should evaluate a template multiple times when count > 1', async () => {
      // Create a table with colors
      const colorEntries = [
        new TableEntry('red', 'Red', 1),
        new TableEntry('blue', 'Blue', 1),
        new TableEntry('green', 'Green', 1),
      ];
      const colorTable = new RandomTable('colors', 'Colors', 'A table of colors', colorEntries);

      // Create a template that references the color table
      const colorTemplate = new RollTemplateEntity(
        'color-template',
        'Color Template',
        'A template that references the color table',
        new RollTemplate('My favorite color is {{Color::colors::Colors}}'),
      );

      // Set up repositories
      const templateRepository = new MockRollTemplateRepository([colorTemplate]);
      const tableRepository = new MockTableRepository([colorTable]);

      // Create an RNG that will select different colors for each evaluation
      const rng = new MockRandomNumberGenerator([0.1, 0.4, 0.7]);

      // Create the use case
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      // Execute the use case with count = 3
      const results = await useCase.execute('color-template', 3);

      // Verify the results
      expect(results).toHaveLength(3);

      // Each result should have the same original template but different evaluated templates
      expect(results[0].originalTemplate).toBe('My favorite color is {{Color::colors::Colors}}');
      expect(results[0].evaluatedTemplate).toBe('My favorite color is Red');

      expect(results[1].originalTemplate).toBe('My favorite color is {{Color::colors::Colors}}');
      expect(results[1].evaluatedTemplate).toBe('My favorite color is Blue');

      expect(results[2].originalTemplate).toBe('My favorite color is {{Color::colors::Colors}}');
      expect(results[2].evaluatedTemplate).toBe('My favorite color is Green');
    });

    it('should handle references to non-existent tables gracefully', async () => {
      // Create a template that references a non-existent table
      const badRefTemplate = new RollTemplateEntity(
        'bad-ref-template',
        'Bad Reference Template',
        'A template that references a non-existent table',
        new RollTemplate('This references a non-existent table: {{Bad::nonexistent::NonExistent}}'),
      );

      // Set up repositories
      const templateRepository = new MockRollTemplateRepository([badRefTemplate]);
      const tableRepository = new MockTableRepository();

      // Create an RNG
      const rng = new MockRandomNumberGenerator();

      // Create the use case
      const useCase = new EvaluateTemplateUseCase(templateRepository, tableRepository, rng);

      // Execute the use case
      const results = await useCase.execute('bad-ref-template');

      // Verify the results - the reference should remain unresolved
      expect(results).toHaveLength(1);
      expect(results[0].originalTemplate).toBe(
        'This references a non-existent table: {{Bad::nonexistent::NonExistent}}',
      );
      expect(results[0].evaluatedTemplate).toBe(
        'This references a non-existent table: {{Bad::nonexistent::NonExistent}}',
      );
    });
  });
});
