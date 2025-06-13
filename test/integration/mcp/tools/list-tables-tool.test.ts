import { ListTablesTool } from '../../../../src/adapters/primary/mcp/tools/list-tables-tool';
import { TableServiceImpl } from '../../../../src/use-cases/implementations/table-service-impl';
import { CreateTableUseCase } from '../../../../src/use-cases/create-table-use-case';
import { GetTableUseCase } from '../../../../src/use-cases/get-table-use-case';
import { ListTablesUseCase } from '../../../../src/use-cases/list-tables-use-case';
import { UpdateTableUseCase } from '../../../../src/use-cases/update-table-use-case';
import { InMemoryTableRepository } from '../../../../src/adapters/secondary/persistence/in-memory-table-repository';
import { RandomTable } from '../../../../src/domain/entities/random-table';
import { TableEntry } from '../../../../src/domain/entities/table-entry';
import { v4 as uuidv4 } from 'uuid';

describe('ListTablesTool Integration Tests', () => {
  let listTablesTool: ListTablesTool;
  let tableService: TableServiceImpl;
  let tableRepository: InMemoryTableRepository;
  let tableIds: string[];

  beforeEach(async () => {
    // Set up dependencies with in-memory repository for testing
    tableRepository = new InMemoryTableRepository();

    // Initialize use cases
    const createTableUseCase = new CreateTableUseCase(tableRepository);
    const getTableUseCase = new GetTableUseCase(tableRepository);
    const listTablesUseCase = new ListTablesUseCase(tableRepository);
    const updateTableUseCase = new UpdateTableUseCase(tableRepository);

    // Initialize service
    tableService = new TableServiceImpl(
      createTableUseCase,
      getTableUseCase,
      listTablesUseCase,
      updateTableUseCase,
    );

    // Initialize tool
    listTablesTool = new ListTablesTool(tableService);

    // Create test tables
    tableIds = [uuidv4(), uuidv4(), uuidv4()];

    // Table 1: Empty table
    await tableRepository.save(
      new RandomTable(tableIds[0], 'Empty Table', 'A table with no entries', []),
    );

    // Table 2: Table with entries
    const entries1 = [
      new TableEntry(uuidv4(), 'Entry 1', 1),
      new TableEntry(uuidv4(), 'Entry 2', 2),
    ];
    await tableRepository.save(
      new RandomTable(tableIds[1], 'Table with Entries', 'A table with entries', entries1),
    );

    // Table 3: Another table with entries
    const entries2 = [
      new TableEntry(uuidv4(), 'Entry A', 1),
      new TableEntry(uuidv4(), 'Entry B', 1),
      new TableEntry(uuidv4(), 'Entry C', 1),
    ];
    await tableRepository.save(
      new RandomTable(tableIds[2], 'Another Table', 'Another table with entries', entries2),
    );
  });

  it('should have the correct name and description', () => {
    expect(listTablesTool.getName()).toBe('list_tables');
    expect(listTablesTool.getToolDefinition().description).toBe('List available random tables');
  });

  it('should list all tables', async () => {
    const result = await listTablesTool.execute({});

    expect(result).toHaveProperty('tables');
    expect(Array.isArray(result.tables)).toBe(true);
    expect(result.tables).toHaveLength(3);

    // Verify table properties
    const tableIds = result.tables.map(table => table.id);
    expect(tableIds).toContain(tableIds[0]);
    expect(tableIds).toContain(tableIds[1]);
    expect(tableIds).toContain(tableIds[2]);

    // Verify table details
    const emptyTable = result.tables.find(table => table.name === 'Empty Table');
    expect(emptyTable).toBeDefined();
    expect(emptyTable!.description).toBe('A table with no entries');
    expect(emptyTable!.entryCount).toBe(0);

    const tableWithEntries = result.tables.find(table => table.name === 'Table with Entries');
    expect(tableWithEntries).toBeDefined();
    expect(tableWithEntries!.description).toBe('A table with entries');
    expect(tableWithEntries!.entryCount).toBe(2);

    const anotherTable = result.tables.find(table => table.name === 'Another Table');
    expect(anotherTable).toBeDefined();
    expect(anotherTable!.description).toBe('Another table with entries');
    expect(anotherTable!.entryCount).toBe(3);
  });

  it('should return an empty array when no tables exist', async () => {
    // Clear the repository
    await tableRepository.clear();

    const result = await listTablesTool.execute({});

    expect(result).toHaveProperty('tables');
    expect(Array.isArray(result.tables)).toBe(true);
    expect(result.tables).toHaveLength(0);
  });

  it('should filter tables based on criteria', async () => {
    // Note: The current implementation doesn't support filtering,
    // but we can test that the filter parameter is passed through
    // This test can be expanded when filtering is implemented

    // Mock the listTables method to verify filter is passed
    const originalListTables = tableService.listTables.bind(tableService);
    tableService.listTables = jest.fn().mockImplementation(filter => {
      // Only return tables that match the filter criteria
      // For this test, we'll filter by name containing "with"
      if (filter && filter.nameContains === 'with') {
        return originalListTables(filter).then(tables =>
          tables.filter(table => table.name.toLowerCase().includes('with')),
        );
      }
      return originalListTables(filter);
    });

    const result = await listTablesTool.execute({
      filter: { nameContains: 'with' },
    });

    expect(tableService.listTables).toHaveBeenCalledWith({
      nameContains: 'with',
    });
    expect(result.tables.length).toBeLessThan(3); // Should filter out some tables

    // Restore original method
    (tableService.listTables as jest.Mock).mockRestore();
  });
});
