# Getting Started Guide

This guide will help you get started with the MCP Random Tables server.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

```bash
# Clone the repository
git clone https://github.com/MikeORed/random-tables-mcp
cd mcp-random-tables

# Install dependencies
npm install
```

## Running the Server

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run the built project
npm start
```

By default, the server will listen on port 3000. You can configure the port by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Configuring the MCP Client

To use the MCP Random Tables server with an MCP client, you need to add the server to your MCP client configuration. The exact steps depend on your MCP client, but generally you'll need to add a configuration like this:

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

## Creating Your First Table

Once you have the server running and configured with your MCP client, you can create your first table. Here's an example of a simple "Forest Encounters" table:

- **Name**: Forest Encounters
- **Description**: Random encounters in the forest
- **Entries**:
  - Wolf pack (weight: 2)
  - Friendly traveler (weight: 1)
  - Bandit ambush (weight: 1)

The "Wolf pack" entry has a weight of 2, making it twice as likely to be rolled as the other entries.

When using an LLM application with the MCP Random Tables server connected, you can simply ask the LLM to create this table, and it will use the appropriate MCP tools behind the scenes.

## Rolling on a Table

Once you've created a table, you can roll on it by asking the LLM to roll on the "Forest Encounters" table. You can also specify how many times to roll on the table.

The LLM will use the appropriate MCP tools behind the scenes to fulfill your request and present the results to you.

## Next Steps

Now that you've created your first table and rolled on it, you can:

- Learn how to [integrate the MCP Random Tables server with other applications](./integration.md)
- Learn how to use the [template system to create complex tables](./templates.md)
- Explore the [API reference](../api/README.md) for more details on the available tools and resources
