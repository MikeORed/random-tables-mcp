/**
 * MCP Random Tables Server
 *
 * This is the main entry point for the MCP Random Tables server.
 * It exports the domain entities and will be expanded to include
 * the MCP server implementation in future phases.
 */

// Re-export domain entities and value objects
export * from "./domain";

// Export use cases and ports (Phase 2)
export * from "./useCases";
export * from "./useCases/implementations";
export * from "./ports";

// Export secondary adapters (Phase 3)
export * from "./adapters/secondary";

// TODO: Implement MCP server in Phase 4

/**
 * Main function to start the MCP server
 */
async function main() {
  console.log("MCP Random Tables Server");
  console.log("Phase 1: Core Domain Implementation completed");
  console.log("Phase 2: Use Cases and Ports Implementation completed");
  console.log("Phase 3: Secondary Adapters Implementation completed");
  console.log("Future phases will implement the full MCP server");
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });
}
