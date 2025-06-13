# Extension Points Documentation

This document provides information on how to extend the MCP Random Tables server with new functionality.

## Overview

The MCP Random Tables server is designed to be extensible. There are several extension points that allow you to add new functionality without modifying the core code. This document describes these extension points and provides examples of how to use them.

## Secondary Adapters

Secondary adapters are the most common extension points. They implement the secondary ports defined in the core domain. By implementing a new secondary adapter, you can change how the system interacts with external resources.

### Implementing a New Table Repository

The `TableRepository` interface defines how tables are persisted. The system comes with two implementations:

- `InMemoryTableRepository`: Stores tables in memory (useful for testing)
- `FileTableRepository`: Stores tables as JSON files on the filesystem

You can implement a new table repository to store tables in a different way, such as in a database.

#### Example: Database Table Repository

```typescript
import { TableRepository } from '../../ports/secondary/table-repository.js';
import { RandomTable } from '../../domain/entities/random-table.js';
import { Database } from 'your-database-library';

export class DatabaseTableRepository implements TableRepository {
  private db: Database;

  constructor(connectionString: string) {
    this.db = new Database(connectionString);
  }

  async save(table: RandomTable): Promise<string> {
    await this.db.tables.upsert({
      id: table.id,
      name: table.name,
      description: table.description,
      entries: JSON.stringify(table.entries),
    });
    return table.id;
  }

  async getById(id: string): Promise<RandomTable | null> {
    const record = await this.db.tables.findOne({ id });
    if (!record) {
      return null;
    }

    return RandomTable.fromObject({
      id: record.id,
      name: record.name,
      description: record.description,
      entries: JSON.parse(record.entries),
    });
  }

  async update(table: RandomTable): Promise<void> {
    await this.db.tables.update({
      id: table.id,
      name: table.name,
      description: table.description,
      entries: JSON.stringify(table.entries),
    });
  }

  async list(filter?: Record<string, unknown>): Promise<RandomTable[]> {
    const query = filter ? { ...filter } : {};
    const records = await this.db.tables.find(query);
    return records.map(record =>
      RandomTable.fromObject({
        id: record.id,
        name: record.name,
        description: record.description,
        entries: JSON.parse(record.entries),
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.tables.delete({ id });
  }
}
```

### Implementing a New Roll Template Repository

The `RollTemplateRepository` interface defines how roll templates are persisted. The system comes with two implementations:

- `InMemoryRollTemplateRepository`: Stores templates in memory (useful for testing)
- `FileRollTemplateRepository`: Stores templates as JSON files on the filesystem

You can implement a new roll template repository to store templates in a different way, such as in a database.

#### Example: Database Roll Template Repository

```typescript
import { RollTemplateRepository } from '../../ports/secondary/roll-template-repository.js';
import { RollTemplateEntity } from '../../domain/entities/roll-template-entity.js';
import { Database } from 'your-database-library';

export class DatabaseRollTemplateRepository implements RollTemplateRepository {
  private db: Database;

  constructor(connectionString: string) {
    this.db = new Database(connectionString);
  }

  async save(template: RollTemplateEntity): Promise<string> {
    await this.db.templates.upsert({
      id: template.id,
      name: template.name,
      description: template.description,
      template: template.template.toString(),
    });
    return template.id;
  }

  async getById(id: string): Promise<RollTemplateEntity | null> {
    const record = await this.db.templates.findOne({ id });
    if (!record) {
      return null;
    }

    return RollTemplateEntity.fromObject({
      id: record.id,
      name: record.name,
      description: record.description,
      template: record.template,
    });
  }

  async update(template: RollTemplateEntity): Promise<void> {
    await this.db.templates.update({
      id: template.id,
      name: template.name,
      description: template.description,
      template: template.template.toString(),
    });
  }

  async list(filter?: Record<string, unknown>): Promise<RollTemplateEntity[]> {
    const query = filter ? { ...filter } : {};
    const records = await this.db.templates.find(query);
    return records.map(record =>
      RollTemplateEntity.fromObject({
        id: record.id,
        name: record.name,
        description: record.description,
        template: record.template,
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.templates.delete({ id });
  }
}
```

### Implementing a New Random Number Generator

The `RandomNumberGenerator` interface defines how random numbers are generated. The system comes with two implementations:

- `DefaultRandomNumberGenerator`: Uses `Math.random()` (default)
- `CryptoRandomNumberGenerator`: Uses Node's crypto module for better randomness

You can implement a new random number generator to use a different source of randomness.

#### Example: External API Random Number Generator

```typescript
import { RandomNumberGenerator } from '../../ports/secondary/RandomNumberGenerator';
import axios from 'axios';

export class ApiRandomNumberGenerator implements RandomNumberGenerator {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async generateInt(min: number, max: number): Promise<number> {
    const response = await axios.get(`${this.apiUrl}/random`, {
      params: { min, max },
    });
    return response.data.number;
  }
}
```

## Primary Adapters

Primary adapters are another extension point. They implement the primary ports defined in the core domain. By implementing a new primary adapter, you can expose the system's functionality in a different way.

### Implementing a New API Adapter

The system comes with an MCP server adapter, but you could implement a different API adapter, such as a REST API or GraphQL API.

#### Example: REST API Adapter

