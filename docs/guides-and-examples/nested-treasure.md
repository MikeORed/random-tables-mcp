# Nested Treasure Table Example

This example demonstrates how to create and use nested tables with the MCP Random Tables server. We'll show a real user flow of creating a comprehensive treasure generation system with multiple interconnected tables.

## Setting Up the MCP Server

To use these examples, you'll need to have the MCP Random Tables server configured with your LLM client (such as Claude Desktop).

### Recommended: NPX Configuration

The recommended way to run the MCP Random Tables server is using npx, which automatically downloads and runs the latest version without requiring manual installation:

```json
{
  "mcpServers": {
    "random-tables": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "random-tables-mcp"],
      "env": {
        "DATA_DIR": "/path/to/your/data/directory"
      }
    }
  }
}
```

Replace `/path/to/your/data/directory` with your preferred data storage location. This is where your tables and templates will be saved.

## Creating a Nested Treasure System

Once you have the MCP Random Tables server configured, you can use your LLM client to create a nested treasure system. Here's an example conversation with an LLM:

**User:**

```
We'll create a few tiered tables for nested treasure, as well as a roll template, for the tables we want:

a table of 5 'quantities' of gold: pile, bag, etc
a table of 10 gemstones of various qualities
3 tables where each one should contain 10 magical quirks,1 curse, and 1 'normal state' for: magical weapons, magical armor, and magical trinkets respectively. 'normal state' is considered unenchanted, and since these tables are weighted, can you weigh that 4 compared to the default of other entries, 1.
3 tables where each one contain 10 generic types of things in their category: weapons (sickle, sword, axe, ext), armor (clothing, plate armor, hide armor, etc), and trinkets (ring, amulet, bracer, etc)
a parent table which covers what someone finds in a specific area, it should contain 6 entries, all templates, 1 for the gold quantity so that it will resolve to '[unit of gold]', 1 for gemstones where it will resolve to '1 [gemstone]', and 1 for each of weapons, armor, trinket where each resolve to '[weapon/armor/trinket] that is [quirk]'
then finally a roll template which resolves to 'you find a [treasure]'
```

**LLM:**

```
I'll create all these tables and the roll template for your tiered treasure system. Let me start with the foundational tables and work up to the parent table and template.

Perfect! I've created all the requested tables and roll template for your nested treasure system:

Tables Created:

Gold Quantities - 5 different quantities (pile, bag, pouch, chest, handful)
Gemstones - 10 gemstones of various qualities
Magical Weapon Quirks - 10 quirks + 1 curse + 1 "unenchanted" (weighted 4x)
Magical Armor Quirks - 10 quirks + 1 curse + 1 "unenchanted" (weighted 4x)
Magical Trinket Quirks - 10 quirks + 1 curse + 1 "unenchanted" (weighted 4x)
Generic Weapons - 10 weapon types (sword, axe, dagger, etc.)
Generic Armor - 10 armor types (plate armor, chain mail, robes, etc.)
Generic Trinkets - 10 trinket types (ring, amulet, bracer, etc.)
Treasure Types - Parent table with 6 entries that reference the other tables
Roll Template Created:

Treasure Discovery - Resolves to "You find a [treasure]"
The system is fully nested - when you use the template, it will randomly select a treasure type, then resolve all the nested references to generate complete results like:

"You find a pile of gold coins"
"You find a sword that is glowing with inner fire"
"You find a polished ruby"
The "unenchanted" entries are weighted 4 times higher than the other magical quirks, making mundane items more common than magical ones.
```

## Example Tables and Templates

Behind the scenes, the LLM is using the MCP Random Tables server to create these tables and templates. Let's look at some examples of what was created:

### Roll Template

```json
{
  "id": "56346844-2fce-474b-9a09-fc6d49cf33cc",
  "name": "Treasure Discovery",
  "description": "Template for discovering treasure",
  "template": "You find a {{Treasure::12377f03-b757-44ac-a048-4ef8fd6a9ac8::Treasure Types::1:: }}"
}
```

This template references the "Treasure Types" table and will roll on it once to generate a treasure result.

### Main Table: Treasure Types

```json
{
  "id": "12377f03-b757-44ac-a048-4ef8fd6a9ac8",
  "name": "Treasure Types",
  "description": "Parent table for different types of treasure found in an area",
  "entries": [
    {
      "id": "ce39cef3-e52c-4785-9fb6-dbfb2044ecbd",
      "content": "{{Gold::af282a58-03db-45eb-bcd6-6f9f7079150b::Gold Quantities::1:: }}",
      "weight": 1
    },
    {
      "id": "9d607643-8175-4059-9306-22c32315c59a",
      "content": "{{Gemstone::b99e39fa-2d95-4e78-868b-378b0b303aef::Gemstones::1:: }}",
      "weight": 1
    },
    {
      "id": "bc20c65e-9d8b-4ed7-bb5d-0b23d5181ecc",
      "content": "{{Weapon::95929a51-c136-42e6-b025-c0342a0ea49d::Generic Weapons::1:: }} that is {{Quirk::e5f240f4-21ad-41f6-b273-8dc0d94600c0::Magical Weapon Quirks::1:: }}",
      "weight": 1
    },
    {
      "id": "2333fd7e-4ccd-409c-a0a2-c91524fb4a65",
      "content": "{{Armor::fac37667-4457-489a-9f88-6eab0d13ca94::Generic Armor::1:: }} that is {{Quirk::7400fe71-5632-4807-aca0-0cbf66b59882::Magical Armor Quirks::1:: }}",
      "weight": 1
    },
    {
      "id": "4f259682-f80c-491d-b41a-de32d2936df1",
      "content": "{{Trinket::4a23e6ca-fea1-450b-b676-ab2bf3fafd12::Generic Trinkets::1:: }} that is {{Quirk::cd8933e9-f065-4469-8587-b58d2de707f0::Magical Trinket Quirks::1:: }}",
      "weight": 1
    },
    {
      "id": "7bdea4eb-eb95-4530-b35a-20df9f626f97",
      "content": "{{Gemstone::b99e39fa-2d95-4e78-868b-378b0b303aef::Gemstones::1:: }}",
      "weight": 1
    }
  ]
}
```

