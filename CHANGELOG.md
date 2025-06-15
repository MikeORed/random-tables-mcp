# Changelog

All notable changes to the MCP Random Tables project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.1-beta.2] - 2025-06-15

### Changed

- Reorganized documentation with new guides and examples

## [0.9.1-beta.1] - 2025-06-13

### Fixed

- Added `bin` field to package.json to make the package executable via npx
- Added shebang line to src/index.ts to ensure proper execution as a CLI tool

## [0.9.0] - 2025-06-13

### Added

- Initial release of MCP Random Tables with comprehensive functionality for tabletop RPG random table management

#### MCP Tools

##### Table Tools

- `create_table` - Create a new random table with optional initial entries
- `roll_on_table` - Roll on a specific table and return the result
- `update_table` - Update an existing table (name, description, entries)
- `list_tables` - List available tables with metadata
- `get_table` - Get details of a specific table

##### Template Tools

- `create_template` - Create a new roll template
- `get_template` - Get a specific roll template by ID
- `list_templates` - List all available roll templates
- `update_template` - Update an existing roll template
- `delete_template` - Delete a roll template by ID
- `evaluate_template` - Evaluate a roll template by resolving all references to tables

#### MCP Resources

##### Table Resources

- `table://{tableId}` - Access a specific table
- `tables://` - Access a list of all tables

##### Template Resources

- `template://{id}` - Access a specific roll template
- `templates://` - Access a list of all roll templates

#### Configuration Options

- Environment Variables:
  - `DATA_DIR`: Directory where table data is stored (default: `./data`)
  - `CAN_USE_RESOURCE`: Controls whether to use MCP Resources or Tools for certain functionality (default: `false`)
    - When set to `true`: Uses the `TableResource` and `TemplateResource` for accessing tables and templates
    - When not set or any other value: Uses the `GetTableTool` and `GetTemplateTool` instead of resources

#### Core Features

- Template system for chaining tables together with syntax like `{{::items::Items::3}}`
- Support for standalone templates that can be reused across multiple tables
- Support for weighted entries to fine-tune probabilities
- Support for range-based entries for dice-driven tables
- Persistence options:
  - File-based storage
  - In-memory storage for testing
- Random number generation with cryptographically secure options

#### Documentation & Testing

- Comprehensive documentation:
  - User guides
  - Examples
  - Developer documentation
- Test suite with unit, integration, and end-to-end tests
