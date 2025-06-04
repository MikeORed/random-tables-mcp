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
import { GetTableTool } from "../../../src/adapters/primary/mcp/tools/GetTableTool";

describe("McpServer Integration Tests", () => {
  let mcpServer: McpServer;
  let tableService: TableServiceImpl;
  let rollService: RollServiceImpl;
  let tableRepository: InMemoryTableRepository;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment variables
    originalEnv = { ...process.env };

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

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  it("should initialize without errors", () => {
    expect(() => {
      mcpServer.initialize();
    }).not.toThrow();
  });

  // Note: Testing the actual server functionality would require mocking the transport
  // or setting up a test client. For now, we'll just test that the server initializes
  // correctly and that the tools and resources are registered.

  it("should have all required tools when resources are disabled (default)", () => {
    // Access private tools array using type assertion
    const tools = (mcpServer as any).tools;

    expect(tools.length).toBe(5);

    const toolNames = tools.map((tool: any) => tool.getName());
    expect(toolNames).toContain("create_table");
    expect(toolNames).toContain("roll_on_table");
    expect(toolNames).toContain("update_table");
    expect(toolNames).toContain("list_tables");
    expect(toolNames).toContain("get_table");
  });

  it("should have basic resources when resources are disabled (default)", () => {
    // Access private resources array using type assertion
    const resources = (mcpServer as any).resources;

    expect(resources.length).toBe(1);

    const resourcePatterns = resources.map((resource: any) =>
      resource.getUriPattern()
    );
    expect(resourcePatterns).toContain("tables://");
    expect(resourcePatterns).not.toContain("table://{tableId}");
  });

  it("should have all required resources when resources are enabled", () => {
    // Save original environment
    const originalEnv = process.env.CAN_USE_RESOURCE;

    try {
      // Enable resources
      process.env.CAN_USE_RESOURCE = "true";

      // Create a new server with resources enabled
      const resourceEnabledServer = new McpServer(tableService, rollService);

      // Access private resources array using type assertion
      const resources = (resourceEnabledServer as any).resources;

      expect(resources.length).toBe(2);

      const resourcePatterns = resources.map((resource: any) =>
        resource.getUriPattern()
      );
      expect(resourcePatterns).toContain("table://{tableId}");
      expect(resourcePatterns).toContain("tables://");

      // Access private tools array using type assertion
      const tools = (resourceEnabledServer as any).tools;

      // GetTableTool should not be included when resources are enabled
      const toolNames = tools.map((tool: any) => tool.getName());
      expect(toolNames).not.toContain("get_table");
    } finally {
      // Restore original environment
      process.env.CAN_USE_RESOURCE = originalEnv;
    }
  });
});
