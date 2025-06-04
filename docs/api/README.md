# API Reference

This section provides detailed documentation for the MCP tools and resources provided by the MCP Random Tables server.

## MCP Tools

The MCP Random Tables server provides the following tools:

- [create_table](./create-table.md) - Create a new random table
- [roll_on_table](./roll-on-table.md) - Roll on a specific table
- [update_table](./update-table.md) - Update an existing table
- [list_tables](./list-tables.md) - List available tables

## MCP Resources

The MCP Random Tables server provides the following resources:

- [table://{tableId}](./table-resource.md) - Access a specific table
- [tables://](./tables-resource.md) - Access a list of all tables

## Schema Documentation

The MCP Random Tables server uses Zod schemas for validation. The following schemas are used:

- [RandomTable Schema](./schemas.md#randomtable-schema) - Schema for random tables
- [TableEntry Schema](./schemas.md#tableentry-schema) - Schema for table entries
- [RollResult Schema](./schemas.md#rollresult-schema) - Schema for roll results

## Configuration

The MCP Random Tables server can be configured using a JSON configuration file. See the [Configuration Guide](./configuration.md) for more information.

## Error Handling

The MCP Random Tables server returns standard error responses. See the [Error Handling Guide](./error-handling.md) for more information.
