import { RandomTable } from '../../../domain/entities/random-table';
import { TableRepository } from '../../../ports/secondary/table-repository';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// Promisify fs functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const access = promisify(fs.access);

/**
 * File-based implementation of the TableRepository interface.
 * Stores tables as JSON files in a specified directory.
 */
export class FileTableRepository implements TableRepository {
  private dataDir: string;

  /**
   * Creates a new FileTableRepository instance.
   * @param dataDir The directory where table files will be stored.
   */
  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  /**
   * Initializes the repository by ensuring the data directory exists.
   */
  async initialize(): Promise<void> {
    try {
      await access(this.dataDir);
    } catch {
      // Directory doesn't exist, create it
      await mkdir(this.dataDir, { recursive: true });
    }
  }

  /**
   * Gets the file path for a table ID.
   * @param id The table ID.
   * @returns The file path.
   */
  private getFilePath(id: string): string {
    return path.join(this.dataDir, `${id}.json`);
  }

  /**
   * Saves a table to the repository.
   * @param table The table to save.
   * @returns The ID of the saved table.
   */
  async save(table: RandomTable): Promise<string> {
    await this.initialize();
    const filePath = this.getFilePath(table.id);
    await writeFile(filePath, JSON.stringify(table.toObject(), null, 2), 'utf8');
    return table.id;
  }

  /**
   * Gets a table by its ID.
   * @param id The ID of the table to get.
   * @returns The table, or null if not found.
   */
  async getById(id: string): Promise<RandomTable | null> {
    await this.initialize();
    const filePath = this.getFilePath(id);

    try {
      const data = await readFile(filePath, 'utf8');
      const tableData = JSON.parse(data);
      return RandomTable.fromObject(tableData);
    } catch {
      // File doesn't exist or can't be read
      return null;
    }
  }

  /**
   * Updates an existing table.
   * @param table The updated table.
   * @throws Error if the table does not exist.
   */
  async update(table: RandomTable): Promise<void> {
    await this.initialize();
    const filePath = this.getFilePath(table.id);

    try {
      await access(filePath);
      await writeFile(filePath, JSON.stringify(table.toObject(), null, 2), 'utf8');
    } catch {
      throw new Error(`Table with ID ${table.id} does not exist`);
    }
  }

  /**
   * Lists tables based on optional filter criteria.
   * @param filter Optional filter criteria.
   * @returns An array of tables matching the filter.
   */
  async list(filter?: Record<string, unknown>): Promise<RandomTable[]> {
    await this.initialize();

    try {
      const files = await readdir(this.dataDir);
      const tableFiles = files.filter(file => file.endsWith('.json'));

      const tables: RandomTable[] = [];

      for (const file of tableFiles) {
        try {
          const data = await readFile(path.join(this.dataDir, file), 'utf8');
          const tableData = JSON.parse(data);
          const table = RandomTable.fromObject(tableData);
          tables.push(table);
        } catch (err) {
          // Skip files that can't be read or parsed
          console.error(`Error reading table file ${file}:`, err);
        }
      }

      if (filter) {
        return tables.filter(table => {
          // Check if all filter criteria match
          return Object.entries(filter).every(([key, value]) => {
            // Handle nested properties with dot notation (e.g., "entries.length")
            const keys = key.split('.');

            // Navigate to the nested property
            let currentObj: unknown = table;
            for (let i = 0; i < keys.length - 1; i++) {
              currentObj = (currentObj as Record<string, unknown>)[keys[i]];
              if (currentObj === undefined) return false;
            }

            const prop = keys[keys.length - 1];

            // Special case for array length
            if (prop === 'length' && Array.isArray(currentObj)) {
              return currentObj.length === value;
            }

            // Regular property comparison
            return (currentObj as Record<string, unknown>)[prop] === value;
          });
        });
      }

      return tables;
    } catch (err) {
      // Error reading directory
      console.error('Error listing tables:', err);
      return [];
    }
  }

  /**
   * Deletes a table by its ID.
   * @param id The ID of the table to delete.
   * @throws Error if the table does not exist.
   */
  async delete(id: string): Promise<void> {
    await this.initialize();
    const filePath = this.getFilePath(id);

    try {
      await access(filePath);
      await unlink(filePath);
    } catch {
      throw new Error(`Table with ID ${id} does not exist`);
    }
  }
}
