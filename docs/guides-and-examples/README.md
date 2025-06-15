# Examples

This section provides example tables and usage scenarios for the MCP Random Tables server.

## Example Tables

### Basic Tables

- [Simple Encounter Table](./simple-encounter.md) - A simple table for random encounters

### Template Tables

- [Nested Treasure Table](./nested-treasure.md) - A table that references other tables for generating treasure
- [Template System Guide](./templates.md) - A guide to using the template system

## Usage Scenarios

The example tables above demonstrate different ways to use the MCP Random Tables server. Each example includes detailed explanations and sample code.

## Template Examples

Below are some template examples that you can use as a starting point for your own tables. These templates use placeholders that you can replace with your own content.

### Simple Table Template

```json
{
  "id": "{{TABLE_ID}}",
  "name": "{{TABLE_NAME}}",
  "description": "{{TABLE_DESCRIPTION}}",
  "entries": [
    {
      "id": "{{ENTRY_1_ID}}",
      "content": "{{ENTRY_1_CONTENT}}",
      "weight": 1
    },
    {
      "id": "{{ENTRY_2_ID}}",
      "content": "{{ENTRY_2_CONTENT}}",
      "weight": 1
    },
    {
      "id": "{{ENTRY_3_ID}}",
      "content": "{{ENTRY_3_CONTENT}}",
      "weight": 1
    }
  ]
}
```

### Weighted Table Template

```json
{
  "id": "{{TABLE_ID}}",
  "name": "{{TABLE_NAME}}",
  "description": "{{TABLE_DESCRIPTION}}",
  "entries": [
    {
      "id": "{{COMMON_ENTRY_ID}}",
      "content": "{{COMMON_ENTRY_CONTENT}}",
      "weight": 3
    },
    {
      "id": "{{UNCOMMON_ENTRY_ID}}",
      "content": "{{UNCOMMON_ENTRY_CONTENT}}",
      "weight": 2
    },
    {
      "id": "{{RARE_ENTRY_ID}}",
      "content": "{{RARE_ENTRY_CONTENT}}",
      "weight": 1
    }
  ]
}
```

### Range-based Table Template

```json
{
  "id": "{{TABLE_ID}}",
  "name": "{{TABLE_NAME}}",
  "description": "{{TABLE_DESCRIPTION}}",
  "entries": [
    {
      "id": "{{ENTRY_1_ID}}",
      "content": "{{ENTRY_1_CONTENT}}",
      "range": {
        "min": 1,
        "max": 3
      }
    },
    {
      "id": "{{ENTRY_2_ID}}",
      "content": "{{ENTRY_2_CONTENT}}",
      "range": {
        "min": 4,
        "max": 5
      }
    },
    {
      "id": "{{ENTRY_3_ID}}",
      "content": "{{ENTRY_3_CONTENT}}",
      "range": {
        "min": 6,
        "max": 6
      }
    }
  ]
}
```

### Template Table Template

```json
{
  "id": "{{TABLE_ID}}",
  "name": "{{TABLE_NAME}}",
  "description": "{{TABLE_DESCRIPTION}}",
  "entries": [
    {
      "id": "{{ENTRY_1_ID}}",
      "content": "{{ENTRY_PREFIX}} {{Reference1::table-uuid-1::Referenced Table 1::1:: }}",
      "weight": 1
    },
    {
      "id": "{{ENTRY_2_ID}}",
      "content": "{{ENTRY_PREFIX}} {{Reference2::table-uuid-2::Referenced Table 2::1:: }}",
      "weight": 1
    },
    {
      "id": "{{ENTRY_3_ID}}",
      "content": "{{ENTRY_PREFIX}} {{Reference3::table-uuid-3::Referenced Table 3::1:: }}",
      "weight": 1
    }
  ]
}
```

### Standalone Template

```json
{
  "id": "{{TEMPLATE_ID}}",
  "name": "{{TEMPLATE_NAME}}",
  "description": "{{TEMPLATE_DESCRIPTION}}",
  "template": "{{TEMPLATE_TEXT}} {{Reference::table-uuid::Table Name::1:: }}"
}
```

## Contributing Examples

If you have created interesting tables or usage scenarios, please consider contributing them to the project. See the [Contributing Guide](../../CONTRIBUTING.md) for more information.
