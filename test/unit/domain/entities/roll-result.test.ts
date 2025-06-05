import { RollResult } from "../../../../src/domain/entities/roll-result";

describe("RollResult", () => {
  describe("constructor", () => {
    it("should create a RollResult with required properties", () => {
      const result = new RollResult("table1", "entry1", "Test Result");
      expect(result.tableId).toBe("table1");
      expect(result.entryId).toBe("entry1");
      expect(result.content).toBe("Test Result");
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it("should create a RollResult with custom timestamp", () => {
      const timestamp = new Date("2023-01-01T12:00:00Z");
      const result = new RollResult(
        "table1",
        "entry1",
        "Test Result",
        false,
        undefined,
        timestamp
      );
      expect(result.timestamp).toBe(timestamp);
    });

    it("should create a RollResult with template content", () => {
      const result = new RollResult(
        "table1",
        "entry1",
        "Test {{reference::table2::name}}",
        true
      );
      expect(result.isTemplate).toBe(true);
      expect(result.resolvedContent).toBeUndefined();
    });

    it("should create a RollResult with resolved template content", () => {
      const result = new RollResult(
        "table1",
        "entry1",
        "Test {{reference::table2::name}}",
        true,
        "Test Resolved Content"
      );
      expect(result.isTemplate).toBe(true);
      expect(result.resolvedContent).toBe("Test Resolved Content");
    });
  });

  describe("fromObject", () => {
    it("should create a RollResult from a plain object with required properties", () => {
      const result = RollResult.fromObject({
        tableId: "table1",
        entryId: "entry1",
        content: "Test Result",
      });
      expect(result.tableId).toBe("table1");
      expect(result.entryId).toBe("entry1");
      expect(result.content).toBe("Test Result");
      expect(result.isTemplate).toBe(false);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it("should create a RollResult from a plain object with Date timestamp", () => {
      const timestamp = new Date("2023-01-01T12:00:00Z");
      const result = RollResult.fromObject({
        tableId: "table1",
        entryId: "entry1",
        content: "Test Result",
        timestamp,
      });
      expect(result.timestamp).toBe(timestamp);
    });

    it("should create a RollResult from a plain object with string timestamp", () => {
      const timestampStr = "2023-01-01T12:00:00Z";
      const result = RollResult.fromObject({
        tableId: "table1",
        entryId: "entry1",
        content: "Test Result",
        timestamp: timestampStr,
      });
      expect(result.timestamp).toBeInstanceOf(Date);
      // When a Date is created from a string and then converted back to ISO string,
      // it may include milliseconds that weren't in the original string
      expect(result.timestamp.toISOString()).toBe("2023-01-01T12:00:00.000Z");
    });

    it("should create a RollResult from a plain object with template properties", () => {
      const result = RollResult.fromObject({
        tableId: "table1",
        entryId: "entry1",
        content: "Test {{reference::table2::name}}",
        isTemplate: true,
        resolvedContent: "Test Resolved Content",
      });
      expect(result.isTemplate).toBe(true);
      expect(result.resolvedContent).toBe("Test Resolved Content");
    });
  });

  describe("toObject", () => {
    it("should convert a RollResult to a plain object", () => {
      const timestamp = new Date("2023-01-01T12:00:00Z");
      const result = new RollResult(
        "table1",
        "entry1",
        "Test Result",
        false,
        undefined,
        timestamp
      );
      const obj = result.toObject();
      expect(obj).toEqual({
        tableId: "table1",
        entryId: "entry1",
        content: "Test Result",
        isTemplate: false,
        resolvedContent: undefined,
        timestamp: timestamp.toISOString(),
      });
    });

    it("should convert a RollResult with resolved content to a plain object", () => {
      const timestamp = new Date("2023-01-01T12:00:00Z");
      const result = new RollResult(
        "table1",
        "entry1",
        "Test {{reference::table2::name}}",
        true,
        "Test Resolved Content",
        timestamp
      );
      const obj = result.toObject();
      expect(obj).toEqual({
        tableId: "table1",
        entryId: "entry1",
        content: "Test {{reference::table2::name}}",
        isTemplate: true,
        resolvedContent: "Test Resolved Content",
        timestamp: timestamp.toISOString(),
      });
    });
  });

  describe("withResolvedContent", () => {
    it("should create a new RollResult with resolved content", () => {
      const result = new RollResult(
        "table1",
        "entry1",
        "Test {{reference::table2::name}}",
        true
      );
      const resolvedResult = result.withResolvedContent(
        "Test Resolved Content"
      );

      expect(resolvedResult).not.toBe(result); // Should be a new instance
      expect(resolvedResult.tableId).toBe("table1");
      expect(resolvedResult.entryId).toBe("entry1");
      expect(resolvedResult.content).toBe("Test {{reference::table2::name}}");
      expect(resolvedResult.isTemplate).toBe(true);
      expect(resolvedResult.resolvedContent).toBe("Test Resolved Content");
      expect(resolvedResult.timestamp).toBe(result.timestamp);
    });
  });
});
