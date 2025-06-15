import { TablesResource } from '../../../../src/adapters/primary/mcp/resources/tables-resource';
import { TableServiceImpl } from '../../../../src/use-cases/implementations/table-service-impl';
import { CreateTableUseCase } from '../../../../src/use-cases/create-table-use-case';
import { GetTableUseCase } from '../../../../src/use-cases/get-table-use-case';
import { ListTablesUseCase } from '../../../../src/use-cases/list-tables-use-case';
import { UpdateTableUseCase } from '../../../../src/use-cases/update-table-use-case';
import { InMemoryTableRepository } from '../../../../src/adapters/secondary/persistence/in-memory-table-repository';
import { RandomTable } from '../../../../src/domain/entities/random-table';
import { TableEntry } from '../../../../src/domain/entities/table-entry';
import { v4 as uuidv4 } from 'uuid';

describe('TablesResource Integration Tests', () => {
  let tablesResource: TablesResource;
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

    // Initialize resource
    tablesResource = new TablesResource(tableService);

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

  it('should have the correct URI pattern', () => {
    expect(tablesResource.getUriPattern()).toBe('tables://');
  });

  it('should return all tables', async () => {
    const content = await tablesResource.getContent({});

    expect(content).toBeDefined();
    expect(content).toHaveProperty('tables');
    expect(Array.isArray(content.tables)).toBe(true);
    expect(content.tables).toHaveLength(3);

    // Verify table properties
    const returnedTableIds = content.tables.map((table: any) => table.id);
    expect(returnedTableIds).toContain(tableIds[0]);
    expect(returnedTableIds).toContain(tableIds[1]);
    expect(returnedTableIds).toContain(tableIds[2]);

    // Verify table details
    const emptyTable = content.tables.find((table: any) => table.name === 'Empty Table');
    expect(emptyTable).toBeDefined();
    expect(emptyTable?.description).toBe('A table with no entries');
    expect(emptyTable?.entryCount).toBe(0);

    const tableWithEntries = content.tables.find(
      (table: any) => table.name === 'Table with Entries',
    );
    expect(tableWithEntries).toBeDefined();
    expect(tableWithEntries?.description).toBe('A table with entries');
    expect(tableWithEntries?.entryCount).toBe(2);

    const anotherTable = content.tables.find((table: any) => table.name === 'Another Table');
    expect(anotherTable).toBeDefined();
    expect(anotherTable?.description).toBe('Another table with entries');
    expect(anotherTable?.entryCount).toBe(3);
  });

  it('should return an empty array when no tables exist', async () => {
    // Clear the repository
    await tableRepository.clear();

    const content = await tablesResource.getContent({});

    expect(content).toBeDefined();
    expect(content).toHaveProperty('tables');
    expect(Array.isArray(content.tables)).toBe(true);
    expect(content.tables).toHaveLength(0);
  });

  it('should not include full entry details in the response', async () => {
    const content = await tablesResource.getContent({});

    // Check that we only get summary information, not full entry details
    const table = content.tables.find((table: any) => table.name === 'Table with Entries');
    expect(table).toBeDefined();
    expect(table).not.toHaveProperty('entries');
    expect(table).toHaveProperty('entryCount', 2);
  });
});
