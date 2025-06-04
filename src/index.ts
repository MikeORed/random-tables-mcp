/**
 * MCP Random Tables Server
 *
 * This is the main entry point for the MCP Random Tables server.
 * It exports the domain entities and includes the MCP server implementation.
 */

// Re-export domain entities and value objects
export * from "./domain";

// Export use cases and ports (Phase 2)
export * from "./useCases";
export * from "./useCases/implementations";
export * from "./ports";

// Export secondary adapters (Phase 3)
export * from "./adapters/secondary";

// Export primary adapters (Phase 4)
export * from "./adapters/primary/mcp/McpServer";

// Import dependencies for server setup
import { FileTableRepository } from "./adapters/secondary/persistence/FileTableRepository";
import { CryptoRandomNumberGenerator } from "./adapters/secondary/rng/CryptoRandomNumberGenerator";
import { CreateTableUseCase } from "./useCases/CreateTableUseCase";
import { GetTableUseCase } from "./useCases/GetTableUseCase";
import { ListTablesUseCase } from "./useCases/ListTablesUseCase";
import { RollOnTableUseCase } from "./useCases/RollOnTableUseCase";
import { UpdateTableUseCase } from "./useCases/UpdateTableUseCase";
import { TableServiceImpl } from "./useCases/implementations/TableServiceImpl";
import { RollServiceImpl } from "./useCases/implementations/RollServiceImpl";
import { McpServer } from "./adapters/primary/mcp/McpServer";
import path from "path";

/**
 * Main function to start the MCP server
 */
async function main() {
  console.log("MCP Random Tables Server");
  console.log("Phase 1: Core Domain Implementation completed");
  console.log("Phase 2: Use Cases and Ports Implementation completed");
  console.log("Phase 3: Secondary Adapters Implementation completed");
  console.log("Phase 4: MCP Server Implementation starting...");

  // Set up the data directory
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");

  // Check if resources can be used (defaults to false if not specified)
  const canUseResource = process.env.CAN_USE_RESOURCE === "true";
  console.log(`Resources ${canUseResource ? "enabled" : "disabled"}`);

  // Initialize repositories and services
  const tableRepository = new FileTableRepository(dataDir);
  const rng = new CryptoRandomNumberGenerator();

  // Initialize use cases
  const createTableUseCase = new CreateTableUseCase(tableRepository);
  const getTableUseCase = new GetTableUseCase(tableRepository);
  const listTablesUseCase = new ListTablesUseCase(tableRepository);
  const updateTableUseCase = new UpdateTableUseCase(tableRepository);
  const rollOnTableUseCase = new RollOnTableUseCase(tableRepository, rng);

  // Initialize services
  const tableService = new TableServiceImpl(
    createTableUseCase,
    getTableUseCase,
    listTablesUseCase,
    updateTableUseCase
  );
  const rollService = new RollServiceImpl(rollOnTableUseCase);

  // Initialize and start MCP server
  const mcpServer = new McpServer(tableService, rollService);
  mcpServer.initialize();
  await mcpServer.start();

  console.log("Phase 4: MCP Server Implementation completed");
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });
}
