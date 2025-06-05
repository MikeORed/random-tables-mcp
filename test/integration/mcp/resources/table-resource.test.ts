import { TableResource } from "../../../../src/adapters/primary/mcp/resources/table-resource";
import { TableServiceImpl } from "../../../../src/use-cases/implementations/table-service-impl";
import { CreateTableUseCase } from "../../../../src/use-cases/create-table-use-case";
import { GetTableUseCase } from "../../../../src/use-cases/get-table-use-case";
import { ListTablesUseCase } from "../../../../src/use-cases/list-tables-use-case";
import { UpdateTableUseCase } from "../../../../src/use-cases/update-table-use-case";
import { InMemoryTableRepository } from "../../../../src/adapters/secondary/persistence/in-memory-table-repository";
import { RandomTable } from "../../../../src/domain/entities/random-table";
import { TableEntry } from "../../../../src/domain/entities/table-entry";
import { v4 as uuidv4 } from "uuid";

describe("TableResource Integration Tests", () => {
  let tableResource: TableResource;
  let tableService: TableServiceImpl;
  let tableRepository: InMemoryTableRepository;
  let tableId: string;

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
      updateTableUseCase
    );

    // Initialize resource
    tableResource = new TableResource(tableService);

    // Create a test table
    tableId = uuidv4();
    const entries = [
      new TableEntry(uuidv4(), "Entry 1", 1),
      new TableEntry(uuidv4(), "Entry 2", 2),
    ];
    const table = new RandomTable(
      tableId,
      "Test Table",
      "A test table",
      entries
    );
    await tableRepository.save(table);
  });

  it("should have the correct URI pattern", () => {
    expect(tableResource.getUriPattern()).toBe("table://{tableId}");
  });

  it("should return table content when given a valid ID", async () => {
    const content = await tableResource.getContent({ tableId });

    expect(content).toBeDefined();
    expect(content.id).toBe(tableId);
    expect(content.name).toBe("Test Table");
    expect(content.description).toBe("A test table");
    expect(Array.isArray(content.entries)).toBe(true);
    expect(content.entries).toHaveLength(2);

    // Verify entries
    const entryContents = content.entries.map((entry: any) => entry.content);
    expect(entryContents).toContain("Entry 1");
    expect(entryContents).toContain("Entry 2");
  });

  it("should throw an error when given an invalid ID", async () => {
    await expect(
      tableResource.getContent({ tableId: "non-existent-id" })
    ).rejects.toThrow("Table with ID non-existent-id not found");
  });

  it("should handle tables with no entries", async () => {
    // Create a table with no entries
    const emptyTableId = uuidv4();
    const emptyTable = new RandomTable(
      emptyTableId,
      "Empty Table",
      "A table with no entries",
      []
    );
    await tableRepository.save(emptyTable);

    const content = await tableResource.getContent({ tableId: emptyTableId });

    expect(content).toBeDefined();
    expect(content.id).toBe(emptyTableId);
    expect(content.name).toBe("Empty Table");
    expect(content.description).toBe("A table with no entries");
    expect(Array.isArray(content.entries)).toBe(true);
    expect(content.entries).toHaveLength(0);
  });
});
