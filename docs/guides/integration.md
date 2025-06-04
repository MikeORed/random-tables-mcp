# Integration Guide

This guide provides instructions on how to integrate the MCP Random Tables server with other applications.

## MCP Client Integration

### Configuration

To integrate the MCP Random Tables server with an MCP client, you need to add the server to your MCP client configuration. The exact steps depend on your MCP client, but generally you'll need to add a configuration like this:

```json
{
  "servers": [
    {
      "name": "random-tables",
      "url": "http://localhost:3000",
      "description": "Random Tables for Tabletop RPGs"
    }
  ]
}
```

Replace `http://localhost:3000` with the URL of your MCP Random Tables server.

### Using MCP Tools

Once you've configured your MCP client, you can use the MCP tools provided by the server. Here's an example of using the `create_table` tool:

```
<use_mcp_tool>
<server_name>random-tables</server_name>
<tool_name>create_table</tool_name>
<arguments>
{
  "name": "Forest Encounters",
  "description": "Random encounters in the forest",
  "entries": [
    {
      "content": "Wolf pack",
      "weight": 2
    },
    {
      "content": "Friendly traveler",
      "weight": 1
    },
    {
      "content": "Bandit ambush",
      "weight": 1
    }
  ]
}
</arguments>
</use_mcp_tool>
```

And here's an example of using the `roll_on_table` tool:

```
<use_mcp_tool>
<server_name>random-tables</server_name>
<tool_name>roll_on_table</tool_name>
<arguments>
{
  "tableId": "forest-encounters",
  "count": 1
}
</arguments>
</use_mcp_tool>
```

### Accessing MCP Resources

You can also access the MCP resources provided by the server. Here's an example of accessing the `table://{tableId}` resource:

```
<access_mcp_resource>
<server_name>random-tables</server_name>
<uri>table://forest-encounters</uri>
</access_mcp_resource>
```

And here's an example of accessing the `tables://` resource:

```
<access_mcp_resource>
<server_name>random-tables</server_name>
<uri>tables://</uri>
</access_mcp_resource>
```

## API Integration

If you want to integrate the MCP Random Tables server with a non-MCP application, you can use the HTTP API directly.

### API Endpoints

The MCP Random Tables server provides the following API endpoints:

- `POST /tools/create_table` - Create a new random table
- `POST /tools/roll_on_table` - Roll on a specific table
- `POST /tools/update_table` - Update an existing table
- `POST /tools/list_tables` - List available tables
- `GET /resources/table/{tableId}` - Access a specific table
- `GET /resources/tables` - Access a list of all tables

### Example: Creating a Table

```http
POST /tools/create_table HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Forest Encounters",
  "description": "Random encounters in the forest",
  "entries": [
    {
      "content": "Wolf pack",
      "weight": 2
    },
    {
      "content": "Friendly traveler",
      "weight": 1
    },
    {
      "content": "Bandit ambush",
      "weight": 1
    }
  ]
}
```

### Example: Rolling on a Table

```http
POST /tools/roll_on_table HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "tableId": "forest-encounters",
  "count": 1
}
```

## Programmatic Integration

If you want to integrate the MCP Random Tables server with a Node.js application, you can use the MCP client library.

### Installation

```bash
npm install mcp-client
```

### Example: Creating a Table

```javascript
const { McpClient } = require("mcp-client");

const client = new McpClient({
  servers: [
    {
      name: "random-tables",
      url: "http://localhost:3000",
      description: "Random Tables for Tabletop RPGs",
    },
  ],
});

async function createTable() {
  const result = await client.useTool("random-tables", "create_table", {
    name: "Forest Encounters",
    description: "Random encounters in the forest",
    entries: [
      {
        content: "Wolf pack",
        weight: 2,
      },
      {
        content: "Friendly traveler",
        weight: 1,
      },
      {
        content: "Bandit ambush",
        weight: 1,
      },
    ],
  });

  console.log(result);
}

createTable();
```

### Example: Rolling on a Table

```javascript
const { McpClient } = require("mcp-client");

const client = new McpClient({
  servers: [
    {
      name: "random-tables",
      url: "http://localhost:3000",
      description: "Random Tables for Tabletop RPGs",
    },
  ],
});

async function rollOnTable() {
  const result = await client.useTool("random-tables", "roll_on_table", {
    tableId: "forest-encounters",
    count: 1,
  });

  console.log(result);
}

rollOnTable();
```

## Next Steps

Now that you've learned how to integrate the MCP Random Tables server with other applications, you can:

- Learn how to use the [template system to create complex tables](./templates.md)
- Explore the [API reference](../api/README.md) for more details on the available tools and resources
