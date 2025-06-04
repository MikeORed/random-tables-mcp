# Architecture Documentation

This document provides an overview of the hexagonal architecture (ports & adapters) used in the MCP Random Tables server.

## Hexagonal Architecture Overview

The MCP Random Tables server follows a hexagonal architecture, also known as ports & adapters. This architecture separates the core business logic from external concerns, making the system more testable and maintainable.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │  ┌────────────────────────────────────┐            │    │
│  │  │                                    │            │    │
│  │  │           Domain Layer             │            │    │
│  │  │                                    │            │    │
│  │  └────────────────────────────────────┘            │    │
│  │                     │                              │    │
│  │                     ▼                              │    │
│  │  ┌────────────────────────────────────┐            │    │
│  │  │                                    │            │    │
│  │  │          Use Case Layer            │            │    │
│  │  │                                    │            │    │
│  │  └────────────────────────────────────┘            │    │
│  │                     │                              │    │
│  │                     ▼                              │    │
│  │  ┌────────────────────────────────────┐            │    │
│  │  │                                    │            │    │
│  │  │           Port Interfaces          │            │    │
│  │  │                                    │            │    │
│  │  └────────────────────────────────────┘            │    │
│  │                                                    │    │
│  │                  Core                              │    │
│  └────────────────────────────────────────────────────┘    │
│                       │                                    │
│                       ▼                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │  ┌─────────────────────┐      ┌─────────────────┐  │    │
│  │  │                     │      │                 │  │    │
│  │  │  Primary Adapters   │      │ Secondary       │  │    │
│  │  │  (MCP Server)       │      │ Adapters        │  │    │
│  │  │                     │      │                 │  │    │
│  │  └─────────────────────┘      └─────────────────┘  │    │
│  │                                                    │    │
│  │                  Adapters                          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Layers & Responsibilities

### 1. Domain Layer

The domain layer contains the core business entities and logic, with no dependencies on external systems.

#### Domain Entities:

1. **RandomTable**

   - Properties:
     - `id`: Unique identifier
     - `name`: Table name
     - `description`: Optional description
     - `entries`: Collection of TableEntry objects
   - Methods:
     - `roll()`: Perform a roll on the table and return a RollResult
     - `addEntry(entry)`: Add a new entry to the table
     - `removeEntry(entryId)`: Remove an entry from the table
     - `updateEntry(entryId, newEntry)`: Update an existing entry

2. **TableEntry**

   - Properties:
     - `id`: Unique identifier
     - `weight`: Probability weight (default: 1)
     - `content`: The content of this entry (text, reference to another table, etc.)
     - `range`: Optional range of values this entry corresponds to (e.g., "1-5" on a d20)

3. **RollResult**
   - Properties:
     - `tableId`: ID of the table rolled on
     - `entryId`: ID of the resulting entry
     - `content`: Content of the resulting entry
     - `timestamp`: When the roll occurred
     - `isTemplate`: Whether the result contains a template
     - `resolvedContent`: The resolved content if the result contains a template

#### Value Objects:

1. **Range**

   - Properties:
     - `min`: Minimum value
     - `max`: Maximum value
   - Methods:
     - `includes(value)`: Check if a value is within the range

2. **RollTemplate**

   - Properties:
     - `template`: The template string
   - Methods:
     - `parse()`: Parse the template string and extract the reference information

3. **TemplateReference**
   - Properties:
     - `referenceTitle`: Title for the reference
     - `tableId`: ID of the referenced table
     - `tableName`: Name of the referenced table
     - `rollNumber`: Number of times to roll on the referenced table
     - `separator`: Separator to use between multiple rolls

### 2. Use Case Layer

The use case layer orchestrates the domain entities to fulfill specific application use cases.

#### Use Cases:

1. **CreateTableUseCase**

   - Create a new random table with optional initial entries
   - Validate table data
   - Save to repository

2. **RollOnTableUseCase**

   - Find table by ID
   - Perform roll operation
   - Return roll result
   - Optionally log the roll

3. **UpdateTableUseCase**

   - Find table by ID
   - Apply updates (add/remove/update entries, change metadata)
   - Save updated table

4. **GetTableUseCase**

   - Find and return table by ID

