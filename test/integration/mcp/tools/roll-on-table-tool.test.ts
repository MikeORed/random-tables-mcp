import { RollOnTableTool } from '../../../../src/adapters/primary/mcp/tools/roll-on-table-tool';
import { RollServiceImpl } from '../../../../src/use-cases/implementations/roll-service-impl';
import { RollOnTableUseCase } from '../../../../src/use-cases/roll-on-table-use-case';
import { InMemoryTableRepository } from '../../../../src/adapters/secondary/persistence/in-memory-table-repository';
import { DefaultRandomNumberGenerator } from '../../../../src/adapters/secondary/rng/default-random-number-generator';
import { RandomTable } from '../../../../src/domain/entities/random-table';
import { TableEntry } from '../../../../src/domain/entities/table-entry';
import { v4 as uuidv4 } from 'uuid';

describe('RollOnTableTool Integration Tests', () => {
  let rollOnTableTool: RollOnTableTool;
  let rollService: RollServiceImpl;
  let tableRepository: InMemoryTableRepository;
  let tableId: string;

  beforeEach(async () => {
    // Set up dependencies with in-memory repository for testing
    tableRepository = new InMemoryTableRepository();
    const rng = new DefaultRandomNumberGenerator();

    // Initialize use case and service
    const rollOnTableUseCase = new RollOnTableUseCase(tableRepository, rng);
    rollService = new RollServiceImpl(rollOnTableUseCase);

    // Initialize tool
    rollOnTableTool = new RollOnTableTool(rollService);

    // Create a test table
    tableId = uuidv4();
    const entries = [
      new TableEntry(uuidv4(), 'Entry 1', 1),
      new TableEntry(uuidv4(), 'Entry 2', 2),
      new TableEntry(uuidv4(), 'Entry 3', 1),
    ];
    const table = new RandomTable(tableId, 'Test Table', 'A test table', entries);
    await tableRepository.save(table);
  });

  it('should have the correct name and description', () => {
    expect(rollOnTableTool.getName()).toBe('roll_on_table');
    expect(rollOnTableTool.getToolDefinition().description).toBe('Roll on a specific table');
  });

  it('should roll on a table once by default', async () => {
    const result = await rollOnTableTool.execute({
      tableId,
    });

    expect(result).toHaveProperty('results');
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results).toHaveLength(1);

    const rollResult = result.results[0];
    expect(rollResult).toHaveProperty('tableId', tableId);
    expect(rollResult).toHaveProperty('entryId');
    expect(rollResult).toHaveProperty('content');
    expect(rollResult).toHaveProperty('timestamp');

    // Content should be one of the entries
    expect(['Entry 1', 'Entry 2', 'Entry 3']).toContain(rollResult.content);
  });

  it('should roll on a table multiple times', async () => {
    const count = 5;
    const result = await rollOnTableTool.execute({
      tableId,
      count,
    });

    expect(result).toHaveProperty('results');
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results).toHaveLength(count);

    // All results should have the correct properties
    for (const rollResult of result.results) {
      expect(rollResult).toHaveProperty('tableId', tableId);
      expect(rollResult).toHaveProperty('entryId');
      expect(rollResult).toHaveProperty('content');
      expect(rollResult).toHaveProperty('timestamp');

      // Content should be one of the entries
      expect(['Entry 1', 'Entry 2', 'Entry 3']).toContain(rollResult.content);
    }
  });

  it('should throw an error when rolling on a non-existent table', async () => {
    await expect(
      rollOnTableTool.execute({
        tableId: 'non-existent-id',
      }),
    ).rejects.toThrow();
  });

  it('should validate input schema', async () => {
    // Missing required tableId field
    await expect(
      rollOnTableTool.execute({
        count: 1,
      } as any),
    ).rejects.toThrow();
  });
});
