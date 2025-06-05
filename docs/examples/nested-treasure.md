# Nested Treasure Table Example

This example demonstrates how to create nested tables using the template system. We'll create a treasure table that references other tables for generating items, materials, and currency.

## Table Definitions

### Main Treasure Table

```json
{
  "name": "Treasure",
  "description": "Random treasure found in dungeons",
  "entries": [
    {
      "content": "{{::currency}}",
      "weight": 3
    },
    {
      "content": "{{::items::Items::1d3}} worth {{::currency}}",
      "weight": 2
    },
    {
      "content": "A magical {{::items}}",
      "weight": 1
    },
    {
      "content": "A chest containing {{::items::Items::1d4}} and {{::currency}}",
      "weight": 1
    },
    {
      "content": "Nothing of value",
      "weight": 1
    }
  ]
}
```

### Items Table

```json
{
  "name": "Items",
  "description": "Random items found as treasure",
  "entries": [
    {
      "content": "{{::material}} sword",
      "weight": 2
    },
    {
      "content": "{{::material}} shield",
      "weight": 2
    },
    {
      "content": "{{::material}} helmet",
      "weight": 1
    },
    {
      "content": "{{::material}} bracers",
      "weight": 1
    },
    {
      "content": "{{::material}} necklace with {{::gem}} gems",
      "weight": 1
    },
    {
      "content": "Potion of {{::potion-effect}}",
      "weight": 3
    },
    {
      "content": "Scroll of {{::spell}}",
      "weight": 2
    }
  ]
}
```

### Material Table

```json
{
  "name": "Material",
  "description": "Random materials for items",
  "entries": [
    {
      "content": "Iron",
      "weight": 3
    },
    {
      "content": "Steel",
      "weight": 3
    },
    {
      "content": "Bronze",
      "weight": 2
    },
    {
      "content": "Silver",
      "weight": 2
    },
    {
      "content": "Gold",
      "weight": 1
    },
    {
      "content": "Mithril",
      "weight": 1
    },
    {
      "content": "Adamantine",
      "weight": 1
    }
  ]
}
```

### Currency Table

```json
{
  "name": "Currency",
  "description": "Random currency amounts",
  "entries": [
    {
      "content": "2d6 copper pieces",
      "weight": 3
    },
    {
      "content": "2d6 silver pieces",
      "weight": 3
    },
    {
      "content": "1d6 gold pieces",
      "weight": 2
    },
    {
      "content": "1d4 platinum pieces",
      "weight": 1
    },
    {
      "content": "A rare coin worth 50 gold pieces",
      "weight": 1
    }
  ]
}
```

### Gem Table

```json
{
  "name": "Gem",
  "description": "Random gems",
  "entries": [
    {
      "content": "small ruby",
      "weight": 1
    },
    {
      "content": "small sapphire",
      "weight": 1
    },
    {
      "content": "small emerald",
      "weight": 1
    },
    {
      "content": "small diamond",
      "weight": 1
    },
    {
      "content": "small amethyst",
      "weight": 1
    }
  ]
}
```

### Potion Effect Table

```json
{
  "name": "Potion Effect",
  "description": "Random potion effects",
  "entries": [
    {
      "content": "Healing",
      "weight": 3
    },
    {
      "content": "Invisibility",
      "weight": 2
    },
    {
      "content": "Fire Resistance",
      "weight": 2
    },
    {
      "content": "Cold Resistance",
      "weight": 2
    },
    {
      "content": "Flying",
      "weight": 1
    },
    {
      "content": "Giant Strength",
      "weight": 1
    },
    {
      "content": "Water Breathing",
      "weight": 1
    }
  ]
}
```

### Spell Table

```json
{
  "name": "Spell",
  "description": "Random spells",
  "entries": [
    {
      "content": "Fireball",
      "weight": 2
    },
    {
      "content": "Lightning Bolt",
      "weight": 2
    },
    {
      "content": "Magic Missile",
      "weight": 2
    },
    {
      "content": "Invisibility",
      "weight": 1
    },
    {
      "content": "Fly",
      "weight": 1
    },
    {
      "content": "Teleport",
      "weight": 1
    },
    {
      "content": "Wish",
      "weight": 1
    }
  ]
}
```

## Creating the Tables

When using an LLM application with the MCP Random Tables server connected, you can create these tables by asking the LLM to create each table with the entries shown above. The LLM will use the appropriate MCP tools behind the scenes to create the tables.

You'll need to create all seven tables (Treasure, Items, Material, Currency, Gem, Potion Effect, and Spell) for the nested template system to work properly.

## Rolling on the Table

Once the tables are created, you can roll on the main Treasure table by asking the LLM to roll on the "Treasure" table. The LLM will use the appropriate MCP tools behind the scenes to roll on the table and present the results to you.

## Understanding the Results

When you roll on the Treasure table, the system will automatically resolve any templates by rolling on the referenced tables. For example, if the result is "{{::items::Items::1d3}} worth {{::currency}}", the system will:

1. Roll 1d3 times on the Items table (e.g., if the roll is 2, it will roll twice on the Items table)
2. Roll once on the Currency table
3. Combine the results (e.g., "Steel sword and Bronze shield worth 2d6 silver pieces")

If the Items table result contains a template like "{{::material}} sword", the system will roll on the Material table to resolve that template as well.

## Example Results

Here are some example results you might get from rolling on the Treasure table:

- "2d6 silver pieces"
- "Steel sword worth 1d6 gold pieces"
- "A magical Mithril necklace with small ruby gems"
- "A chest containing Potion of Healing, Scroll of Fireball, Iron shield, and 1d4 platinum pieces"
- "Nothing of value"

## Usage in a Game

This nested table system can be used by a Game Master during a tabletop RPG session when the players find treasure. The GM can roll on the Treasure table to determine what the players find, and the system will automatically generate a detailed description of the treasure.

For example:

1. The players defeat a group of goblins and search their lair for treasure.
2. The GM rolls on the Treasure table and gets "A chest containing {{::items::Items::1d4}} and {{::currency}}".
3. The system rolls 1d4 (e.g., 3) times on the Items table and once on the Currency table.
4. The Items table rolls might result in "Steel sword", "Potion of Healing", and "Scroll of Lightning Bolt".
5. The Currency table roll might result in "1d6 gold pieces".
6. The GM then describes the treasure to the players: "You find a chest containing a steel sword, a potion of healing, a scroll of lightning bolt, and 1d6 gold pieces."
7. The GM rolls 1d6 to determine the number of gold pieces (e.g., rolling a 4 for 4 gold pieces).

This system adds depth and variety to treasure generation, making each treasure find a unique and exciting experience for the players.
