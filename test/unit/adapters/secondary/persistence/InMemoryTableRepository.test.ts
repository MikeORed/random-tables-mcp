import { InMemoryTableRepository } from "../../../../../src/adapters/secondary/persistence/InMemoryTableRepository";
import { RandomTable } from "../../../../../src/domain/entities/RandomTable";
import { TableEntry } from "../../../../../src/domain/entities/TableEntry";
import { Range } from "../../../../../src/domain/valueObjects/Range";

describe("InMemoryTableRepository", () => {
  let repository: InMemoryTableRepository;
  let sampleTable: RandomTable;

  beforeEach(() => {
    repository = new InMemoryTableRepository();

    // Create a sample table for testing
    sampleTable = new RandomTable(
      "test-table-1",
      "Test Table",
      "A table for testing",
      [
        new TableEntry("entry-1", "First entry", 1),
        new TableEntry("entry-2", "Second entry", 2, new Range(1, 3)),
        new TableEntry("entry-3", "Third entry", 3),
      ]
    );
  });

  describe("save", () => {
    it("should save a table and return its ID", async () => {
      const id = await repository.save(sampleTable);
      expect(id).toBe(sampleTable.id);
    });
  });

  describe("getById", () => {
    it("should return null for non-existent table", async () => {
      const result = await repository.getById("non-existent");
      expect(result).toBeNull();
    });

    it("should retrieve a saved table by ID", async () => {
      await repository.save(sampleTable);
      const result = await repository.getById(sampleTable.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(sampleTable.id);
      expect(result?.name).toBe(sampleTable.name);
      expect(result?.description).toBe(sampleTable.description);
      expect(result?.entries.length).toBe(sampleTable.entries.length);
    });
  });

  describe("update", () => {
    it("should throw an error when updating a non-existent table", async () => {
      await expect(repository.update(sampleTable)).rejects.toThrow(
        `Table with ID ${sampleTable.id} does not exist`
      );
    });

    it("should update an existing table", async () => {
      await repository.save(sampleTable);

      // Create an updated version of the table
      const updatedEntries = [
        new TableEntry("entry-1", "Updated first entry", 1),
        new TableEntry("entry-4", "New entry", 4),
      ];

      const updatedTable = new RandomTable(
        sampleTable.id,
        "Updated Test Table",
        "Updated description",
        updatedEntries
      );

      await repository.update(updatedTable);

      const result = await repository.getById(sampleTable.id);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Updated Test Table");
      expect(result?.description).toBe("Updated description");
      expect(result?.entries.length).toBe(2);
      expect(result?.entries[0].content).toBe("Updated first entry");
      expect(result?.entries[1].content).toBe("New entry");
    });
  });

  describe("list", () => {
    beforeEach(async () => {
      // Clear repository and add sample tables
      repository.clear();

      await repository.save(sampleTable);

      const anotherTable = new RandomTable(
        "test-table-2",
        "Another Table",
        "Another table for testing",
        [new TableEntry("entry-1", "Only entry", 1)]
      );

      await repository.save(anotherTable);
    });

    it("should list all tables when no filter is provided", async () => {
      const tables = await repository.list();
      expect(tables.length).toBe(2);
      expect(tables.map((t) => t.id).sort()).toEqual(
        ["test-table-1", "test-table-2"].sort()
      );
    });

    it("should filter tables by simple property", async () => {
      const tables = await repository.list({ name: "Test Table" });
      expect(tables.length).toBe(1);
      expect(tables[0].id).toBe("test-table-1");
    });

    it("should filter tables by nested property", async () => {
      // Filter tables with exactly 3 entries
      const tables = await repository.list({ "entries.length": 3 });
      expect(tables.length).toBe(1);
      expect(tables[0].id).toBe("test-table-1");
    });

    it("should return empty array when no tables match filter", async () => {
      const tables = await repository.list({ name: "Non-existent Table" });
      expect(tables.length).toBe(0);
    });
  });

  describe("delete", () => {
    it("should throw an error when deleting a non-existent table", async () => {
      await expect(repository.delete("non-existent")).rejects.toThrow(
        "Table with ID non-existent does not exist"
      );
    });

    it("should delete an existing table", async () => {
      await repository.save(sampleTable);
      await repository.delete(sampleTable.id);

      const result = await repository.getById(sampleTable.id);
      expect(result).toBeNull();
    });
  });

  describe("clear", () => {
    it("should remove all tables from the repository", async () => {
      await repository.save(sampleTable);
      await repository.save(new RandomTable("test-table-2", "Another Table"));

      repository.clear();

      const tables = await repository.list();
      expect(tables.length).toBe(0);
    });
  });
});
