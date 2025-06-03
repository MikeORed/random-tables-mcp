import { McpClient } from "./helpers/McpClient";

describe("MCP Random Tables E2E", () => {
  let client: McpClient;

  beforeAll(async () => {
    client = new McpClient();
    await client.connect();
  });

  afterAll(async () => {
    await client.disconnect();
  });

  it("should create a table, roll on it, and update it", async () => {
    // Create a table
    const createResult = await client.callTool("create_table", {
      name: "Test Table",
      description: "A test table",
      entries: [
        { content: "Entry 1" },
        { content: "Entry 2" },
        { content: "Entry 3" },
      ],
    });

    const tableId = createResult.tableId;
    expect(tableId).toBeDefined();

    // Roll on the table
    const rollResult = await client.callTool("roll_on_table", {
      tableId,
      count: 2,
    });

    expect(rollResult.results).toHaveLength(2);
    expect(rollResult.results[0].tableId).toBe(tableId);

    // Update the table
    const updateResult = await client.callTool("update_table", {
      tableId,
      updates: {
        name: "Updated Test Table",
        entries: {
          add: [{ content: "Entry 4" }],
        },
      },
    });

    expect(updateResult.success).toBe(true);

    // List tables
    const listResult = await client.callTool("list_tables", {});
    expect(listResult.tables).toContainEqual(
      expect.objectContaining({
        id: tableId,
        name: "Updated Test Table",
      })
    );

    // Access table resource
    const tableResource = await client.readResource(`table://${tableId}`);
    expect(tableResource).toBeDefined();
    expect(tableResource.id).toBe(tableId);
    expect(tableResource.name).toBe("Updated Test Table");
    expect(tableResource.entries).toHaveLength(4); // 3 original + 1 added

    // Access tables resource
    const tablesResource = await client.readResource("tables://");
    expect(tablesResource).toBeDefined();
    expect(tablesResource.tables).toBeInstanceOf(Array);
    expect(tablesResource.tables.length).toBeGreaterThanOrEqual(1);
    expect(tablesResource.tables.some((t: any) => t.id === tableId)).toBe(true);
  });

  it("should handle errors gracefully", async () => {
    // Try to roll on a non-existent table
    await expect(
      client.callTool("roll_on_table", {
        tableId: "non-existent-id",
      })
    ).rejects.toThrow();

    // Try to update a non-existent table
    await expect(
      client.callTool("update_table", {
        tableId: "non-existent-id",
        updates: {
          name: "This will fail",
        },
      })
    ).rejects.toThrow();

    // Try to access a non-existent table resource
    await expect(
      client.readResource("table://non-existent-id")
    ).rejects.toThrow();
  });
});
