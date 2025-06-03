/**
 * MCP Random Tables Server
 *
 * This is the main entry point for the MCP Random Tables server.
 * It exports the domain entities and will be expanded to include
 * the MCP server implementation in future phases.
 */

// Re-export domain entities and value objects
export * from "./domain";

// TODO: Implement and export use cases in Phase 2
// TODO: Implement and export ports in Phase 2
// TODO: Implement and export adapters in Phase 3
// TODO: Implement MCP server in Phase 4

/**
 * Main function to start the MCP server
 */
async function main() {
  console.log("MCP Random Tables Server");
  console.log("Phase 1: Core Domain Implementation completed");
  console.log("Future phases will implement the full MCP server");
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });
}
