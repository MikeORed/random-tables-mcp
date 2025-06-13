/**
 * MCP Random Tables Server
 *
 * This is the main entry point for the MCP Random Tables server.
 * It exports the domain entities and includes the MCP server implementation.
 */

// Re-export domain entities and value objects
export * from './domain/index.js';

// Export use cases and ports (Phase 2)
export * from './use-cases/index.js';
export * from './ports/index.js';

// Export secondary adapters (Phase 3)
export * from './adapters/secondary/index.js';

// Export primary adapters (Phase 4)
export * from './adapters/primary/mcp/mcp-server.js';

// Import dependencies for server setup
import {
  CryptoRandomNumberGenerator,
  FileTableRepository,
  FileRollTemplateRepository,
} from './adapters/secondary/index.js';
import {
  CreateTableUseCase,
  GetTableUseCase,
  ListTablesUseCase,
  RollOnTableUseCase,
  UpdateTableUseCase,
  CreateTemplateUseCase,
  GetTemplateUseCase,
  ListTemplatesUseCase,
  UpdateTemplateUseCase,
  DeleteTemplateUseCase,
  EvaluateTemplateUseCase,
  RollServiceImpl,
  TableServiceImpl,
  RollTemplateServiceImpl,
} from './use-cases/index.js';
import { McpServer } from './adapters/primary/mcp/mcp-server.js';
import path from 'path';

/**
 * Main function to start the MCP server
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
  console.warn('MCP Random Tables Server');
  console.warn('Phase 1: Core Domain Implementation completed');
  console.warn('Phase 2: Use Cases and Ports Implementation completed');
  console.warn('Phase 3: Secondary Adapters Implementation completed');
  console.warn('Phase 4: MCP Server Implementation starting...');

  // Set up the data directory
  const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), 'data');

  // Check if resources can be used (defaults to false if not specified)
  const canUseResource = process.env.CAN_USE_RESOURCE === 'true';
  console.warn(`Resources ${canUseResource ? 'enabled' : 'disabled'}`);

  // Initialize repositories and services
  const tableRepository = new FileTableRepository(dataDir);
  const templateRepository = new FileRollTemplateRepository(dataDir);
  const rng = new CryptoRandomNumberGenerator();

  // Initialize table use cases
  const createTableUseCase = new CreateTableUseCase(tableRepository);
  const getTableUseCase = new GetTableUseCase(tableRepository);
  const listTablesUseCase = new ListTablesUseCase(tableRepository);
  const updateTableUseCase = new UpdateTableUseCase(tableRepository);
  const rollOnTableUseCase = new RollOnTableUseCase(tableRepository, rng);

  // Initialize template use cases
  const createTemplateUseCase = new CreateTemplateUseCase(templateRepository);
  const getTemplateUseCase = new GetTemplateUseCase(templateRepository);
  const listTemplatesUseCase = new ListTemplatesUseCase(templateRepository);
  const updateTemplateUseCase = new UpdateTemplateUseCase(templateRepository);
  const deleteTemplateUseCase = new DeleteTemplateUseCase(templateRepository);
  const evaluateTemplateUseCase = new EvaluateTemplateUseCase(
    templateRepository,
    tableRepository,
    rng,
  );

  // Initialize services
  const tableService = new TableServiceImpl(
    createTableUseCase,
    getTableUseCase,
    listTablesUseCase,
    updateTableUseCase,
  );
  const rollService = new RollServiceImpl(rollOnTableUseCase);
  const templateService = new RollTemplateServiceImpl(
    createTemplateUseCase,
    getTemplateUseCase,
    listTemplatesUseCase,
    updateTemplateUseCase,
    deleteTemplateUseCase,
    evaluateTemplateUseCase,
  );

  // Initialize and start MCP server
  const mcpServer = new McpServer(tableService, rollService, templateService);
  mcpServer.initialize();
  await mcpServer.start();

  console.warn('Phase 4: MCP Server Implementation completed');
}

// Run the main function
main().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});
