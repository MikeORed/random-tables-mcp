import { TableEntry } from "../../../../src/domain/entities/TableEntry";
import { Range } from "../../../../src/domain/valueObjects/Range";
import { RollTemplate } from "../../../../src/domain/valueObjects/RollTemplate";

describe("TableEntry", () => {
  describe("constructor", () => {
    it("should create a TableEntry with required properties", () => {
      const entry = new TableEntry("entry1", "Test Entry");
      expect(entry.id).toBe("entry1");
      expect(entry.content).toBe("Test Entry");
      expect(entry.weight).toBe(1); // Default weight
      expect(entry.range).toBeUndefined();
    });

    it("should create a TableEntry with custom weight", () => {
      const entry = new TableEntry("entry1", "Test Entry", 5);
      expect(entry.weight).toBe(5);
    });

    it("should create a TableEntry with range", () => {
      const range = new Range(1, 10);
      const entry = new TableEntry("entry1", "Test Entry", 1, range);
      expect(entry.range).toBe(range);
    });

    it("should throw an error if weight is zero or negative", () => {
      expect(() => new TableEntry("entry1", "Test Entry", 0)).toThrow(
        "Weight must be greater than zero"
      );
      expect(() => new TableEntry("entry1", "Test Entry", -1)).toThrow(
        "Weight must be greater than zero"
      );
    });
  });

  describe("isInRange", () => {
    it("should return false if entry has no range", () => {
      const entry = new TableEntry("entry1", "Test Entry");
      expect(entry.isInRange(5)).toBe(false);
    });

    it("should return true if value is within range", () => {
      const range = new Range(1, 10);
      const entry = new TableEntry("entry1", "Test Entry", 1, range);
      expect(entry.isInRange(5)).toBe(true);
    });

    it("should return false if value is outside range", () => {
      const range = new Range(1, 10);
      const entry = new TableEntry("entry1", "Test Entry", 1, range);
      expect(entry.isInRange(11)).toBe(false);
    });
  });

  describe("isTemplate", () => {
    it("should return true if content contains template references", () => {
      const entry = new TableEntry(
        "entry1",
        "You encounter a {{monster::monster-table::monsters}}"
      );
      expect(entry.isTemplate()).toBe(true);
    });

    it("should return false if content does not contain template references", () => {
      const entry = new TableEntry("entry1", "Just a normal entry");
      expect(entry.isTemplate()).toBe(false);
    });

    it("should use RollTemplate.isTemplate to check content", () => {
      // Mock RollTemplate.isTemplate
      const originalIsTemplate = RollTemplate.isTemplate;
      RollTemplate.isTemplate = jest.fn().mockReturnValue(true);

      const entry = new TableEntry("entry1", "Any content");
      const result = entry.isTemplate();

      expect(RollTemplate.isTemplate).toHaveBeenCalledWith("Any content");
      expect(result).toBe(true);

      // Restore original function
      RollTemplate.isTemplate = originalIsTemplate;
    });
  });

  describe("update", () => {
    it("should create a new entry with updated content", () => {
      const entry = new TableEntry("entry1", "Test Entry");
      const updated = entry.update({ content: "Updated Entry" });
      expect(updated.id).toBe("entry1");
      expect(updated.content).toBe("Updated Entry");
      expect(updated.weight).toBe(1);
    });

    it("should create a new entry with updated weight", () => {
      const entry = new TableEntry("entry1", "Test Entry");
      const updated = entry.update({ weight: 5 });
      expect(updated.content).toBe("Test Entry");
      expect(updated.weight).toBe(5);
    });

    it("should create a new entry with updated range", () => {
      const entry = new TableEntry("entry1", "Test Entry");
      const range = new Range(1, 10);
      const updated = entry.update({ range });
      expect(updated.range).toBe(range);
    });

    it("should not modify the original entry", () => {
      const entry = new TableEntry("entry1", "Test Entry");
      const updated = entry.update({ content: "Updated Entry" });
      expect(entry.content).toBe("Test Entry");
      expect(updated.content).toBe("Updated Entry");
    });
  });

  describe("fromObject", () => {
    it("should create a TableEntry from a plain object with required properties", () => {
      const entry = TableEntry.fromObject({
        id: "entry1",
        content: "Test Entry",
      });
      expect(entry.id).toBe("entry1");
      expect(entry.content).toBe("Test Entry");
      expect(entry.weight).toBe(1);
      expect(entry.range).toBeUndefined();
    });

    it("should create a TableEntry from a plain object with all properties", () => {
      const entry = TableEntry.fromObject({
        id: "entry1",
        content: "Test Entry",
        weight: 5,
        range: { min: 1, max: 10 },
      });
      expect(entry.id).toBe("entry1");
      expect(entry.content).toBe("Test Entry");
      expect(entry.weight).toBe(5);
      expect(entry.range).toBeInstanceOf(Range);
      expect(entry.range?.min).toBe(1);
      expect(entry.range?.max).toBe(10);
    });
  });

  describe("toObject", () => {
    it("should convert a TableEntry to a plain object without range", () => {
      const entry = new TableEntry("entry1", "Test Entry", 5);
      const obj = entry.toObject();
      expect(obj).toEqual({
        id: "entry1",
        content: "Test Entry",
        weight: 5,
        range: undefined,
      });
    });

    it("should convert a TableEntry to a plain object with range", () => {
      const range = new Range(1, 10);
      const entry = new TableEntry("entry1", "Test Entry", 5, range);
      const obj = entry.toObject();
      expect(obj).toEqual({
        id: "entry1",
        content: "Test Entry",
        weight: 5,
        range: { min: 1, max: 10 },
      });
    });
  });
});
