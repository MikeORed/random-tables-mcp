import { McpServer } from '../../../src/adapters/primary/mcp/mcp-server';
import { TableServiceImpl } from '../../../src/use-cases/implementations/table-service-impl';
import { RollServiceImpl } from '../../../src/use-cases/implementations/roll-service-impl';
import { RollTemplateServiceImpl } from '../../../src/use-cases/implementations/roll-template-service-impl';
import { CreateTableUseCase } from '../../../src/use-cases/create-table-use-case';
import { GetTableUseCase } from '../../../src/use-cases/get-table-use-case';
import { ListTablesUseCase } from '../../../src/use-cases/list-tables-use-case';
import { UpdateTableUseCase } from '../../../src/use-cases/update-table-use-case';
import { RollOnTableUseCase } from '../../../src/use-cases/roll-on-table-use-case';
import { InMemoryTableRepository } from '../../../src/adapters/secondary/persistence/in-memory-table-repository';
import { InMemoryRollTemplateRepository } from '../../../src/adapters/secondary/persistence/in-memory-roll-template-repository';
import { DefaultRandomNumberGenerator } from '../../../src/adapters/secondary/rng/default-random-number-generator';
import { CreateTemplateUseCase } from '../../../src/use-cases/create-template-use-case';
import { GetTemplateUseCase } from '../../../src/use-cases/get-template-use-case';
import { ListTemplatesUseCase } from '../../../src/use-cases/list-templates-use-case';
import { UpdateTemplateUseCase } from '../../../src/use-cases/update-template-use-case';
import { DeleteTemplateUseCase } from '../../../src/use-cases/delete-template-use-case';
import { EvaluateTemplateUseCase } from '../../../src/use-cases/evaluate-template-use-case';

describe('McpServer Integration Tests', () => {
  let mcpServer: McpServer;
  let tableService: TableServiceImpl;
  let rollTemplateService: RollTemplateServiceImpl;
  let rollService: RollServiceImpl;
  let tableRepository: InMemoryTableRepository;
  let templateRepository: InMemoryRollTemplateRepository;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment variables
    originalEnv = { ...process.env };

    // Set up dependencies with in-memory repository for testing
    tableRepository = new InMemoryTableRepository();
    templateRepository = new InMemoryRollTemplateRepository();
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
      updateTableUseCase,
    );
    rollService = new RollServiceImpl(rollOnTableUseCase);
    rollTemplateService = new RollTemplateServiceImpl(
      new CreateTemplateUseCase(templateRepository),
      new GetTemplateUseCase(templateRepository),
      new ListTemplatesUseCase(templateRepository),
      new UpdateTemplateUseCase(templateRepository),
      new DeleteTemplateUseCase(templateRepository),
      new EvaluateTemplateUseCase(templateRepository, tableRepository, rng),
    );

    // Initialize MCP server
    mcpServer = new McpServer(tableService, rollService, rollTemplateService);
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  it('should initialize without errors', () => {
    expect(() => {
      mcpServer.initialize();
    }).not.toThrow();
  });

  // Note: Testing the actual server functionality would require mocking the transport
  // or setting up a test client. For now, we'll just test that the server initializes
  // correctly and that the tools and resources are registered.

  it('should have all required tools when resources are disabled (default)', () => {
    // Access private tools array using type assertion
    const tools = (mcpServer as any).tools;

    expect(tools.length).toBe(11);

    const toolNames = tools.map((tool: any) => tool.getName());
    expect(toolNames).toContain('create_table');
    expect(toolNames).toContain('roll_on_table');
    expect(toolNames).toContain('update_table');
    expect(toolNames).toContain('list_tables');
    expect(toolNames).toContain('get_table');
  });

  it('should have basic resources when resources are disabled (default)', () => {
    // Access private resources array using type assertion
    const resources = (mcpServer as any).resources;

    expect(resources.length).toBe(2);

    const resourcePatterns = resources.map((resource: any) => resource.getUriPattern());
    expect(resourcePatterns).toContain('tables://');
    expect(resourcePatterns).not.toContain('table://{tableId}');
  });

  it('should have all required resources when resources are enabled', () => {
    // Save original environment
    const originalEnv = process.env.CAN_USE_RESOURCE;

    try {
      // Enable resources
      process.env.CAN_USE_RESOURCE = 'true';

      // Create a new server with resources enabled
      const resourceEnabledServer = new McpServer(tableService, rollService, rollTemplateService);

      // Access private resources array using type assertion
      const resources = (resourceEnabledServer as any).resources;

      expect(resources.length).toBe(4);

      const resourcePatterns = resources.map((resource: any) => resource.getUriPattern());
      expect(resourcePatterns).toContain('table://{tableId}');
      expect(resourcePatterns).toContain('tables://');

      // Access private tools array using type assertion
      const tools = (resourceEnabledServer as any).tools;

      // GetTableTool should not be included when resources are enabled
      const toolNames = tools.map((tool: any) => tool.getName());
      expect(toolNames).not.toContain('get_table');
    } finally {
      // Restore original environment
      process.env.CAN_USE_RESOURCE = originalEnv;
    }
  });
});
