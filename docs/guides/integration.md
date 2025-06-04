# Integration Guide

This guide provides instructions on how to integrate the MCP Random Tables server with other applications.

## Claude Desktop Integration

To integrate the MCP Random Tables server with Claude Desktop, you need to add the server configuration to your `claude_desktop_config.json` file.

### Windows Configuration

Add this to your `claude_desktop_config.json`:

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

Replace `C:\\path\\to\\mcp-random-tables` with the actual path to your local installation of the MCP Random Tables server. Set `CAN_USE_RESOURCE` to `"true"` only if you're certain the LLM Application is able to leverage MCP resources.

### NPX Configuration - COMING SOON!

> Note: The MCP Random Tables server is not yet published to the public npm repository. This configuration will be available once the package is published.

### How MCP Tools Work

Once you've configured your MCP client, the LLM application will automatically have access to the tools provided by the MCP Random Tables server. The MCP server registers its tools with the LLM application, and the LLM can then use these tools through its normal function calling capabilities.

The MCP Random Tables server provides the following tools:

- `create_table` - Create a new random table
- `roll_on_table` - Roll on a specific table
- `update_table` - Update an existing table
- `list_tables` - List available tables
- `get_table` - Get details of a specific table

When using an LLM application with the MCP Random Tables server connected, you can simply ask the LLM to perform actions like creating tables or rolling on tables, and it will automatically use the appropriate MCP tools behind the scenes.

### How MCP Resources Work

The MCP Random Tables server also provides resources that can be accessed by the LLM application:

- `table://{tableId}` - Access a specific table
- `tables://` - Access a list of all tables

These resources are automatically available to the LLM application when the MCP server is connected, allowing the LLM to retrieve information about tables when needed.

## Example Usage

When using an LLM application with the MCP Random Tables server connected, you can interact with it naturally. For example:

1. **Creating a table**: "Create a random table called 'Forest Encounters' with entries for wolf pack, friendly traveler, and bandit ambush."

2. **Rolling on a table**: "Roll on the Forest Encounters table."

3. **Listing tables**: "What random tables are available?"

4. **Getting table details**: "Show me the details of the Forest Encounters table."

The LLM will use the appropriate MCP tools behind the scenes to fulfill these requests. The actual tool calls are handled automatically by the LLM application and are typically not visible in the conversation.

## Developer Integration

For developers who want to integrate with the MCP Random Tables server programmatically, please refer to the [MCP Protocol documentation](https://github.com/modelcontextprotocol/protocol) for details on how to implement an MCP client.

## Next Steps

Now that you've learned how to integrate the MCP Random Tables server with other applications, you can:

- Learn how to use the [template system to create complex tables](./templates.md)
- Explore the [API reference](../api/README.md) for more details on the available tools and resources