```typescript
import express from 'express';
import { TableService } from '../../ports/primary/TableService';
import { RollService } from '../../ports/primary/RollService';

export class RestApiAdapter {
  private app: express.Application;
  private tableService: TableService;
  private rollService: RollService;

  constructor(tableService: TableService, rollService: RollService, port: number) {
    this.app = express();
    this.tableService = tableService;
    this.rollService = rollService;

    this.app.use(express.json());
    this.setupRoutes();

    this.app.listen(port, () => {
      console.log(`REST API listening on port ${port}`);
    });
  }

  private setupRoutes(): void {
    // Table routes
    this.app.post('/tables', this.createTable.bind(this));
    this.app.get('/tables/:id', this.getTable.bind(this));
    this.app.put('/tables/:id', this.updateTable.bind(this));
    this.app.get('/tables', this.listTables.bind(this));

    // Roll routes
    this.app.post('/tables/:id/roll', this.rollOnTable.bind(this));
  }

  private async createTable(req: express.Request, res: express.Response): Promise<void> {
    try {
      const table = await this.tableService.createTable(req.body);
      res.status(201).json(table);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  private async getTable(req: express.Request, res: express.Response): Promise<void> {
    try {
      const table = await this.tableService.getTable(req.params.id);
      if (!table) {
        res.status(404).json({ error: 'Table not found' });
        return;
      }
      res.json(table);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  private async updateTable(req: express.Request, res: express.Response): Promise<void> {
    try {
      const table = await this.tableService.updateTable(req.params.id, req.body);
      if (!table) {
        res.status(404).json({ error: 'Table not found' });
        return;
      }
      res.json(table);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  private async listTables(req: express.Request, res: express.Response): Promise<void> {
    try {
      const tables = await this.tableService.listTables();
      res.json(tables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  private async rollOnTable(req: express.Request, res: express.Response): Promise<void> {
    try {
      const count = req.body.count || 1;
      const results = await this.rollService.rollOnTable(req.params.id, count);
      res.json(results);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

## Domain Extensions

You can also extend the domain layer by adding new entities, value objects, or enhancing existing ones.

### Adding a New Domain Entity

#### Example: RollHistory Entity

```typescript
import { RollResult } from './RollResult';

export class RollHistory {
  private _tableId: string;
  private _rolls: RollResult[];

  constructor(tableId: string, rolls: RollResult[] = []) {
    this._tableId = tableId;
    this._rolls = rolls;
  }

  get tableId(): string {
    return this._tableId;
  }

  get rolls(): RollResult[] {
    return [...this._rolls];
  }

  addRoll(roll: RollResult): void {
    this._rolls.push(roll);
  }

  getLastNRolls(n: number): RollResult[] {
    return this._rolls.slice(-n);
  }

  getMostCommonResult(): { entryId: string; count: number } | null {
    if (this._rolls.length === 0) {
      return null;
    }

    const counts = this._rolls.reduce(
      (acc, roll) => {
        acc[roll.entryId] = (acc[roll.entryId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    let maxEntryId = this._rolls[0].entryId;
    let maxCount = counts[maxEntryId];

    for (const [entryId, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxEntryId = entryId;
        maxCount = count;
      }
    }

    return { entryId: maxEntryId, count: maxCount };
  }
}
```

## Use Case Extensions

You can add new use cases to implement additional functionality.

### Adding a New Use Case

#### Example: GetRollHistoryUseCase

```typescript
import { RollHistory } from '../domain/entities/RollHistory';
import { TableRepository } from '../ports/secondary/TableRepository';

export class GetRollHistoryUseCase {
  private tableRepository: TableRepository;

  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository;
  }

  async execute(tableId: string): Promise<RollHistory | null> {
    const table = await this.tableRepository.getById(tableId);
    if (!table) {
      return null;
    }

    // This is a simplified example. In a real implementation,
    // you would need to store and retrieve roll history.
    return new RollHistory(tableId, []);
  }
}
```

## Configuration Extensions

The MCP Random Tables server can be configured in various ways. You can extend the configuration to support new features.

### Example: Custom Configuration

```typescript
import { TableRepository } from './ports/secondary/TableRepository';
import { RandomNumberGenerator } from './ports/secondary/RandomNumberGenerator';
import { FileTableRepository } from './adapters/secondary/persistence/FileTableRepository';
import { InMemoryTableRepository } from './adapters/secondary/persistence/InMemoryTableRepository';
import { DefaultRandomNumberGenerator } from './adapters/secondary/rng/DefaultRandomNumberGenerator';
import { CryptoRandomNumberGenerator } from './adapters/secondary/rng/CryptoRandomNumberGenerator';

export interface Config {
  port: number;
  storage: {
    type: 'file' | 'memory' | 'database';
    options: {
      path?: string;
      connectionString?: string;
    };
  };
  rng: {
    type: 'default' | 'crypto' | 'api';
    options: {
      apiUrl?: string;
    };
  };
}

export function createTableRepository(config: Config): TableRepository {
  switch (config.storage.type) {
    case 'file':
      return new FileTableRepository(config.storage.options.path || './tables');
    case 'memory':
      return new InMemoryTableRepository();
    case 'database':
      // You would need to implement this adapter
      throw new Error('Database storage not implemented');
    default:
      return new InMemoryTableRepository();
  }
}

export function createRandomNumberGenerator(config: Config): RandomNumberGenerator {
  switch (config.rng.type) {
    case 'default':
      return new DefaultRandomNumberGenerator();
    case 'crypto':
      return new CryptoRandomNumberGenerator();
    case 'api':
      // You would need to implement this adapter
      throw new Error('API RNG not implemented');
    default:
      return new DefaultRandomNumberGenerator();
  }
}
```

## Conclusion

The MCP Random Tables server provides several extension points that allow you to add new functionality without modifying the core code. By implementing new adapters, adding new domain entities, or creating new use cases, you can customize the system to meet your specific needs.
