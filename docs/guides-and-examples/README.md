# Examples

This section provides example tables and usage scenarios for the MCP Random Tables server.

## Example Tables

### Basic Tables

- [Simple Encounter Table](./simple-encounter.md) - A simple table for random encounters
- [Weighted Loot Table](./weighted-loot.md) - A table with weighted entries for random loot
- [Range-based Weather Table](./range-weather.md) - A table with range-based entries for random weather

### Template Tables

- [Nested Treasure Table](./nested-treasure.md) - A table that references other tables for generating treasure
- [Complex NPC Generator](./complex-npc.md) - A set of tables for generating complex NPCs
- [Adventure Hook Generator](./adventure-hook.md) - A set of tables for generating adventure hooks

## Usage Scenarios

### RPG Encounter Generation

The [RPG Encounter Generation](./rpg-encounter.md) scenario demonstrates how to use the MCP Random Tables server to generate random encounters for a tabletop RPG.

### Loot Generation

The [Loot Generation](./loot-generation.md) scenario demonstrates how to use the MCP Random Tables server to generate random loot for a tabletop RPG.

### NPC Generation

The [NPC Generation](./npc-generation.md) scenario demonstrates how to use the MCP Random Tables server to generate random NPCs for a tabletop RPG.

### Story Prompt Generation

The [Story Prompt Generation](./story-prompt.md) scenario demonstrates how to use the MCP Random Tables server to generate random story prompts for creative writing.

## Template Examples

Below are some template examples that you can use as a starting point for your own tables. These templates use placeholders that you can replace with your own content.

### Simple Table Template

```json
{
  "name": "{{TABLE_NAME}}",
  "description": "{{TABLE_DESCRIPTION}}",
  "entries": [
    {
      "content": "{{ENTRY_1}}",
      "weight": 1
    },
    {
      "content": "{{ENTRY_2}}",
      "weight": 1
    },
    {
      "content": "{{ENTRY_3}}",
      "weight": 1
    }
  ]
}
```

### Weighted Table Template

```json
{
  "name": "{{TABLE_NAME}}",
  "description": "{{TABLE_DESCRIPTION}}",
  "entries": [
    {
      "content": "{{COMMON_ENTRY}}",
      "weight": 3
    },
    {
      "content": "{{UNCOMMON_ENTRY}}",
      "weight": 2
    },
    {
      "content": "{{RARE_ENTRY}}",
      "weight": 1
    }
  ]
}
```

### Range-based Table Template

```json
{
  "name": "{{TABLE_NAME}}",
  "description": "{{TABLE_DESCRIPTION}}",
  "entries": [
    {
      "content": "{{ENTRY_1}}",
      "range": {
        "min": 1,
        "max": 3
      }
    },
    {
      "content": "{{ENTRY_2}}",
      "range": {
        "min": 4,
        "max": 5
      }
    },
    {
      "content": "{{ENTRY_3}}",
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
  "name": "{{TABLE_NAME}}",
  "description": "{{TABLE_DESCRIPTION}}",
  "entries": [
    {
      "content": "{{ENTRY_PREFIX}} {{::REFERENCED_TABLE_1}}",
      "weight": 1
    },
    {
      "content": "{{ENTRY_PREFIX}} {{::REFERENCED_TABLE_2}}",
      "weight": 1
    },
    {
      "content": "{{ENTRY_PREFIX}} {{::REFERENCED_TABLE_3}}",
      "weight": 1
    }
  ]
}
```

## Contributing Examples

If you have created interesting tables or usage scenarios, please consider contributing them to the project. See the [Contributing Guide](../../CONTRIBUTING.md) for more information.