This table has 6 entries, each referencing other tables. For example, the third entry will roll on both the "Generic Weapons" table and the "Magical Weapon Quirks" table to generate a result like "sword that is glowing with inner fire".

### Subtable Example: Gemstones

```json
{
  "id": "b99e39fa-2d95-4e78-868b-378b0b303aef",
  "name": "Gemstones",
  "description": "Various gemstones of different qualities",
  "entries": [
    {
      "id": "761dd7ca-ff92-49db-ba8a-2c8fad63465c",
      "content": "rough diamond",
      "weight": 1
    },
    {
      "id": "33e3e38c-0f8a-471f-ab61-ab670ee30fa2",
      "content": "polished ruby",
      "weight": 1
    },
    {
      "id": "842438ff-0b96-459c-987f-07b435d921c2",
      "content": "flawless emerald",
      "weight": 1
    },
    {
      "id": "c2d06c0f-ce0e-49d6-aa51-92bc905727c4",
      "content": "cracked sapphire",
      "weight": 1
    },
    {
      "id": "cd4061d2-bb61-4864-b3ba-965dfb71a704",
      "content": "lustrous pearl",
      "weight": 1
    },
    {
      "id": "84b7783c-2645-448f-b179-64b96e295999",
      "content": "chipped topaz",
      "weight": 1
    },
    {
      "id": "3ac8259b-06ed-44b7-9d7c-56dd0e39b419",
      "content": "pristine amethyst",
      "weight": 1
    },
    {
      "id": "a8a677d9-d702-46dc-b9c1-a7bdd5718a84",
      "content": "cloudy quartz",
      "weight": 1
    },
    {
      "id": "78addb55-39f7-4451-9e95-b0580e41b23e",
      "content": "brilliant opal",
      "weight": 1
    },
    {
      "id": "63d4a891-f4d3-4133-a0c1-554ff60d086b",
      "content": "dull garnet",
      "weight": 1
    }
  ]
}
```

This is one of the subtables referenced by the main "Treasure Types" table. It contains 10 different gemstones that can be randomly selected.

## Using the Nested Treasure System

Once all the tables and templates are created, you can use them to generate treasure. Here's an example conversation:

**User:**

```
Awesome, please use our roll template 5 times, show me the results as a list and then construct a solid 'standard ttrpg' reading of the collection, as if it was found in a recently opened chest.
```

**LLM:**

```
Roll Results:

You find a cracked sapphire
You find a pouch of gold coins
You find a bag of gold coins
You find a anklet that is unenchanted
You find a necklace that is enhancing the wearer's charisma

Standard TTRPG Reading:

As the ancient lock finally gives way with a satisfying click, the heavy chest creaks open to reveal its long-hidden contents. Dust motes dance in the torchlight as you peer inside, discovering a modest but intriguing collection of treasures.

At the bottom of the chest, two leather containers catch your eye—a small coin pouch and a larger bag, both heavy with the unmistakable weight of gold pieces. The metallic glint suggests a respectable sum, perhaps enough to fund your next adventure or upgrade your equipment.

Nestled among some old cloth wrappings, you discover a cracked sapphire. Though flawed, the deep blue gem still holds considerable value, and the crack creates an interesting star-like pattern when light passes through it.

Two pieces of jewelry complete the hoard: a simple silver anklet that appears to be purely decorative—well-crafted but bearing no magical properties—and a more elaborate gold necklace that practically hums with enchantment. The necklace radiates a subtle magical aura that makes you feel more confident and eloquent just by handling it, clearly designed to enhance the wearer's natural charisma and force of personality.

All told, it's a balanced find—immediate wealth in gold, a valuable gem for trade, and two accessories that offer both practical and magical utility.
```

## How It Works

Behind the scenes, when the LLM uses the roll template, the MCP Random Tables server:

1. Evaluates the "Treasure Discovery" template
2. Rolls on the "Treasure Types" table
3. Based on the result from the "Treasure Types" table, rolls on the appropriate subtables
4. Combines all the results to generate a complete treasure description

The nested structure allows for a wide variety of possible results, making each treasure find unique and interesting. The weighting of entries (like making "unenchanted" items more common) adds realism to the generated treasures.

## Conclusion

This example demonstrates the power of nested tables and templates in the MCP Random Tables server. By creating a hierarchy of interconnected tables, you can generate complex, varied, and interesting content for your tabletop RPG sessions.

The MCP Random Tables server, configured with the recommended npx approach, makes it easy to create, manage, and use these tables through your LLM client.
