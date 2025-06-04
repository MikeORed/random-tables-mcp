# MCP Random Tables

An MCP server for managing and rolling on random-table assets used in tabletop RPGs, following a hexagonal architecture (ports & adapters) approach.

## Project Overview

This project implements an MCP server that allows users to create, persist, look up, roll on, and update random tables used in tabletop RPGs. The implementation follows a hexagonal architecture (ports & adapters) to maintain a clean separation of concerns and make the system more testable and maintainable.

## Current Status

**Phase 1: Core Domain Implementation** ✅

- Implemented domain entities (RandomTable, TableEntry, RollResult)
- Implemented basic validation logic
- Added template support for table entries with references to other tables
- Wrote unit tests for domain logic

**Phase 2: Use Cases and Ports Implementation** ✅

- Implemented use cases (CreateTableUseCase, RollOnTableUseCase, UpdateTableUseCase, GetTableUseCase, ListTablesUseCase)
- Defined port interfaces (TableService, RollService, TableRepository, RandomNumberGenerator)
- Implemented service classes that connect ports to use cases

**Phase 3: Secondary Adapters Implementation** ✅

- Implemented RandomNumberGenerator adapter (DefaultRandomNumberGenerator, CryptoRandomNumberGenerator)
- Implemented TableRepository adapters (InMemoryTableRepository, FileTableRepository)
- Added unit tests for all adapters

**Phase 4: MCP Server Implementation** ✅

