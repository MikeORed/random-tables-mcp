import { FileTableRepository } from '../../../../../src/adapters/secondary/persistence/file-table-repository';
import { RandomTable } from '../../../../../src/domain/entities/random-table';
import { TableEntry } from '../../../../../src/domain/entities/table-entry';
import { Range } from '../../../../../src/domain/value-objects/roll-range';
import * as fs from 'fs';
import * as path from 'path';

// Mock the fs module
jest.mock('fs');
jest.mock('path');

describe('FileTableRepository', () => {
  let repository: FileTableRepository;
  let sampleTable: RandomTable;
  const testDataDir = '/test/data/dir';

  // Mock implementations for fs functions
  const mockReadFile = jest.fn();
  const mockWriteFile = jest.fn();
  const mockMkdir = jest.fn();
  const mockReaddir = jest.fn();
  const mockUnlink = jest.fn();
  const mockAccess = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock implementations
    (fs.readFile as unknown as jest.Mock).mockImplementation((path, encoding, callback) => {
      mockReadFile(path, encoding, callback);
      callback(null, JSON.stringify(sampleTable.toObject()));
    });

    (fs.writeFile as unknown as jest.Mock).mockImplementation((path, data, encoding, callback) => {
      mockWriteFile(path, data, encoding, callback);
      callback(null);
    });

    (fs.mkdir as unknown as jest.Mock).mockImplementation((path, options, callback) => {
      mockMkdir(path, options, callback);
      callback(null);
    });

    (fs.readdir as unknown as jest.Mock).mockImplementation((path, callback) => {
      mockReaddir(path, callback);
      callback(null, ['test-table-1.json', 'test-table-2.json']);
    });

    (fs.unlink as unknown as jest.Mock).mockImplementation((path, callback) => {
      mockUnlink(path, callback);
      callback(null);
    });

    (fs.access as unknown as jest.Mock).mockImplementation((path, callback) => {
      mockAccess(path, callback);
      // Simulate file exists for specific paths
      if (path === testDataDir || path.includes('test-table-1')) {
        callback(null);
      } else {
        callback(new Error('ENOENT'));
      }
    });

    // Mock path.join to return predictable paths
    (path.join as unknown as jest.Mock).mockImplementation((...args) => args.join('/'));

    repository = new FileTableRepository(testDataDir);

    // Create a sample table for testing
    sampleTable = new RandomTable('test-table-1', 'Test Table', 'A table for testing', [
      new TableEntry('entry-1', 'First entry', 1),
      new TableEntry('entry-2', 'Second entry', 2, new Range(1, 3)),
      new TableEntry('entry-3', 'Third entry', 3),
    ]);
  });

  describe('initialize', () => {
    it('should check if data directory exists', async () => {
      await repository.initialize();
      expect(mockAccess).toHaveBeenCalledWith(testDataDir, expect.any(Function));
    });

    it("should create data directory if it doesn't exist", async () => {
      // Make access throw an error to simulate directory not existing
      (fs.access as unknown as jest.Mock).mockImplementationOnce((path, callback) => {
        callback(new Error('ENOENT'));
      });

      await repository.initialize();
      expect(mockMkdir).toHaveBeenCalledWith(
        testDataDir,
        { recursive: true },
        expect.any(Function),
      );
    });
  });

  describe('save', () => {
    it('should save a table to a file and return its ID', async () => {
      const id = await repository.save(sampleTable);

      expect(id).toBe(sampleTable.id);
      expect(mockWriteFile).toHaveBeenCalledWith(
        `${testDataDir}/table-${sampleTable.id}.json`,
        JSON.stringify(sampleTable.toObject(), null, 2),
        'utf8',
        expect.any(Function),
      );
    });
  });

  describe('getById', () => {
    it('should return null for non-existent table', async () => {
      // Mock readFile to throw an error for non-existent file
      (fs.readFile as unknown as jest.Mock).mockImplementationOnce((path, encoding, callback) => {
        callback(new Error('ENOENT'));
      });

      const result = await repository.getById('non-existent');
      expect(result).toBeNull();
    });

    it('should retrieve a saved table by ID', async () => {
      const result = await repository.getById(sampleTable.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(sampleTable.id);
      expect(mockReadFile).toHaveBeenCalledWith(
        `${testDataDir}/table-${sampleTable.id}.json`,
        'utf8',
        expect.any(Function),
      );
    });
  });

  describe('update', () => {
    it('should throw an error when updating a non-existent table', async () => {
      // Create a new table with a different ID
      const nonExistentTable = new RandomTable('non-existent-table', 'Non-existent Table');

      // Mock access to throw an error for non-existent file
      (fs.access as unknown as jest.Mock).mockImplementationOnce((path, callback) => {
        callback(new Error('ENOENT'));
      });

      await expect(repository.update(nonExistentTable)).rejects.toThrow(
        `Table with ID ${nonExistentTable.id} does not exist`,
      );
    });

    it('should update an existing table', async () => {
      await repository.update(sampleTable);

      expect(mockWriteFile).toHaveBeenCalledWith(
        `${testDataDir}/table-${sampleTable.id}.json`,
        JSON.stringify(sampleTable.toObject(), null, 2),
        'utf8',
        expect.any(Function),
      );
    });
  });

  describe('list', () => {
    beforeEach(() => {
      // Mock readFile to return different data for different files
      (fs.readFile as unknown as jest.Mock).mockImplementation((filePath, encoding, callback) => {
        if (filePath.includes('test-table-1')) {
          callback(null, JSON.stringify(sampleTable.toObject()));
        } else if (filePath.includes('test-table-2')) {
          const anotherTable = new RandomTable(
            'test-table-2',
            'Another Table',
            'Another table for testing',
            [new TableEntry('entry-1', 'Only entry', 1)],
          );
          callback(null, JSON.stringify(anotherTable.toObject()));
        } else {
          callback(new Error('File not found'));
        }
      });
    });

    it('should list all tables when no filter is provided', async () => {
      const tables = await repository.list();

      expect(tables.length).toBe(2);
      expect(tables.map(t => t.id).sort()).toEqual(['test-table-1', 'test-table-2'].sort());
      expect(mockReaddir).toHaveBeenCalledWith(testDataDir, expect.any(Function));
    });

    it('should filter tables by property', async () => {
      const tables = await repository.list({ name: 'Test Table' });

      expect(tables.length).toBe(1);
      expect(tables[0].id).toBe('test-table-1');
    });

    it('should handle errors when reading directory', async () => {
      // Mock readdir to throw an error
      (fs.readdir as unknown as jest.Mock).mockImplementationOnce((path, callback) => {
        callback(new Error('Failed to read directory'));
      });

      const tables = await repository.list();
      expect(tables.length).toBe(0);
    });

    it('should handle errors when reading individual files', async () => {
      // Mock readFile to throw an error for one file
      let callCount = 0;
      (fs.readFile as unknown as jest.Mock).mockImplementation((filePath, encoding, callback) => {
        callCount++;
        if (callCount === 1) {
          callback(new Error('Failed to read file'));
        } else {
          const anotherTable = new RandomTable(
            'test-table-2',
            'Another Table',
            'Another table for testing',
            [new TableEntry('entry-1', 'Only entry', 1)],
          );
          callback(null, JSON.stringify(anotherTable.toObject()));
        }
      });

      const tables = await repository.list();
      expect(tables.length).toBe(1);
      expect(tables[0].id).toBe('test-table-2');
    });
  });

  describe('delete', () => {
    it('should throw an error when deleting a non-existent table', async () => {
      // Mock access to throw an error for non-existent file
      (fs.access as unknown as jest.Mock).mockImplementationOnce((path, callback) => {
        callback(new Error('ENOENT'));
      });

      await expect(repository.delete('non-existent')).rejects.toThrow(
        'Table with ID non-existent does not exist',
      );
    });

    it('should delete an existing table', async () => {
      await repository.delete(sampleTable.id);

      expect(mockUnlink).toHaveBeenCalledWith(
        `${testDataDir}/table-${sampleTable.id}.json`,
        expect.any(Function),
      );
    });
  });
});
