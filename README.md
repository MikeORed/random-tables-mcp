# MCP Random Tables

Need a drop‑in random‑table engine for your next one‑shot? **MCP Random Tables has you covered.**

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for managing and rolling on random-table assets used in tabletop RPGs, following a hexagonal architecture (ports & adapters) approach.

## Project Overview

This section details the server’s core capabilities and architecture—how random‑table definitions are stored, rolled, and extended while ports & adapters keep concerns isolated and the codebase easy to test and maintain.

## Features

- **Create** random tables in seconds and keep them updated
- **Roll** results instantly on any table
- **Link** tables together with powerful template support
- **Define** range‑based entries for dice‑driven tables
- **Weight** entries to fine‑tune probabilities
- **Choose** your access model – MCP _Resources_ or _Tools_ (see the [Environment Variables](#environment-variables) section to toggle)

## Available Tools

- `create_table` - Create a new random table with optional initial entries
- `roll_on_table` - Roll on a specific table and returns the result
- `update_table` - Update an existing table (name, description, entries)
- `list_tables` - List available tables with metadata
- `get_table` - Get details of a specific table

_See the [Environment Variables](#environment-variables) section for how to switch between using Tools and Resources._

## Available Resources

- `table://{tableId}` - Access a specific table
- `tables://` - Access a list of all tables

## Key Use Cases

- **RPG Encounter Generation**: Generate random encounters for tabletop RPGs
- **Loot Generation**: Create dynamic treasure and item drops
- **NPC Generation**: Build complex NPCs with personality traits, equipment, and motivations
- **Story Prompt Generation**: Generate creative writing prompts and plot hooks

## Template System Example

Here’s how easy it is to chain tables together:

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

When you roll on this table, the system automatically resolves templates by rolling on referenced tables. For example, `{{::items::Items::3}}` will roll 3 times on the "Items" table.

## Requirements

- Node.js (v20 or higher)
- npm

## Installation

### Claude Desktop Integration

To integrate the MCP Random Tables server with Claude Desktop, you need to add the server configuration to your `claude_desktop_config.json` file.

#### Windows Configuration

Add this to your `claude_desktop_config.json` (located at `%APPDATA%\\Claude\\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "random-tables": {
      "type": "stdio",
      "command": "node",
      "args": ["C:\\path\\to\\mcp-random-tables\\dist\\index.js"],
      "env": {
        "CAN_USE_RESOURCE": "false"
      }
    }
  }
}
```

Replace `C:\\path\\to\\mcp-random-tables` with the actual path to your local installation.

#### macOS Configuration

Add this to your `claude_desktop_config.json` (located at `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "random-tables": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/mcp-random-tables/dist/index.js"],
      "env": {
        "CAN_USE_RESOURCE": "false"
      }
    }
  }
}
```

Replace `/path/to/mcp-random-tables` with the actual path to your local installation.

### NPX Configuration – 🚧 We’re hammering out the NPX package; stay tuned!

> **Note:** The MCP Random Tables server is not yet published to npm. We plan to deploy it after test coverage is solid and we're comfortable with the functionality.

### Manual Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-random-tables

# Install dependencies
npm install

# Build the project
npm run build
```

## Environment Variables

The server can be configured using the following environment variables:

- `DATA_DIR`: Directory where table data is stored (default: `./data`)
- `CAN_USE_RESOURCE`: Controls whether to use MCP Resources or Tools for certain functionality (default: `false`)

  - When set to `true`: Uses the `TableResource` for accessing tables
  - When not set or any other value: Uses the `GetTableTool` instead of `TableResource`

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

- [User Guides](./docs/guides/README.md) - Step-by-step instructions for installation, integration, and template usage
- [Examples](./docs/examples/README.md) - Sample tables from simple encounters to complex nested treasure generators
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

Got an idea or bug? Open an issue and let’s chat—PRs are welcome! See the [Contributing Guide](./CONTRIBUTING.md) for more details.

## License

This project is released under the [MIT License](LICENSE).