- Implemented MCP server using the MCP SDK
- Created tools for table operations (create_table, roll_on_table, update_table, list_tables)
- Created resources for accessing tables (table://{tableId}, tables://)
- Added integration tests for MCP server, tools, and resources

**Phase 5: Documentation** 🔄

- Created comprehensive documentation for the project
- Added user guides for getting started, integration, and using templates
- Added example tables and usage scenarios
- Added developer documentation for architecture, extension points, and implementation notes

## Features

- **Core Domain Entities**: RandomTable, TableEntry, and RollResult
- **Template Support**: Table entries can contain references to other tables using the syntax `{{reference-title::table-id::table-name::roll-number::separator}}`
- **Range-based Entries**: Table entries can have ranges for dice-based tables
- **Weighted Entries**: Table entries can have weights for probability-based tables
- **MCP Tools**: Tools for creating, rolling on, updating, and listing tables
- **MCP Resources**: Resources for accessing tables and their metadata
- **Client Compatibility**: Configurable to use either MCP Resources or Tools for table access, ensuring compatibility with LLM clients that may not fully support resources

## Documentation

Comprehensive documentation is available in the [docs](./docs) directory:

- [API Reference](./docs/api/README.md) - Detailed documentation of the MCP tools and resources
- [User Guides](./docs/guides/README.md) - Guides for getting started, integration, and using templates
- [Examples](./docs/examples/README.md) - Example tables and usage scenarios
- [Developer Documentation](./docs/dev/README.md) - Architecture, extension points, and implementation notes

## Project Structure

```
/
├── docs/                      # Documentation
│   ├── api/                   # API reference
│   ├── guides/                # User guides
│   ├── examples/              # Example tables and usage scenarios
│   └── dev/                   # Developer documentation
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── RandomTable.ts
│   │   │   ├── TableEntry.ts
│   │   │   └── RollResult.ts
│   │   └── valueObjects/
│   │       ├── Range.ts
│   │       ├── RollTemplate.ts
│   │       └── TemplateReference.ts
│   ├── ports/
│   │   ├── primary/
│   │   │   ├── TableService.ts
│   │   │   └── RollService.ts
│   │   └── secondary/
│   │       ├── TableRepository.ts
│   │       └── RandomNumberGenerator.ts
│   ├── useCases/
│   │   ├── CreateTableUseCase.ts
│   │   ├── GetTableUseCase.ts
│   │   ├── ListTablesUseCase.ts
│   │   ├── RollOnTableUseCase.ts
│   │   ├── UpdateTableUseCase.ts
│   │   └── implementations/
│   │       ├── TableServiceImpl.ts
│   │       └── RollServiceImpl.ts
│   ├── adapters/
│   │   ├── primary/
│   │   │   └── mcp/
│   │   │       ├── McpServer.ts
│   │   │       ├── resources/
│   │   │       │   ├── TableResource.ts
│   │   │       │   └── TablesResource.ts
│   │   │       └── tools/
│   │   │           ├── CreateTableTool.ts
│   │   │           ├── GetTableTool.ts
│   │   │           ├── RollOnTableTool.ts
│   │   │           ├── UpdateTableTool.ts
│   │   │           └── ListTablesTool.ts
│   │   └── secondary/
│   │       ├── persistence/
│   │       │   ├── InMemoryTableRepository.ts
│   │       │   └── FileTableRepository.ts
│   │       └── rng/
│   │           ├── CryptoRandomNumberGenerator.ts
│   │           └── DefaultRandomNumberGenerator.ts
│   └── index.ts
├── test/
│   ├── unit/
│   │   ├── domain/
│   │   ├── useCases/
│   │   └── adapters/
│   │       └── secondary/
│   │           ├── persistence/
│   │           │   ├── InMemoryTableRepository.test.ts
│   │           │   └── FileTableRepository.test.ts
│   │           └── rng/
│   │               ├── CryptoRandomNumberGenerator.test.ts
│   │               └── DefaultRandomNumberGenerator.test.ts
│   ├── integration/
│   │   ├── adapters/
│   │   └── mcp/
│   │       ├── McpServer.test.ts
│   │       ├── resources/
│   │       │   ├── TableResource.test.ts
│   │       │   └── TablesResource.test.ts
│   │       └── tools/
│   │           ├── CreateTableTool.test.ts
│   │           ├── RollOnTableTool.test.ts
│   │           ├── UpdateTableTool.test.ts
│   │           └── ListTablesTool.test.ts
│   └── e2e/
├── package.json
├── tsconfig.json
├── CONTRIBUTING.md
└── README.md
```

## Getting Started

See the [Getting Started Guide](./docs/guides/getting-started.md) for detailed instructions on how to install, configure, and use the MCP Random Tables server.

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-random-tables

# Install dependencies
npm install
```

### Environment Variables

The server can be configured using the following environment variables:

- `DATA_DIR`: Directory where table data is stored (default: `./data`)
- `CAN_USE_RESOURCE`: Controls whether to use MCP Resources or Tools for certain functionality (default: `false`)
  - When set to `true`: Uses the `TableResource` for accessing tables
  - When not set or any other value: Uses the `GetTableTool` instead of `TableResource`

This allows compatibility with LLM clients that may not fully support MCP Resources.

### Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Build the project
npm run build

# Run the built project
npm start
```

## Testing

The project uses Jest for testing. Run the tests with:

```bash
npm test
```

### Testing Standards

**Test Location Standard**:

- All tests should be placed in the `test/` directory, mirroring the structure of the `src/` directory.
- For example, tests for `src/adapters/secondary/rng/DefaultRandomNumberGenerator.ts` should be in `test/unit/adapters/secondary/rng/DefaultRandomNumberGenerator.test.ts`.

**Current Status**:

- There is an inconsistency in the project where some early tests (domain entities and value objects) are located in the `src/` directory alongside their implementation files.
- Newer tests (adapters) follow the standard of being in the `test/` directory.
- Future work should move all tests to the `test/` directory to maintain consistency.

**Test Types**:

- Unit tests: `test/unit/` - Test individual components in isolation
- Integration tests: `test/integration/` - Test interactions between components
- End-to-end tests: `test/e2e/` - Test the entire system

## Contributing

If you'd like to contribute to the MCP Random Tables project, please see the [Contributing Guide](./CONTRIBUTING.md) for more information.

## License

ISC
