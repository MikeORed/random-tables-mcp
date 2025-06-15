# Template System Guide

This guide provides instructions on how to use the template system to create complex tables that reference other tables and standalone templates.

## What are Templates?

Templates allow you to create tables that reference other tables or standalone templates that can be reused across multiple tables. This is useful for creating complex, nested random generation systems. For example, you might have a "Treasure" table that references an "Item" table and a "Currency" table, or a standalone "NPC Description" template that can be used in multiple contexts.

## Template Syntax

The template syntax uses double curly braces to indicate a reference to another table. The general format is:

```
{{reference-title::table-id::table-name::roll-number::separator}}
```

Where:

- `reference-title`: A title for the reference (optional)
- `table-id`: The ID of the table to roll on
- `table-name`: The name of the table (optional, for readability)
- `roll-number`: The number of times to roll on the table (default: 1)
- `separator`: The separator to use between multiple rolls (default: ", ")

## Examples

### Basic Template

```
{{::forest-encounters}}
```

This will roll once on the "forest-encounters" table and insert the result.

### Multiple Rolls

```
{{::forest-encounters::Forest Encounters::3}}
```

This will roll three times on the "forest-encounters" table and insert the results, separated by commas.

### Custom Separator

```
{{::forest-encounters::Forest Encounters::3::|}}
```

This will roll three times on the "forest-encounters" table and insert the results, separated by pipes.

### Reference Title

```
{{Encounter::forest-encounters}}
```

This will roll once on the "forest-encounters" table and insert the result. Note that the reference title "Encounter" is included for readability and identification purposes only; it is not added as a prefix to the result.

## Creating a Table with Templates

Here's an example of creating a table that uses templates:

```json
{
  "name": "Dungeon Room",
  "description": "A random dungeon room",
  "entries": [
    {
      "content": "Empty room with {{::furniture}}",
      "weight": 3
    },
    {
      "content": "Room with {{Monsters::monsters::Monsters::3}}",
      "weight": 2
    },
    {
      "content": "Treasure room with {{::treasure}}",
      "weight": 1
    }
  ]
}
```

In this example:

- The first entry will roll on the "furniture" table and insert the result
- The second entry will roll 3 times on the "monsters" table and insert the results (the title "Monsters" is for identification only)
- The third entry will roll on the "treasure" table and insert the result

## Nested Templates

Templates can be nested, allowing for complex, hierarchical random generation. For example, a "treasure" table might reference an "item" table, which in turn might reference a "material" table.

```json
{
  "name": "Treasure",
  "description": "Random treasure",
  "entries": [
    {
      "content": "{{::items::Items::3}} worth {{::currency}}",
      "weight": 1
    }
  ]
}
```

```json
{
  "name": "Items",
  "description": "Random items",
  "entries": [
    {
      "content": "{{::material}} sword",
      "weight": 1
    },
    {
      "content": "{{::material}} shield",
      "weight": 1
    }
  ]
}
```

```json
{
  "name": "Material",
  "description": "Random materials",
  "entries": [
    {
      "content": "Iron",
      "weight": 3
    },
    {
      "content": "Steel",
      "weight": 2
    },
    {
      "content": "Silver",
      "weight": 1
    }
  ]
}
```

## Standalone Templates

In addition to using templates within table entries, you can also create standalone templates that can be reused across multiple tables. These are particularly useful for complex text patterns that you want to use in different contexts.

```json
{
  "name": "NPC Description",
  "description": "Template for generating NPC descriptions",
  "template": "A {{::appearance}} {{::race}} {{::class}} who {{::personality}}"
}
```

When you reference this template from another table or directly evaluate it, the system will resolve all the nested references by rolling on the appropriate tables.

For example, if you have tables for "appearance", "race", "class", and "personality", the template might resolve to something like "A tall human wizard who speaks in riddles".

Standalone templates can be managed independently of tables, allowing for more modular and reusable content.

## Roll Count

The template system supports specifying how many times to roll on a referenced table using the `roll-number` parameter. For example:

```
{{::monsters::Monsters::3}}
```

This will roll 3 times on the "monsters" table.

The `roll-number` parameter must be a positive integer. If omitted, the default value is 1.

## Best Practices

### Avoid Circular References

Be careful not to create circular references, where table A references table B, which references table A. This can cause infinite loops.

### Use Descriptive Table IDs and Names

Use descriptive table IDs and names to make your templates more readable and maintainable.

### Test Your Templates

Test your templates thoroughly to ensure they produce the expected results. Complex nested templates can sometimes produce unexpected results.

### Use Weights Effectively

Use weights to control the probability of different entries being selected. This can help you create more realistic and balanced random generation.

### Combine Tables and Standalone Templates

For complex generation systems, consider using a combination of tables and standalone templates. Tables are great for selecting from a list of options, while standalone templates are ideal for creating reusable text patterns.

### Use Real UUIDs in Production

While the examples in this guide use simple identifiers like "forest-encounters" for readability, in a real implementation, table IDs are typically UUIDs. For example:

```
{{::b2cf46a1-1884-4492-8770-d1b7e796355d::Forest Encounters::1}}
```

The MCP Random Tables server automatically generates these UUIDs when you create tables and templates.
