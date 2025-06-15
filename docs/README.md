# MCP Random Tables Documentation

Welcome to the documentation for the MCP Random Tables server. This documentation will help you understand how to use, integrate, and extend the MCP Random Tables server.

## Documentation Sections

- [Examples and Guides](./examples-and-guides/README.md) - Example tables and usage scenarios
- [Developer Documentation](./dev/README.md) - Architecture, extension points, and implementation notes

## What is MCP Random Tables?

MCP Random Tables is an MCP server that allows you to create, persist, look up, roll on, and update random tables used in tabletop RPGs. It follows a hexagonal architecture (ports & adapters) to maintain a clean separation of concerns and make the system more testable and maintainable.

## Key Features

- **Create and manage random tables** - Create, update, and delete random tables
- **Roll on tables** - Roll on tables to get random results
- **Template support** - Use templates to reference other tables
- **Range-based entries** - Define entries with ranges for dice-based tables
- **Weighted entries** - Define entries with weights for probability-based tables

## Quick Start

See the [Getting Started Guide](./guides/getting-started.md) for instructions on how to install, configure, and use the MCP Random Tables server.

## Contributing

If you'd like to contribute to the MCP Random Tables project, please see the [Contributing Guide](../CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
