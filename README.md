# Random Tables MCP Server

Need a drop‑in random‑table engine for your next one‑shot? **MCP Random Tables has you covered.**

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for managing and rolling on random-table assets used in tabletop RPGs, following a hexagonal architecture (ports & adapters) approach.

## Project Overview

This section details the server's core capabilities and architecture—how random‑table definitions and roll templates are stored, rolled, and extended while ports & adapters keep concerns isolated and the codebase easy to test and maintain.

The hexagonal architecture (ports & adapters) approach provides several key benefits:

- **Separation of Concerns**: Core business logic is isolated from external dependencies
- **Testability**: Domain logic can be tested without relying on external systems
- **Flexibility**: New adapters can be added without changing the core logic
- **Maintainability**: Changes to external systems have minimal impact on the core business logic

## Features

- **Create** random tables in seconds and keep them updated
- **Roll** results instantly on any table
- **Link** tables together with powerful template support
- **Define** range‑based entries for dice‑driven tables
- **Weight** entries to fine‑tune probabilities
- **Manage** standalone roll templates for reusable content
- **Choose** your access model – MCP _Resources_ or _Tools_ (see the [Environment Variables](#environment-variables) section to toggle)

## Available Tools

### Table Tools

- `create_table` - Create a new random table with optional initial entries
- `roll_on_table` - Roll on a specific table and returns the result
- `update_table` - Update an existing table (name, description, entries)
- `list_tables` - List available tables with metadata
- `get_table` - Get details of a specific table

### Template Tools

- `create_template` - Create a new roll template
- `get_template` - Get a specific roll template by ID
- `list_templates` - List all available roll templates
- `update_template` - Update an existing roll template
- `delete_template` - Delete a roll template by ID
- `evaluate_template` - Evaluate a roll template by resolving all references to tables

_See the [Environment Variables](#environment-variables) section for how to switch between using Tools and Resources._

## Available Resources

### Table Resources

- `table://{tableId}` - Access a specific table
- `tables://` - Access a list of all tables

### Template Resources

- `template://{id}` - Access a specific roll template
- `templates://` - Access a list of all roll templates

## Key Use Cases

- **RPG Encounter Generation**: Generate random encounters for tabletop RPGs
- **Loot Generation**: Create dynamic treasure and item drops
- **NPC Generation**: Build complex NPCs with personality traits, equipment, and motivations
- **Story Prompt Generation**: Generate creative writing prompts and plot hooks
- **Reusable Templates**: Create standalone templates that can be used across multiple tables

## Functionality Checklist

- [x] **MCP Tools - Table CRUD** - Create, read, update, and delete random tables
- [x] **MCP Tools - Table Template CRUD** - Create, read, update, and delete roll templates
- [x] **MCP Tools - Table and Template Rolling Functions** - Roll on tables and resolve templates
- [ ] **Local Tool - Roller** - JavaScript console app to use server logic for rolling on tables or resolving templates without LLMs
- [ ] **Local Tool - Simple Text Consumption** - Console app extension to create tables from text files (balanced with weight 1) or CSV files (with name, description, weight format)

## Real-World Examples

> **Note**: The examples below use simplified table IDs (like "gold-quantities") for readability. In actual implementation, table IDs are UUIDs (e.g., "b2cf46a1-1884-4492-8770-d1b7e796355d"). The template syntax structure itself is strict and must be followed exactly. For more comprehensive examples, see the [Simple Encounter](./docs/guides-and-examples/simple-encounter.md) and [Nested Treasure](./docs/guides-and-examples/nested-treasure.md) guides.

### Simple Encounter Table

Create a forest encounter table with weighted entries for different encounter types:

```json
{
  "name": "Low-Mid Level Forest Encounters",
  "description": "A varied table of forest encounters for low to mid-level adventurers",
  "entries": [
    {
      "content": "A pack of 2-4 wolves emerges from the underbrush, hungry and territorial",
      "weight": 4
    },
    {
      "content": "Hidden pit trap covered by branches and leaves (10 ft deep, 1d6 damage)",
      "weight": 3
    },
    {
      "content": "Mischievous sprites swap one random item from each character's pack with forest debris",
      "weight": 2
    },
    {
      "content": "A dryad's tree is being cut down by loggers - she pleads for help",
      "weight": 1
    }
  ]
}
```

Higher weights (4) make encounters more common than rare encounters (1).

### Nested Treasure System

Create a comprehensive treasure generation system with multiple interconnected tables:

```json
{
  "name": "Treasure Types",
  "description": "Parent table for different types of treasure",
  "entries": [
    {
      "content": "{{Gold::gold-quantities}}",
      "weight": 1
    },
    {
      "content": "{{Gemstone::gemstones}}",
      "weight": 1
    },
    {
      "content": "{{Weapon::weapons}} that is {{Quirk::weapon-quirks}}",
      "weight": 1
    }
  ]
}
```

When you roll on this table, it automatically resolves references to other tables (gold-quantities, gemstones, weapons, weapon-quirks), creating rich, varied results like "a bag of gold coins" or "a sword that is glowing with inner fire".

## Template System

The template system allows you to create complex, nested random generation systems by referencing other tables. Templates use double curly braces with a flexible syntax:

```
{{reference-title::table-id::table-name::roll-number::separator}}
```

Where:

- `reference-title`: Optional title for the reference
- `table-id`: ID of the table to roll on
- `table-name`: Optional name for readability
- `roll-number`: Number of times to roll (default: 1)
- `separator`: Separator between multiple rolls (default: ", ")

### Basic Examples

**Simple Reference:**

```json
{
  "content": "{{::currency}}"
}
```

Rolls once on the "currency" table.

**Multiple Rolls:**

```json
{
  "content": "{{::items::Items::3}}"
}
```

Rolls 3 times on the "items" table, results separated by commas.

**Custom Separator:**

```json
{
  "content": "{{::monsters::Monsters::2::||}}"
}
```

Rolls twice on the "monsters" table, results separated by "||".

### Nested Tables Example

Here's how to chain tables together:

```json
{
  "name": "Treasure",
  "description": "Random treasure found in dungeons",
  "entries": [
    {
      "content": "{{::currency}}",
      "weight": 3
    },
    {
      "content": "{{::items::Items::3}} worth {{::currency}}",
      "weight": 2
    }
  ]
}
```

When you roll on this table, the system automatically resolves templates by rolling on referenced tables.

### Standalone Templates

You can also create standalone templates that can be reused across multiple tables:

```json
{
  "name": "NPC Description",
  "description": "Template for generating NPC descriptions",
  "template": "A {{::appearance}} {{::race}} {{::class}} who {{::personality}}"
}
```

These templates can be managed independently of tables, allowing for more modular and reusable content.

## Requirements

- Node.js (v20 or higher)
- npm

## Installation

### Claude Desktop Integration

To integrate the MCP Random Tables server with Claude Desktop, you need to add the server configuration to your `claude_desktop_config.json` file.

```json
{
  "mcpServers": {
    "random-tables": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "random-tables-mcp"],
      "env": {} // Empty object uses default values
    }
  }
}
```

When using an empty `env` object, the server will use default values (DATA_DIR='./data' and CAN_USE_RESOURCE='false'). If you need to customize these values, specify them explicitly:

```json
{
  "mcpServers": {
    "random-tables": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "random-tables-mcp"],
      "env": {
        "DATA_DIR": "/path/to/your/preferred/data/directory",
        "CAN_USE_RESOURCE": "true"
      }
    }
  }
}
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/MikeORed/random-tables-mcp
cd random-tables-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Environment Variables

The server can be configured using the following environment variables:

- `DATA_DIR`: Directory where table data is stored (default: `./data`)
- `CAN_USE_RESOURCE`: Controls whether to use MCP Resources or Tools for certain functionality (default: `false`)

  - When set to `true`: Uses the `TableResource` and `TemplateResource` for accessing tables and templates
  - When not set or any other value: Uses the `GetTableTool` and `GetTemplateTool` instead of resources

This allows compatibility with LLM clients that may not fully support MCP Resources.

## Development

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

## Troubleshooting – Ran into a hiccup? Start here.

Common issues:

1. **Server not showing up in Claude Desktop**

   - Verify your configuration file syntax
   - Make sure the paths are absolute and correct
   - Restart Claude Desktop after making configuration changes

2. **Tool execution failures**

   - Check Claude Desktop logs at:

     - macOS: `~/Library/Logs/Claude/mcp*.log`
     - Windows: `%APPDATA%\\Claude\\logs\\mcp*.log`

## Documentation

Comprehensive documentation is available in the [docs](./docs) directory:

- [Guides and Examples](./docs/guides-and-examples/README.md) - Example tables and usage scenarios
- [Developer Documentation](./docs/dev/README.md) - Architecture details, extension points, and implementation decisions

## Project Structure

```
/
├── docs/                # Documentation for users and developers
├── src/                 # Source code
│   ├── domain/          # Core domain entities and value objects
│   ├── ports/           # Interface definitions for primary and secondary ports
│   ├── useCases/        # Application use cases and service implementations
│   ├── adapters/        # Primary and secondary adapters
│   │   ├── primary/     # Adapters that drive the application (MCP server)
│   │   └── secondary/   # Adapters driven by the application (persistence, RNG)
│   └── index.ts         # Application entry point
├── test/                # Test files
│   ├── unit/            # Unit tests for individual components
│   ├── integration/     # Tests for component interactions
│   └── e2e/             # End-to-end tests
└── scripts/             # Build and utility scripts
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

**Test Types**:

- Unit tests: `test/unit/` - Test individual components in isolation
- Integration tests: `test/integration/` - Test interactions between components
- End-to-end tests: `test/e2e/` - Test the entire system

## Contributing

Got an idea or bug? Open an issue and let's chat—PRs are welcome! See the [Contributing Guide](./CONTRIBUTING.md) for more details.

## License

This project is released under the [MIT License](LICENSE).
