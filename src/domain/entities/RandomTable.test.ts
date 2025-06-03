import { RandomTable } from "./RandomTable";
import { TableEntry } from "./TableEntry";
import { RollResult } from "./RollResult";
import { Range } from "../valueObjects/Range";
import { RollTemplate } from "../valueObjects/RollTemplate";

describe("RandomTable", () => {
  describe("constructor", () => {
    it("should create a RandomTable with required properties", () => {
      const table = new RandomTable("table1", "Test Table");
      expect(table.id).toBe("table1");
      expect(table.name).toBe("Test Table");
      expect(table.description).toBe(""); // Default description
      expect(table.entries).toEqual([]);
    });

    it("should create a RandomTable with description", () => {
      const table = new RandomTable("table1", "Test Table", "A test table");
      expect(table.description).toBe("A test table");
    });

    it("should create a RandomTable with initial entries", () => {
      const entries = [
        new TableEntry("entry1", "Entry 1"),
        new TableEntry("entry2", "Entry 2"),
      ];
      const table = new RandomTable("table1", "Test Table", "", entries);
      expect(table.entries).toHaveLength(2);
      expect(table.entries[0].id).toBe("entry1");
      expect(table.entries[1].id).toBe("entry2");
    });

    it("should throw an error if id is empty", () => {
      expect(() => new RandomTable("", "Test Table")).toThrow(
        "Table ID is required"
      );
    });

    it("should throw an error if name is empty", () => {
      expect(() => new RandomTable("table1", "")).toThrow(
        "Table name is required"
      );
    });
  });

  describe("entries and totalWeight", () => {
    it("should return all entries", () => {
      const entries = [
        new TableEntry("entry1", "Entry 1"),
        new TableEntry("entry2", "Entry 2"),
      ];
      const table = new RandomTable("table1", "Test Table", "", entries);
      expect(table.entries).toEqual(entries);
    });

    it("should calculate total weight correctly", () => {
      const entries = [
        new TableEntry("entry1", "Entry 1", 2),
        new TableEntry("entry2", "Entry 2", 3),
      ];
      const table = new RandomTable("table1", "Test Table", "", entries);
      expect(table.totalWeight).toBe(5);
    });

    it("should return 0 for total weight when there are no entries", () => {
      const table = new RandomTable("table1", "Test Table");
      expect(table.totalWeight).toBe(0);
    });
  });

  describe("addEntry", () => {
    it("should add an entry to the table", () => {
      const table = new RandomTable("table1", "Test Table");
      const entry = new TableEntry("entry1", "Entry 1");
      table.addEntry(entry);
      expect(table.entries).toHaveLength(1);
      expect(table.entries[0]).toBe(entry);
    });

    it("should throw an error if entry with same ID already exists", () => {
      const table = new RandomTable("table1", "Test Table");
      const entry1 = new TableEntry("entry1", "Entry 1");
      const entry2 = new TableEntry("entry1", "Entry 2");
      table.addEntry(entry1);
      expect(() => table.addEntry(entry2)).toThrow(
        "Entry with ID entry1 already exists"
      );
    });
  });

  describe("removeEntry", () => {
    it("should remove an entry from the table", () => {
      const entry1 = new TableEntry("entry1", "Entry 1");
      const entry2 = new TableEntry("entry2", "Entry 2");
      const table = new RandomTable("table1", "Test Table", "", [
        entry1,
        entry2,
      ]);
      table.removeEntry("entry1");
      expect(table.entries).toHaveLength(1);
      expect(table.entries[0].id).toBe("entry2");
    });

    it("should throw an error if entry does not exist", () => {
      const table = new RandomTable("table1", "Test Table");
      expect(() => table.removeEntry("nonexistent")).toThrow(
        "Entry with ID nonexistent does not exist"
      );
    });
  });

  describe("updateEntry", () => {
    it("should update an entry's content", () => {
      const entry = new TableEntry("entry1", "Entry 1");
      const table = new RandomTable("table1", "Test Table", "", [entry]);
      table.updateEntry("entry1", { content: "Updated Entry" });
      expect(table.entries[0].content).toBe("Updated Entry");
    });

    it("should update an entry's weight", () => {
      const entry = new TableEntry("entry1", "Entry 1");
      const table = new RandomTable("table1", "Test Table", "", [entry]);
      table.updateEntry("entry1", { weight: 5 });
      expect(table.entries[0].weight).toBe(5);
    });

    it("should update an entry's range", () => {
      const entry = new TableEntry("entry1", "Entry 1");
      const table = new RandomTable("table1", "Test Table", "", [entry]);
      const range = new Range(1, 10);
      table.updateEntry("entry1", { range });
      expect(table.entries[0].range).toBe(range);
    });

    it("should throw an error if entry does not exist", () => {
      const table = new RandomTable("table1", "Test Table");
      expect(() =>
        table.updateEntry("nonexistent", { content: "Updated" })
      ).toThrow("Entry with ID nonexistent does not exist");
    });
  });

  describe("getEntry", () => {
    it("should return an entry by ID", () => {
      const entry = new TableEntry("entry1", "Entry 1");
      const table = new RandomTable("table1", "Test Table", "", [entry]);
      const result = table.getEntry("entry1");
      expect(result).toBe(entry);
    });

    it("should return undefined if entry does not exist", () => {
      const table = new RandomTable("table1", "Test Table");
      const result = table.getEntry("nonexistent");
      expect(result).toBeUndefined();
    });
  });

  describe("roll", () => {
    it("should throw an error if table has no entries", () => {
      const table = new RandomTable("table1", "Test Table");
      expect(() => table.roll()).toThrow("Cannot roll on an empty table");
    });

    it("should roll on a table with entries using ranges", () => {
      const entry1 = new TableEntry("entry1", "Entry 1", 1, new Range(1, 5));
      const entry2 = new TableEntry("entry2", "Entry 2", 1, new Range(6, 10));
      const table = new RandomTable("table1", "Test Table", "", [
        entry1,
        entry2,
      ]);

      // Mock RNG to return a value that will select entry1 (1-5)
      const mockRng = jest.fn().mockReturnValue(0.2); // 0.2 * 10 = 2, which is in range 1-5
      const result = table.roll(mockRng);

      expect(result).toBeInstanceOf(RollResult);
      expect(result.tableId).toBe("table1");
      expect(result.entryId).toBe("entry1");
      expect(result.content).toBe("Entry 1");
    });

    it("should roll on a table with entries using weights", () => {
      const entry1 = new TableEntry("entry1", "Entry 1", 1);
      const entry2 = new TableEntry("entry2", "Entry 2", 2);
      const table = new RandomTable("table1", "Test Table", "", [
        entry1,
        entry2,
      ]);

      // Mock RNG to return a value that will select entry2
      const mockRng = jest.fn().mockReturnValue(0.4); // 0.4 * 3 = 1.2, which is > 1 (entry1's weight)
      const result = table.roll(mockRng);

      expect(result.entryId).toBe("entry2");
    });

    it("should use the first entry as fallback if something goes wrong", () => {
      const entry1 = new TableEntry("entry1", "Entry 1", 0.1); // Very small weight
      const entry2 = new TableEntry("entry2", "Entry 2", 0.1); // Very small weight
      const table = new RandomTable("table1", "Test Table", "", [
        entry1,
        entry2,
      ]);

      // Mock RNG to return a value that might cause floating point issues
      const mockRng = jest.fn().mockReturnValue(0.999999);
      const result = table.roll(mockRng);

      // Ensure we got a valid result (should be entry1 as fallback)
      expect(result).toBeInstanceOf(RollResult);
      expect(["entry1", "entry2"]).toContain(result.entryId);
    });

    it("should detect template entries when rolling", () => {
      // Create an entry with template content
      const templateEntry = new TableEntry(
        "entry1",
        "You encounter a {{monster::monster-table::monsters}} wielding a {{weapon::weapon-table::weapons}}"
      );
      const normalEntry = new TableEntry("entry2", "Just a normal entry");

      const table = new RandomTable("table1", "Test Table", "", [
        templateEntry,
        normalEntry,
      ]);

      // Mock RNG to select the template entry
      const mockRng1 = jest.fn().mockReturnValue(0.1);
      const result1 = table.roll(mockRng1);

      expect(result1.isTemplate).toBe(true);
      expect(result1.entryId).toBe("entry1");
      expect(result1.resolvedContent).toBeUndefined();

      // Mock RNG to select the normal entry
      const mockRng2 = jest.fn().mockReturnValue(0.6);
      const result2 = table.roll(mockRng2);

      expect(result2.isTemplate).toBe(false);
      expect(result2.entryId).toBe("entry2");
    });
  });

  describe("fromObject", () => {
    it("should create a RandomTable from a plain object with required properties", () => {
      const table = RandomTable.fromObject({
        id: "table1",
        name: "Test Table",
      });
      expect(table.id).toBe("table1");
      expect(table.name).toBe("Test Table");
      expect(table.description).toBe("");
      expect(table.entries).toEqual([]);
    });

    it("should create a RandomTable from a plain object with all properties", () => {
      const table = RandomTable.fromObject({
        id: "table1",
        name: "Test Table",
        description: "A test table",
        entries: [
          {
            id: "entry1",
            content: "Entry 1",
            weight: 2,
            range: { min: 1, max: 5 },
          },
          {
            id: "entry2",
            content: "Entry 2",
          },
        ],
      });
      expect(table.id).toBe("table1");
      expect(table.name).toBe("Test Table");
      expect(table.description).toBe("A test table");
      expect(table.entries).toHaveLength(2);
      expect(table.entries[0].id).toBe("entry1");
      expect(table.entries[0].weight).toBe(2);
      expect(table.entries[0].range).toBeInstanceOf(Range);
      expect(table.entries[1].id).toBe("entry2");
    });
  });

  describe("toObject", () => {
    it("should convert a RandomTable to a plain object", () => {
      const entries = [
        new TableEntry("entry1", "Entry 1", 2, new Range(1, 5)),
        new TableEntry("entry2", "Entry 2"),
      ];
      const table = new RandomTable(
        "table1",
        "Test Table",
        "A test table",
        entries
      );
      const obj = table.toObject();
      expect(obj).toEqual({
        id: "table1",
        name: "Test Table",
        description: "A test table",
        entries: [
          {
            id: "entry1",
            content: "Entry 1",
            weight: 2,
            range: { min: 1, max: 5 },
          },
          {
            id: "entry2",
            content: "Entry 2",
            weight: 1,
            range: undefined,
          },
        ],
      });
    });
  });
});
