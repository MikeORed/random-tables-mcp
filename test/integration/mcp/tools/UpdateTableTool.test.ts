import { UpdateTableTool } from "../../../../src/adapters/primary/mcp/tools/UpdateTableTool";
import { TableServiceImpl } from "../../../../src/useCases/implementations/TableServiceImpl";
import { CreateTableUseCase } from "../../../../src/useCases/CreateTableUseCase";
import { GetTableUseCase } from "../../../../src/useCases/GetTableUseCase";
import { ListTablesUseCase } from "../../../../src/useCases/ListTablesUseCase";
import { UpdateTableUseCase } from "../../../../src/useCases/UpdateTableUseCase";
import { InMemoryTableRepository } from "../../../../src/adapters/secondary/persistence/InMemoryTableRepository";
import { RandomTable } from "../../../../src/domain/entities/RandomTable";
import { TableEntry } from "../../../../src/domain/entities/TableEntry";
import { v4 as uuidv4 } from "uuid";

describe("UpdateTableTool Integration Tests", () => {
  let updateTableTool: UpdateTableTool;
  let tableService: TableServiceImpl;
  let tableRepository: InMemoryTableRepository;
  let tableId: string;
  let entryIds: string[];

  beforeEach(async () => {
    // Set up dependencies with in-memory repository for testing
    tableRepository = new InMemoryTableRepository();

    // Initialize use cases
    const createTableUseCase = new CreateTableUseCase(tableRepository);
    const getTableUseCase = new GetTableUseCase(tableRepository);
    const listTablesUseCase = new ListTablesUseCase(tableRepository);
    const updateTableUseCase = new UpdateTableUseCase(tableRepository);

    // Initialize service
    tableService = new TableServiceImpl(
      createTableUseCase,
      getTableUseCase,
      listTablesUseCase,
      updateTableUseCase
    );

    // Initialize tool
    updateTableTool = new UpdateTableTool(tableService);

    // Create a test table
    tableId = uuidv4();
    entryIds = [uuidv4(), uuidv4(), uuidv4()];
    const entries = [
      new TableEntry(entryIds[0], "Entry 1", 1),
      new TableEntry(entryIds[1], "Entry 2", 2),
      new TableEntry(entryIds[2], "Entry 3", 1),
    ];
    const table = new RandomTable(
      tableId,
      "Test Table",
      "A test table",
      entries
    );
    await tableRepository.save(table);
  });

  it("should have the correct name and description", () => {
    expect(updateTableTool.getName()).toBe("update_table");
    expect(updateTableTool.getToolDefinition().description).toBe(
      "Update an existing random table"
    );
  });

  it("should update table name and description", async () => {
    const result = await updateTableTool.execute({
      tableId,
      updates: {
        name: "Updated Table Name",
        description: "Updated description",
      },
    });

    expect(result).toHaveProperty("success", true);

    // Verify the table was updated in the repository
    const table = await tableService.getTable(tableId);
    expect(table).not.toBeNull();
    expect(table!.name).toBe("Updated Table Name");
    expect(table!.description).toBe("Updated description");
    expect(table!.entries).toHaveLength(3); // Entries should remain unchanged
  });

  it("should add new entries", async () => {
    const result = await updateTableTool.execute({
      tableId,
      updates: {
        entries: {
          add: [
            { content: "New Entry 1" },
            { content: "New Entry 2", weight: 3 },
          ],
        },
      },
    });

    expect(result).toHaveProperty("success", true);

    // Verify the entries were added
    const table = await tableService.getTable(tableId);
    expect(table).not.toBeNull();
    expect(table!.entries).toHaveLength(5); // 3 original + 2 new entries

    // Verify the new entries
    const entryContents = table!.entries.map((e) => e.content);
    expect(entryContents).toContain("New Entry 1");
    expect(entryContents).toContain("New Entry 2");

    // Verify the weight of the new entry
    const newEntry2 = table!.entries.find((e) => e.content === "New Entry 2");
    expect(newEntry2).toBeDefined();
    expect(newEntry2!.weight).toBe(3);
  });

  it("should update existing entries", async () => {
    const result = await updateTableTool.execute({
      tableId,
      updates: {
        entries: {
          update: [
            {
              id: entryIds[0],
              updates: {
                content: "Updated Entry 1",
                weight: 5,
              },
            },
          ],
        },
      },
    });

    expect(result).toHaveProperty("success", true);

    // Verify the entry was updated
    const table = await tableService.getTable(tableId);
    expect(table).not.toBeNull();

    const updatedEntry = table!.entries.find((e) => e.id === entryIds[0]);
    expect(updatedEntry).toBeDefined();
    expect(updatedEntry!.content).toBe("Updated Entry 1");
    expect(updatedEntry!.weight).toBe(5);
  });

  it("should remove entries", async () => {
    const result = await updateTableTool.execute({
      tableId,
      updates: {
        entries: {
          remove: [entryIds[1]],
        },
      },
    });

    expect(result).toHaveProperty("success", true);

    // Verify the entry was removed
    const table = await tableService.getTable(tableId);
    expect(table).not.toBeNull();
    expect(table!.entries).toHaveLength(2);

    // Verify the specific entry was removed
    const removedEntry = table!.entries.find((e) => e.id === entryIds[1]);
    expect(removedEntry).toBeUndefined();

    // Verify the other entries are still there
    const remainingEntryIds = table!.entries.map((e) => e.id);
    expect(remainingEntryIds).toContain(entryIds[0]);
    expect(remainingEntryIds).toContain(entryIds[2]);
  });

  it("should perform multiple update operations at once", async () => {
    const result = await updateTableTool.execute({
      tableId,
      updates: {
        name: "Comprehensive Update",
        entries: {
          add: [{ content: "New Entry" }],
          update: [
            {
              id: entryIds[0],
              updates: { content: "Updated Content" },
            },
          ],
          remove: [entryIds[2]],
        },
      },
    });

    expect(result).toHaveProperty("success", true);

    // Verify all updates were applied
    const table = await tableService.getTable(tableId);
    expect(table).not.toBeNull();
    expect(table!.name).toBe("Comprehensive Update");
    expect(table!.entries).toHaveLength(3); // 3 original - 1 removed + 1 added

    // Verify entry was updated
    const updatedEntry = table!.entries.find((e) => e.id === entryIds[0]);
    expect(updatedEntry).toBeDefined();
    expect(updatedEntry!.content).toBe("Updated Content");

    // Verify entry was removed
    const removedEntry = table!.entries.find((e) => e.id === entryIds[2]);
    expect(removedEntry).toBeUndefined();

    // Verify entry was added
    const newEntry = table!.entries.find((e) => e.content === "New Entry");
    expect(newEntry).toBeDefined();
  });

  it("should throw an error when updating a non-existent table", async () => {
    await expect(
      updateTableTool.execute({
        tableId: "non-existent-id",
        updates: {
          name: "This will fail",
        },
      })
    ).rejects.toThrow();
  });

  it("should validate input schema", async () => {
    // Missing required tableId field
    await expect(
      updateTableTool.execute({
        updates: {
          name: "Invalid update",
        },
      } as any)
    ).rejects.toThrow();
  });
});
