# Contributing to MCP Random Tables

Thank you for considering contributing to the MCP Random Tables project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## How to Contribute

There are many ways to contribute to the MCP Random Tables project:

1. **Reporting Bugs**: If you find a bug, please create an issue with a detailed description of the problem, steps to reproduce, and your environment.
2. **Suggesting Enhancements**: If you have an idea for a new feature or improvement, please create an issue with a detailed description of your suggestion.
3. **Contributing Code**: If you want to contribute code, please follow the guidelines below.
4. **Improving Documentation**: If you find errors or gaps in the documentation, please submit a pull request with your improvements.
5. **Creating Examples**: If you create interesting tables or usage scenarios, please consider contributing them to the project.

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mcp-random-tables.git
cd mcp-random-tables

# Install dependencies
npm install
```

### Development Workflow

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Build the project
npm run build
```

## Pull Request Process

1. Fork the repository and create a new branch for your feature or bug fix.
2. Make your changes, following the coding standards and guidelines.
3. Add tests for your changes, ensuring that they pass.
4. Update the documentation to reflect your changes, if necessary.
5. Submit a pull request with a clear description of your changes.

## Coding Standards

### TypeScript

- Use TypeScript for all code.
- Follow the existing code style and formatting.
- Use interfaces for defining contracts.
- Use classes for implementing behavior.
- Use enums for defining a set of named constants.
- Use type aliases for defining complex types.

### Testing

- Write unit tests for all new code.
- Ensure that all tests pass before submitting a pull request.
- Follow the existing testing patterns and conventions.

### Documentation

- Document all public APIs using JSDoc comments.
- Update the documentation to reflect your changes, if necessary.
- Follow the existing documentation style and formatting.

## Project Structure

The project follows a hexagonal architecture (ports & adapters) to separate the core business logic from external concerns. For more details, see the [Architecture Documentation](./docs/dev/architecture.md).

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
│   ├── useCases/
│   │   ├── CreateTableUseCase.ts
│   │   ├── RollOnTableUseCase.ts
│   │   ├── UpdateTableUseCase.ts
│   │   ├── GetTableUseCase.ts
│   │   └── ListTablesUseCase.ts
│   ├── ports/
│   │   ├── primary/
│   │   │   ├── TableService.ts
│   │   │   └── RollService.ts
│   │   └── secondary/
│   │       ├── TableRepository.ts
│   │       └── RandomNumberGenerator.ts
│   ├── adapters/
│   │   ├── primary/
│   │   │   └── mcp/
│   │   │       ├── McpServer.ts
│   │   │       ├── tools/
│   │   │       │   ├── CreateTableTool.ts
│   │   │       │   ├── RollOnTableTool.ts
│   │   │       │   ├── UpdateTableTool.ts
│   │   │       │   └── ListTablesTool.ts
│   │   │       └── resources/
│   │   │           ├── TableResource.ts
│   │   │           └── TablesResource.ts
│   │   └── secondary/
│   │       ├── persistence/
│   │       │   ├── FileTableRepository.ts
│   │       │   └── InMemoryTableRepository.ts
│   │       └── rng/
│   │           ├── CryptoRandomNumberGenerator.ts
│   │           └── DefaultRandomNumberGenerator.ts
│   └── index.ts
```

## Extension Points

The MCP Random Tables server is designed to be extensible. There are several extension points that allow you to add new functionality without modifying the core code. For more details, see the [Extension Points Documentation](./docs/dev/extension-points.md).

## Implementation Notes

For details on key design decisions and implementation details, see the [Implementation Notes](./docs/dev/implementation-notes.md).

## License

By contributing to this project, you agree that your contributions will be licensed under the project's ISC license.
