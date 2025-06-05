import { GetTableTool } from "../../../../src/adapters/primary/mcp/tools/get-table-tool";
import { TableServiceImpl } from "../../../../src/use-cases/implementations/table-service-impl";
import { CreateTableUseCase } from "../../../../src/use-cases/create-table-use-case";
import { GetTableUseCase } from "../../../../src/use-cases/get-table-use-case";
import { ListTablesUseCase } from "../../../../src/use-cases/list-tables-use-case";
import { UpdateTableUseCase } from "../../../../src/use-cases/update-table-use-case";
import { InMemoryTableRepository } from "../../../../src/adapters/secondary/persistence/in-memory-table-repository";
import { RandomTable } from "../../../../src/domain/entities/random-table";
import { TableEntry } from "../../../../src/domain/entities/table-entry";
import { v4 as uuidv4 } from "uuid";

describe("GetTableTool Integration Tests", () => {
  let getTableTool: GetTableTool;
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

    // Initialize tool
    getTableTool = new GetTableTool(tableService);

    // Create test table
    tableId = uuidv4();
    const entries = [
      new TableEntry(uuidv4(), "Entry 1", 1),
      new TableEntry(uuidv4(), "Entry 2", 2),
    ];
    await tableRepository.save(
      new RandomTable(tableId, "Test Table", "A table for testing", entries)
    );
  });

  it("should have the correct name and description", () => {
    expect(getTableTool.getName()).toBe("get_table");
    expect(getTableTool.getToolDefinition().description).toBe(
      "Get a specific random table by ID"
    );
  });

  it("should get a table by ID", async () => {
    const result = await getTableTool.execute({ tableId });

    expect(result).toHaveProperty("table");
    expect(result.table).toHaveProperty("id", tableId);
    expect(result.table).toHaveProperty("name", "Test Table");
    expect(result.table).toHaveProperty("description", "A table for testing");
    expect(result.table).toHaveProperty("entries");
    expect(Array.isArray(result.table.entries)).toBe(true);
    expect(result.table.entries).toHaveLength(2);
  });

  it("should throw an error when table does not exist", async () => {
    const nonExistentId = uuidv4();

    await expect(
      getTableTool.execute({ tableId: nonExistentId })
    ).rejects.toThrow(`Table with ID ${nonExistentId} not found`);
  });

  it("should validate input parameters", async () => {
    // Missing tableId
    await expect(
      // @ts-ignore - Testing invalid input
      getTableTool.execute({})
    ).rejects.toThrow();

    // Invalid tableId type
    await expect(
      // @ts-ignore - Testing invalid input
      getTableTool.execute({ tableId: 123 })
    ).rejects.toThrow();
  });
});
