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

## Features

- **Core Domain Entities**: RandomTable, TableEntry, and RollResult
- **Template Support**: Table entries can contain references to other tables using the syntax `{{reference-title::table-id::table-name::roll-number::separator}}`
- **Range-based Entries**: Table entries can have ranges for dice-based tables
- **Weighted Entries**: Table entries can have weights for probability-based tables

## Next Steps

- **Phase 2**: Implement use cases and ports
- **Phase 3**: Implement secondary adapters
- **Phase 4**: Implement MCP server
- **Phase 5**: Testing and documentation

## Project Structure

```
/
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
│   └── index.ts
├── test/
│   ├── unit/
│   │   ├── domain/
│   │   └── useCases/
│   ├── integration/
│   │   ├── adapters/
│   │   └── mcp/
│   └── e2e/
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

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

## License

ISC