5. **ListTablesUseCase**
   - Return list of available tables with metadata

### 3. Port Interfaces

#### Primary (Driving) Ports:

- `TableService`: Interface for table operations (create, get, update, list)
- `RollService`: Interface for performing rolls

#### Secondary (Driven) Ports:

- `TableRepository`: Interface for table persistence
- `RandomNumberGenerator`: Interface for generating random numbers

### 4. Adapters

#### Primary (Driving) Adapters:

- **MCP Server**: Implements the MCP protocol to expose table operations as tools and resources
  - **Tools**:
    - `CreateTableTool`: Tool for creating tables
    - `RollOnTableTool`: Tool for rolling on tables
    - `UpdateTableTool`: Tool for updating tables
    - `ListTablesTool`: Tool for listing tables
  - **Resources**:
    - `TableResource`: Resource for accessing a specific table
    - `TablesResource`: Resource for accessing a list of all tables

#### Secondary (Driven) Adapters:

- **FileTableRepository**: Implements TableRepository using the filesystem (JSON files)
- **InMemoryTableRepository**: Implements TableRepository using in-memory storage
- **CryptoRandomNumberGenerator**: Implements RandomNumberGenerator using Node's crypto module
- **DefaultRandomNumberGenerator**: Implements RandomNumberGenerator using Math.random()

## Flow of Control

The flow of control in a hexagonal architecture follows a specific pattern:

1. External input comes in through a primary adapter (e.g., MCP Server)
2. The primary adapter calls a primary port (e.g., TableService)
3. The primary port delegates to a use case (e.g., CreateTableUseCase)
4. The use case orchestrates domain entities and calls secondary ports (e.g., TableRepository)
5. The secondary ports delegate to secondary adapters (e.g., FileTableRepository)
6. The result flows back through the layers in reverse order

This flow ensures that the core business logic (domain and use case layers) remains isolated from external concerns.

## Benefits of Hexagonal Architecture

The hexagonal architecture provides several benefits:

1. **Separation of Concerns**: The core business logic is separated from external concerns, making the system more maintainable.
2. **Testability**: The core business logic can be tested in isolation, without depending on external systems.
3. **Flexibility**: The system can be easily adapted to different external systems by implementing new adapters.
4. **Maintainability**: Changes to external systems have minimal impact on the core business logic.

## Project Structure

The project structure reflects the hexagonal architecture:

```
/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── RandomTable.ts
│   │   │   ├── TableEntry.ts
│   │   │   └── RollResult.ts
│   │   └── valueObjects/
│   │       ├── Range.ts
│   │       ├── RollTemplate.ts
│   │       └── TemplateReference.ts
│   ├── useCases/
│   │   ├── CreateTableUseCase.ts
│   │   ├── RollOnTableUseCase.ts
│   │   ├── UpdateTableUseCase.ts
│   │   ├── GetTableUseCase.ts
│   │   └── ListTablesUseCase.ts
│   ├── ports/
│   │   ├── primary/
│   │   │   ├── TableService.ts
│   │   │   └── RollService.ts
│   │   └── secondary/
│   │       ├── TableRepository.ts
│   │       └── RandomNumberGenerator.ts
│   ├── adapters/
│   │   ├── primary/
│   │   │   └── mcp/
│   │   │       ├── McpServer.ts
│   │   │       ├── tools/
│   │   │       │   ├── CreateTableTool.ts
│   │   │       │   ├── RollOnTableTool.ts
│   │   │       │   ├── UpdateTableTool.ts
│   │   │       │   └── ListTablesTool.ts
│   │   │       └── resources/
│   │   │           ├── TableResource.ts
│   │   │           └── TablesResource.ts
│   │   └── secondary/
│   │       ├── persistence/
│   │       │   ├── FileTableRepository.ts
│   │       │   └── InMemoryTableRepository.ts
│   │       └── rng/
│   │           ├── CryptoRandomNumberGenerator.ts
│   │           └── DefaultRandomNumberGenerator.ts
│   └── index.ts
```

## Conclusion

The hexagonal architecture provides a solid foundation for the MCP Random Tables server, ensuring that the core business logic remains isolated from external concerns. This makes the system more testable, maintainable, and adaptable to change.
