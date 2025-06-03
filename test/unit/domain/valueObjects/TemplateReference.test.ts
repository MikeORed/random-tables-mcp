import { TemplateReference } from "../../../../src/domain/valueObjects/TemplateReference";

describe("TemplateReference", () => {
  describe("constructor", () => {
    it("should create a TemplateReference with required properties", () => {
      const ref = new TemplateReference("monster", "monster-table", "monsters");
      expect(ref.title).toBe("monster");
      expect(ref.tableId).toBe("monster-table");
      expect(ref.tableName).toBe("monsters");
      expect(ref.rollCount).toBe(1); // Default roll count
      expect(ref.separator).toBe(", "); // Default separator
    });

    it("should create a TemplateReference with custom roll count and separator", () => {
      const ref = new TemplateReference(
        "monster",
        "monster-table",
        "monsters",
        3,
        " | "
      );
      expect(ref.rollCount).toBe(3);
      expect(ref.separator).toBe(" | ");
    });

    it("should throw an error if roll count is less than 1", () => {
      expect(
        () => new TemplateReference("monster", "monster-table", "monsters", 0)
      ).toThrow("Roll count must be at least 1");
      expect(
        () => new TemplateReference("monster", "monster-table", "monsters", -1)
      ).toThrow("Roll count must be at least 1");
    });
  });

  describe("fromString", () => {
    it("should create a TemplateReference from a string with all parts", () => {
      const ref = TemplateReference.fromString(
        "monster::monster-table::monsters::3::, "
      );
      expect(ref.title).toBe("monster");
      expect(ref.tableId).toBe("monster-table");
      expect(ref.tableName).toBe("monsters");
      expect(ref.rollCount).toBe(3);
      expect(ref.separator).toBe(", ");
    });

    it("should create a TemplateReference from a string with minimal parts", () => {
      const ref = TemplateReference.fromString(
        "monster::monster-table::monsters"
      );
      expect(ref.title).toBe("monster");
      expect(ref.tableId).toBe("monster-table");
      expect(ref.tableName).toBe("monsters");
      expect(ref.rollCount).toBe(1); // Default
      expect(ref.separator).toBe(", "); // Default
    });

    it("should handle empty parts", () => {
      const ref = TemplateReference.fromString("monster::::monsters");
      expect(ref.title).toBe("monster");
      expect(ref.tableId).toBe("");
      expect(ref.tableName).toBe("monsters");
    });
  });

  describe("toString", () => {
    it("should convert a TemplateReference to a basic string", () => {
      const ref = new TemplateReference(
        "monster",
        "monster-table",
        "monsters",
        3,
        " | "
      );
      expect(ref.toString()).toBe("{{monster::monster-table::monsters}}");
    });

    it("should convert a TemplateReference with default values to a basic string", () => {
      const ref = new TemplateReference("monster", "monster-table", "monsters");
      expect(ref.toString()).toBe("{{monster::monster-table::monsters}}");
    });
  });

  describe("toFullString", () => {
    it("should convert a TemplateReference to a full string with all parts", () => {
      const ref = new TemplateReference(
        "monster",
        "monster-table",
        "monsters",
        3,
        " | "
      );
      expect(ref.toFullString()).toBe(
        "{{monster::monster-table::monsters::3:: | }}"
      );
    });

    it("should convert a TemplateReference with default values to a full string", () => {
      const ref = new TemplateReference("monster", "monster-table", "monsters");
      expect(ref.toFullString()).toBe(
        "{{monster::monster-table::monsters::1::, }}"
      );
    });
  });
});
