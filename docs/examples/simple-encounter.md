# Simple Encounter Table Example

This example demonstrates a simple encounter table for a forest environment.

## Table Definition

```json
{
  "name": "Forest Encounters",
  "description": "Random encounters in the forest",
  "entries": [
    {
      "content": "Wolf pack (1d4+1 wolves)",
      "weight": 3
    },
    {
      "content": "Friendly traveler offering directions",
      "weight": 2
    },
    {
      "content": "Bandit ambush (2d4 bandits)",
      "weight": 2
    },
    {
      "content": "Lost child searching for their parents",
      "weight": 1
    },
    {
      "content": "Ancient ruins overgrown with vines",
      "weight": 1
    },
    {
      "content": "Deer grazing peacefully",
      "weight": 3
    },
    {
      "content": "Poisonous snake hidden in the underbrush",
      "weight": 2
    },
    {
      "content": "Fey creature playing tricks",
      "weight": 1
    },
    {
      "content": "Hunter's camp, recently abandoned",
      "weight": 2
    },
    {
      "content": "Rare medicinal herbs growing in a clearing",
      "weight": 1
    }
  ]
}
```

## Creating the Table

When using an LLM application with the MCP Random Tables server connected, you can create this table by asking the LLM to create a "Forest Encounters" table with the entries shown above. The LLM will use the appropriate MCP tools behind the scenes to create the table.

## Rolling on the Table

Once the table is created, you can roll on it by asking the LLM to roll on the "Forest Encounters" table. The LLM will use the appropriate MCP tools behind the scenes to roll on the table and present the results to you.

## Understanding the Results

The result will be a `RollResult` object containing:

- `tableId`: The ID of the table rolled on (e.g., "forest-encounters")
- `entryId`: The ID of the resulting entry
- `content`: The content of the resulting entry (e.g., "Wolf pack (1d4+1 wolves)")
- `timestamp`: When the roll occurred

## Weighted Probabilities

This table uses weighted entries to make some encounters more common than others:

- Common encounters (weight 3):

  - Wolf pack (1d4+1 wolves)
  - Deer grazing peacefully

- Moderately common encounters (weight 2):

  - Friendly traveler offering directions
  - Bandit ambush (2d4 bandits)
  - Poisonous snake hidden in the underbrush
  - Hunter's camp, recently abandoned

- Rare encounters (weight 1):
  - Lost child searching for their parents
  - Ancient ruins overgrown with vines
  - Fey creature playing tricks
  - Rare medicinal herbs growing in a clearing

The probability of each entry being rolled is proportional to its weight. For example, "Wolf pack" has a weight of 3 out of a total weight of 18, giving it a 3/18 (or 1/6) probability of being rolled.

## Usage in a Game

This table can be used by a Game Master during a tabletop RPG session when the players are traveling through a forest. When the GM decides it's time for a random encounter, they can roll on this table to determine what the players encounter.

For example:

1. The GM decides it's time for a random encounter as the players travel through the forest.
2. The GM rolls on the "Forest Encounters" table and gets "Bandit ambush (2d4 bandits)".
3. The GM then rolls 2d4 to determine the number of bandits (e.g., rolling a 3 and a 4 for a total of 7 bandits).
4. The GM describes the encounter to the players: "As you're making your way through the forest, you hear rustling in the bushes around you. Suddenly, 7 rough-looking bandits emerge from the foliage, weapons drawn, demanding your valuables!"
5. The players then decide how to respond to this encounter.

This adds unpredictability and variety to the game, making each journey through the forest a unique experience.
