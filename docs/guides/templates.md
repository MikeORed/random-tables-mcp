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

## Next Steps

Now that you've learned how to use the template system, you can:

- Explore the [API reference](../api/README.md) for more details on the available tools and resources
- Check out the [examples](../examples/README.md) for more complex table examples
