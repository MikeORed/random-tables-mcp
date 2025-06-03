import { CreateTableTool } from "../../../../src/adapters/primary/mcp/tools/CreateTableTool";
import { TableServiceImpl } from "../../../../src/useCases/implementations/TableServiceImpl";
import { CreateTableUseCase } from "../../../../src/useCases/CreateTableUseCase";
import { GetTableUseCase } from "../../../../src/useCases/GetTableUseCase";
import { ListTablesUseCase } from "../../../../src/useCases/ListTablesUseCase";
import { UpdateTableUseCase } from "../../../../src/useCases/UpdateTableUseCase";
import { InMemoryTableRepository } from "../../../../src/adapters/secondary/persistence/InMemoryTableRepository";
import { TableEntry } from "../../../../src/domain/entities/TableEntry";

describe("CreateTableTool Integration Tests", () => {
  let createTableTool: CreateTableTool;
  let tableService: TableServiceImpl;
  let tableRepository: InMemoryTableRepository;

  beforeEach(() => {
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

    // Initialize tool
    createTableTool = new CreateTableTool(tableService);
  });

  it("should have the correct name and description", () => {
    expect(createTableTool.getName()).toBe("create_table");
    expect(createTableTool.getToolDefinition().description).toBe(
      "Create a new random table"
    );
  });

  it("should create a table with no entries", async () => {
    const result = await createTableTool.execute({
      name: "Test Table",
      description: "A test table",
    });

    expect(result).toHaveProperty("tableId");
    expect(typeof result.tableId).toBe("string");

    // Verify the table was created in the repository
    const tables = await tableService.listTables();
    expect(tables).toHaveLength(1);
    expect(tables[0].id).toBe(result.tableId);
    expect(tables[0].name).toBe("Test Table");
    expect(tables[0].description).toBe("A test table");
    expect(tables[0].entries).toHaveLength(0);
  });

  it("should create a table with entries", async () => {
    const result = await createTableTool.execute({
      name: "Test Table with Entries",
      description: "A test table with entries",
      entries: [
        { content: "Entry 1" },
        { content: "Entry 2", weight: 2 },
        { content: "Entry 3", range: { min: 1, max: 3 } },
      ],
    });

    expect(result).toHaveProperty("tableId");

    // Verify the table was created in the repository
    const table = await tableService.getTable(result.tableId);
    expect(table).not.toBeNull();
    expect(table!.name).toBe("Test Table with Entries");
    expect(table!.description).toBe("A test table with entries");
    expect(table!.entries).toHaveLength(3);

    // Verify entry content
    const entryContents = table!.entries.map((e) => e.content);
    expect(entryContents).toContain("Entry 1");
    expect(entryContents).toContain("Entry 2");
    expect(entryContents).toContain("Entry 3");

    // Verify entry with weight
    const entry2 = table!.entries.find((e) => e.content === "Entry 2");
    expect(entry2).toBeDefined();
    expect(entry2!.weight).toBe(2);

    // Verify entry with range
    const entry3 = table!.entries.find((e) => e.content === "Entry 3");
    expect(entry3).toBeDefined();
    expect(entry3!.range).toBeDefined();
    expect(entry3!.range!.min).toBe(1);
    expect(entry3!.range!.max).toBe(3);
  });

  it("should validate input schema", async () => {
    // Missing required name field
    await expect(
      createTableTool.execute({
        description: "Invalid table",
      })
    ).rejects.toThrow();
  });
});
