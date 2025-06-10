# Changelog

All notable changes to the MCP Random Tables project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-09

### Added

- Initial release of MCP Random Tables
- Hexagonal architecture (ports & adapters) implementation
- Core domain entities and value objects:
  - RandomTable entity
  - TableEntry entity
  - RollResult entity
  - RollRange value object
  - RollTemplate value object
  - TemplateReference value object
- Primary ports:
  - RollService interface
  - TableService interface
- Secondary ports:
  - RandomNumberGenerator interface
  - TableRepository interface
- Use cases:
  - CreateTableUseCase
  - GetTableUseCase
  - ListTablesUseCase
  - RollOnTableUseCase
  - UpdateTableUseCase
- Primary adapters:
  - MCP server implementation
  - MCP tools:
    - CreateTableTool
    - GetTableTool
    - ListTablesTool
    - RollOnTableTool
    - UpdateTableTool
  - MCP resources:
    - TableResource
    - TablesResource
- Secondary adapters:
  - Persistence:
    - FileTableRepository
    - InMemoryTableRepository
  - Random number generation:
    - CryptoRandomNumberGenerator
    - DefaultRandomNumberGenerator
- Template system for chaining tables together
- Support for weighted entries
- Support for range-based entries
- Comprehensive test suite:
  - Unit tests
  - Integration tests
  - End-to-end tests
- Documentation:
  - User guides
  - Examples
  - Developer documentation
