# Template System Guide

This guide provides instructions on how to use the template system to create complex tables that reference other tables.

## What are Templates?

Templates allow you to create tables that reference other tables. This is useful for creating complex, nested random generation systems. For example, you might have a "Treasure" table that references an "Item" table and a "Currency" table.

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

This will roll once on the "forest-encounters" table and insert the result with the title "Encounter: " prefixed.

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
      "content": "Room with {{Monsters::monsters::Monsters::1d4}}",
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
- The second entry will roll 1d4 times on the "monsters" table and insert the results with the title "Monsters: "
- The third entry will roll on the "treasure" table and insert the result

## Nested Templates

Templates can be nested, allowing for complex, hierarchical random generation. For example, a "treasure" table might reference an "item" table, which in turn might reference a "material" table.

```json
{
  "name": "Treasure",
  "description": "Random treasure",
  "entries": [
    {
      "content": "{{::items::Items::1d3}} worth {{::currency}}",
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

## Dice Notation

The template system supports dice notation for the `roll-number` parameter. For example:

```
{{::monsters::Monsters::1d4}}
```

This will roll 1d4 (a random number between 1 and 4) times on the "monsters" table.

Supported dice notation:

- `NdM`: Roll an M-sided die N times and sum the results (e.g., `2d6` rolls two six-sided dice)
- `NdM+X`: Roll an M-sided die N times, sum the results, and add X (e.g., `2d6+3`)
- `NdM-X`: Roll an M-sided die N times, sum the results, and subtract X (e.g., `2d6-1`)

## Best Practices

### Avoid Circular References

Be careful not to create circular references, where table A references table B, which references table A. This can cause infinite loops.

### Use Descriptive Table IDs and Names

Use descriptive table IDs and names to make your templates more readable and maintainable.

### Test Your Templates

Test your templates thoroughly to ensure they produce the expected results. Complex nested templates can sometimes produce unexpected results.

### Use Weights Effectively

Use weights to control the probability of different entries being selected. This can help you create more realistic and balanced random generation.

## Next Steps

Now that you've learned how to use the template system, you can:

- Explore the [API reference](../api/README.md) for more details on the available tools and resources
- Check out the [examples](../examples/README.md) for more complex table examples
