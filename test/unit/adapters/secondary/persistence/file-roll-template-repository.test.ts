import { FileRollTemplateRepository } from '../../../../../src/adapters/secondary/persistence/file-roll-template-repository.js';
import { RollTemplateEntity } from '../../../../../src/domain/entities/roll-template-entity.js';
import { RollTemplate } from '../../../../../src/domain/value-objects/roll-template.js';
import * as fs from 'fs';
import * as path from 'path';

// Mock the fs module
jest.mock('fs');
jest.mock('path');

describe('FileRollTemplateRepository', () => {
  let repository: FileRollTemplateRepository;
  let sampleTemplate: RollTemplateEntity;
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
      callback(null, JSON.stringify(sampleTemplate.toObject()));
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
      callback(null, ['template-test-1.json', 'template-test-2.json']);
    });

    (fs.unlink as unknown as jest.Mock).mockImplementation((path, callback) => {
      mockUnlink(path, callback);
      callback(null);
    });

    (fs.access as unknown as jest.Mock).mockImplementation((path, callback) => {
      mockAccess(path, callback);
      // Simulate file exists for specific paths
      if (path === testDataDir || path.includes('template-test-1')) {
        callback(null);
      } else {
        callback(new Error('ENOENT'));
      }
    });

    // Mock path.join to return predictable paths
    (path.join as unknown as jest.Mock).mockImplementation((...args) => args.join('/'));

    repository = new FileRollTemplateRepository(testDataDir);

    // Create a sample template for testing
    sampleTemplate = new RollTemplateEntity(
      'test-1',
      'Test Template',
      'A template for testing',
      new RollTemplate('This is a {{test::table-id::table-name}} template'),
    );
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
    it('should save a template to a file and return its ID', async () => {
      const id = await repository.save(sampleTemplate);

      expect(id).toBe(sampleTemplate.id);
      expect(mockWriteFile).toHaveBeenCalledWith(
        `${testDataDir}/template-${sampleTemplate.id}.json`,
        JSON.stringify(sampleTemplate.toObject(), null, 2),
        'utf8',
        expect.any(Function),
      );
    });
  });

  describe('getById', () => {
    it('should return null for non-existent template', async () => {
      // Mock readFile to throw an error for non-existent file
      (fs.readFile as unknown as jest.Mock).mockImplementationOnce((path, encoding, callback) => {
        callback(new Error('ENOENT'));
      });

      const result = await repository.getById('non-existent');
      expect(result).toBeNull();
    });

    it('should retrieve a saved template by ID', async () => {
      const result = await repository.getById(sampleTemplate.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(sampleTemplate.id);
      expect(mockReadFile).toHaveBeenCalledWith(
        `${testDataDir}/template-${sampleTemplate.id}.json`,
        'utf8',
        expect.any(Function),
      );
    });
  });

  describe('update', () => {
    it('should throw an error when updating a non-existent template', async () => {
      // Create a new template with a different ID
      const nonExistentTemplate = new RollTemplateEntity(
        'non-existent-template',
        'Non-existent Template',
        'A template that does not exist',
        new RollTemplate('This template does not exist'),
      );

      // Mock access to throw an error for non-existent file
      (fs.access as unknown as jest.Mock).mockImplementationOnce((path, callback) => {
        callback(new Error('ENOENT'));
      });

      await expect(repository.update(nonExistentTemplate)).rejects.toThrow(
        `Template with ID ${nonExistentTemplate.id} does not exist`,
      );
    });

    it('should update an existing template', async () => {
      await repository.update(sampleTemplate);

      expect(mockWriteFile).toHaveBeenCalledWith(
        `${testDataDir}/template-${sampleTemplate.id}.json`,
        JSON.stringify(sampleTemplate.toObject(), null, 2),
        'utf8',
        expect.any(Function),
      );
    });
  });

  describe('list', () => {
    beforeEach(() => {
      // Mock readFile to return different data for different files
      (fs.readFile as unknown as jest.Mock).mockImplementation((filePath, encoding, callback) => {
        if (filePath.includes('template-test-1')) {
          callback(null, JSON.stringify(sampleTemplate.toObject()));
        } else if (filePath.includes('template-test-2')) {
          const anotherTemplate = new RollTemplateEntity(
            'test-2',
            'Another Template',
            'Another template for testing',
            new RollTemplate('This is another template'),
          );
          callback(null, JSON.stringify(anotherTemplate.toObject()));
        } else {
          callback(new Error('File not found'));
        }
      });
    });

    it('should list all templates when no filter is provided', async () => {
      const templates = await repository.list();

      expect(templates.length).toBe(2);
      expect(templates.map(t => t.id).sort()).toEqual(['test-1', 'test-2'].sort());
      expect(mockReaddir).toHaveBeenCalledWith(testDataDir, expect.any(Function));
    });

    it('should filter templates by property', async () => {
      const templates = await repository.list({ name: 'Test Template' });

      expect(templates.length).toBe(1);
      expect(templates[0].id).toBe('test-1');
    });

    it('should handle errors when reading directory', async () => {
      // Mock readdir to throw an error
      (fs.readdir as unknown as jest.Mock).mockImplementationOnce((path, callback) => {
        callback(new Error('Failed to read directory'));
      });

      const templates = await repository.list();
      expect(templates.length).toBe(0);
    });

    it('should handle errors when reading individual files', async () => {
      // Mock readFile to throw an error for one file
      let callCount = 0;
      (fs.readFile as unknown as jest.Mock).mockImplementation((filePath, encoding, callback) => {
        callCount++;
        if (callCount === 1) {
          callback(new Error('Failed to read file'));
        } else {
          const anotherTemplate = new RollTemplateEntity(
            'test-2',
            'Another Template',
            'Another template for testing',
            new RollTemplate('This is another template'),
          );
          callback(null, JSON.stringify(anotherTemplate.toObject()));
        }
      });

      const templates = await repository.list();
      expect(templates.length).toBe(1);
      expect(templates[0].id).toBe('test-2');
    });

    it('should filter out non-template files', async () => {
      // Mock readdir to return a mix of template and non-template files
      (fs.readdir as unknown as jest.Mock).mockImplementationOnce((path, callback) => {
        callback(null, ['template-test-1.json', 'not-a-template.json', 'table-something.json']);
      });

      const templates = await repository.list();
      expect(templates.length).toBe(1);
      expect(templates[0].id).toBe('test-1');
    });

    it('should support filtering by nested properties', async () => {
      const templates = await repository.list({
        'template.template': 'This is a {{test::table-id::table-name}} template',
      });

      expect(templates.length).toBe(1);
      expect(templates[0].id).toBe('test-1');
    });
  });

  describe('delete', () => {
    it('should throw an error when deleting a non-existent template', async () => {
      // Mock access to throw an error for non-existent file
      (fs.access as unknown as jest.Mock).mockImplementationOnce((path, callback) => {
        callback(new Error('ENOENT'));
      });

      await expect(repository.delete('non-existent')).rejects.toThrow(
        'Template with ID non-existent does not exist',
      );
    });

    it('should delete an existing template', async () => {
      await repository.delete(sampleTemplate.id);

      expect(mockUnlink).toHaveBeenCalledWith(
        `${testDataDir}/template-${sampleTemplate.id}.json`,
        expect.any(Function),
      );
    });
  });
});
