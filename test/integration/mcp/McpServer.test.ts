import { McpServer } from "../../../src/adapters/primary/mcp/McpServer";
import { TableServiceImpl } from "../../../src/useCases/implementations/TableServiceImpl";
import { RollServiceImpl } from "../../../src/useCases/implementations/RollServiceImpl";
import { CreateTableUseCase } from "../../../src/useCases/CreateTableUseCase";
import { GetTableUseCase } from "../../../src/useCases/GetTableUseCase";
import { ListTablesUseCase } from "../../../src/useCases/ListTablesUseCase";
import { UpdateTableUseCase } from "../../../src/useCases/UpdateTableUseCase";
import { RollOnTableUseCase } from "../../../src/useCases/RollOnTableUseCase";
import { InMemoryTableRepository } from "../../../src/adapters/secondary/persistence/InMemoryTableRepository";
import { DefaultRandomNumberGenerator } from "../../../src/adapters/secondary/rng/DefaultRandomNumberGenerator";

describe("McpServer Integration Tests", () => {
  let mcpServer: McpServer;
  let tableService: TableServiceImpl;
  let rollService: RollServiceImpl;
  let tableRepository: InMemoryTableRepository;

  beforeEach(() => {
    // Set up dependencies with in-memory repository for testing
    tableRepository = new InMemoryTableRepository();
    const rng = new DefaultRandomNumberGenerator();

    // Initialize use cases
    const createTableUseCase = new CreateTableUseCase(tableRepository);
    const getTableUseCase = new GetTableUseCase(tableRepository);
    const listTablesUseCase = new ListTablesUseCase(tableRepository);
    const updateTableUseCase = new UpdateTableUseCase(tableRepository);
    const rollOnTableUseCase = new RollOnTableUseCase(tableRepository, rng);

    // Initialize services
    tableService = new TableServiceImpl(
      createTableUseCase,
      getTableUseCase,
      listTablesUseCase,
      updateTableUseCase
    );
    rollService = new RollServiceImpl(rollOnTableUseCase);

    // Initialize MCP server
    mcpServer = new McpServer(tableService, rollService);
  });

  it("should initialize without errors", () => {
    expect(() => {
      mcpServer.initialize();
    }).not.toThrow();
  });

  // Note: Testing the actual server functionality would require mocking the transport
  // or setting up a test client. For now, we'll just test that the server initializes
  // correctly and that the tools and resources are registered.

  it("should have all required tools", () => {
    // Access private tools array using type assertion
    const tools = (mcpServer as any).tools;

    expect(tools.length).toBe(4);

    const toolNames = tools.map((tool: any) => tool.getName());
    expect(toolNames).toContain("create_table");
    expect(toolNames).toContain("roll_on_table");
    expect(toolNames).toContain("update_table");
    expect(toolNames).toContain("list_tables");
  });

  it("should have all required resources", () => {
    // Access private resources array using type assertion
    const resources = (mcpServer as any).resources;

    expect(resources.length).toBe(2);

    const resourcePatterns = resources.map((resource: any) =>
      resource.getUriPattern()
    );
    expect(resourcePatterns).toContain("table://{tableId}");
    expect(resourcePatterns).toContain("tables://");
  });
});
