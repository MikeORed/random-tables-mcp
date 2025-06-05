# Implementation Notes

This document provides details on key design decisions and implementation details for the MCP Random Tables server.

## Design Decisions

### Hexagonal Architecture

The MCP Random Tables server follows a hexagonal architecture (ports & adapters) to separate the core business logic from external concerns. This architecture was chosen for several reasons:

1. **Separation of Concerns**: The core business logic is isolated from external dependencies, making it easier to reason about and maintain.
2. **Testability**: The core business logic can be tested in isolation, without depending on external systems.
3. **Flexibility**: The system can be easily adapted to different external systems by implementing new adapters.

For more details on the hexagonal architecture, see the [Architecture Documentation](./architecture.md).

### Domain-Driven Design

The domain layer is designed following Domain-Driven Design (DDD) principles. The domain entities and value objects are designed to encapsulate the core business logic and rules.

#### Entities vs. Value Objects

- **Entities** (like `RandomTable` and `TableEntry`) have identity and are mutable.
- **Value Objects** (like `Range` and `RollTemplate`) are immutable and have no identity.

### Template System

The template system allows for creating complex, nested random generation systems. The template syntax uses double curly braces to indicate a reference to another table:

```
{{reference-title::table-id::table-name::roll-number::separator}}
```

This syntax was chosen for its readability and flexibility. The template system is implemented using the `RollTemplate` and `TemplateReference` value objects.

### Repository Pattern

The `TableRepository` interface follows the Repository pattern, providing a clean separation between the domain layer and the persistence layer. This allows for different persistence mechanisms to be used without affecting the core business logic.

## Implementation Details

### Random Number Generation

The system provides two implementations of the `RandomNumberGenerator` interface:

1. **DefaultRandomNumberGenerator**: Uses `Math.random()` for simplicity and performance.
2. **CryptoRandomNumberGenerator**: Uses Node's crypto module for better randomness, which is important for applications where the randomness quality matters.

### Table Persistence

The system provides two implementations of the `TableRepository` interface:

1. **InMemoryTableRepository**: Stores tables in memory, which is useful for testing and development.
2. **FileTableRepository**: Stores tables as JSON files on the filesystem, which is simple and doesn't require a database.

### MCP Server Implementation

The MCP server is implemented using the MCP SDK. It provides tools and resources for interacting with the random tables system:

#### Tools:

1. **create_table**: Creates a new random table with optional initial entries.
2. **roll_on_table**: Rolls on a specific table and returns the result.
3. **update_table**: Updates an existing table (name, description, entries).
4. **list_tables**: Lists available tables with metadata.

#### Resources:

1. **table://{tableId}**: Provides access to a specific table.
2. **tables://**: Provides access to a list of all tables.

### Input Validation

Input validation is performed using Zod schemas. This ensures that the input data is valid before it reaches the domain layer.

## Additional Implementation Details

### Value Objects

The implementation includes the following value objects:

1. **Range**: Represents a range of values.
2. **RollTemplate**: Represents a template string that references another table.
3. **TemplateReference**: Represents a parsed template reference.

These value objects enhance the functionality and provide better separation of concerns.

### RollResult Entity

The `RollResult` entity includes the following properties:

1. **tableId**: ID of the table rolled on.
2. **entryId**: ID of the resulting entry.
3. **content**: Content of the resulting entry.
4. **timestamp**: When the roll occurred.
5. **isTemplate**: Indicates whether the result contains a template.
6. **resolvedContent**: Contains the resolved content if the result contains a template.

The isTemplate and resolvedContent properties support the template functionality.

### Repository Implementation

The implementation includes two repository implementations:

1. **FileTableRepository**: Stores tables as JSON files on the filesystem.
2. **InMemoryTableRepository**: Stores tables in memory, which is useful for testing and development.

### Random Number Generation

The implementation includes two random number generator implementations:

1. **DefaultRandomNumberGenerator**: Uses `Math.random()` for simplicity and performance.
2. **CryptoRandomNumberGenerator**: Uses Node's crypto module for better randomness, which is important for applications where the randomness quality matters.

## Future Enhancements

### Template Resolution

The current implementation of template resolution is basic. Future enhancements could include:

1. **Circular Reference Detection**: Detect and handle circular references to prevent infinite loops.
2. **Caching**: Cache resolved templates to improve performance.
3. **Error Handling**: Improve error handling for template resolution failures.

### Conditional Results

Future enhancements could include support for conditional results, where the result depends on certain conditions.

## Testing Strategy

### Unit Tests

Unit tests focus on testing individual components in isolation. For domain entities and value objects, the tests verify that they behave as expected. For use cases, the tests use mocked dependencies to isolate the use case logic.

### Integration Tests

Integration tests focus on testing the interaction between components. For example, testing the `FileTableRepository` with the actual filesystem, or testing the MCP server with mocked use cases.

### End-to-End Tests

End-to-end tests focus on testing the entire system from the MCP client to the filesystem and back. These tests verify that the system works as expected in a real-world scenario.

## Conclusion

The MCP Random Tables server is designed to be flexible, maintainable, and testable. The hexagonal architecture and domain-driven design principles provide a solid foundation for the system, while the template system and other features provide powerful functionality for random table generation.
