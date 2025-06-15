# Simple Encounter Table Example

This example demonstrates how to create and use a simple encounter table with the MCP Random Tables server. We'll show a real user flow of creating a forest encounter table and using it to generate encounters at different times of day.

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

## Creating a Forest Encounter Table

Once you have the MCP Random Tables server configured, you can use your LLM client to create a forest encounter table. Here's an example conversation with an LLM:

**User:**

```
Create a table for low-mid level forest encounters, weight them from 1-4 based on how likely they should be, include natural hazards, interesting happenings, fey treachery, and just plain critters, among other, make the table 20 entries long.
```

**LLM:**

```
I'll create a comprehensive forest encounters table for low-mid level characters with varied weights based on likelihood. Let me build this with 20 diverse entries covering all the categories you mentioned.

I've created a 20-entry forest encounter table perfect for low-mid level adventures! The table includes a good mix of:

Common Encounters (Weight 4):

Wolf packs
Wasp swarms
Moderately Common (Weight 3):

Natural hazards like pit traps and poisonous berries
Wildlife like bears and wild boars
Bandits demanding tolls
Less Common (Weight 2):

Fey trickery from sprites and pixies
More dangerous creatures like owlbears and dire wolves
Environmental hazards and mysterious discoveries
Rare Encounters (Weight 1):

Unique magical situations like dryad encounters
Powerful fey magic locations
Dramatic natural disasters
The table balances mundane forest dangers with magical elements and interesting roleplay opportunities. Each entry provides enough detail for a DM to run the encounter while leaving room for improvisation. Would you like me to add any specific types of encounters or modify any existing entries?
```

## The Forest Encounter Table

Behind the scenes, the LLM is using the MCP Random Tables server to create this table. Here's the actual table that was created:

```json
{
  "id": "b2cf46a1-1884-4492-8770-d1b7e796355d",
  "name": "Low-Mid Level Forest Encounters",
  "description": "A varied table of forest encounters suitable for low to mid-level adventurers, including natural hazards, wildlife, fey trickery, and interesting discoveries",
  "entries": [
    {
      "id": "73704174-c92e-46be-9e58-3a59df199680",
      "content": "A pack of 2-4 wolves emerges from the underbrush, hungry and territorial",
      "weight": 4
    },
    {
      "id": "06c7f44c-0e32-467a-b1dc-4f66e5411716",
      "content": "Hidden pit trap covered by branches and leaves (10 ft deep, 1d6 damage)",
      "weight": 3
    },
    {
      "id": "8d836a07-0c9d-41ef-98bd-d9c160481210",
      "content": "A bear foraging for berries, will attack if surprised or threatened",
      "weight": 3
    },
    {
      "id": "e92904da-6009-432d-92d9-6f4ddb6f8796",
      "content": "Thick fog suddenly rolls in, reducing visibility to 10 feet for 1 hour",
      "weight": 2
    },
    {
      "id": "fca2e820-7354-4178-a567-a4a42cccc2a1",
      "content": "A group of bandits (3-5) demands toll for passage through 'their' forest",
      "weight": 3
    },
    {
      "id": "fa5da8be-31e1-4d6d-8809-8bd4d448c3eb",
      "content": "Mischievous sprites swap one random item from each character's pack with forest debris",
      "weight": 2
    },
    {
      "id": "60ecc1e7-6e49-4087-bde8-7ff0c0a60438",
      "content": "A wounded deer approaches, seeking help - arrow in its flank suggests hunters nearby",
      "weight": 2
    },
    {
      "id": "32dc4551-88ca-45db-89a1-89628ac1c421",
      "content": "Poisonous berries that look identical to safe ones (Constitution save or poisoned)",
      "weight": 3
    },
    {
      "id": "ab98fa56-5f78-436e-982f-4a6bfd270894",
      "content": "An owlbear's territorial roar echoes through the trees, growing closer",
      "weight": 2
    },
    {
      "id": "95141145-2131-4bd9-aeec-70aa2d06eb37",
      "content": "A dryad's tree is being cut down by loggers - she pleads for help",
      "weight": 1
    },
    {
      "id": "17a45210-18f5-4613-a5e4-d2bf8a182637",
      "content": "Swarm of angry wasps from a disturbed nest",
      "weight": 4
    },
    {
      "id": "a01d5b0a-2818-4dfd-9709-d740ac89ccc4",
      "content": "A pixie offers to guide the party but leads them in circles for its amusement",
      "weight": 2
    },
    {
      "id": "e9c1a44d-215e-4bdb-89b8-42424426a51b",
      "content": "Unstable ground gives way to a sinkhole (Dexterity save or fall 15 ft)",
      "weight": 2
    },
    {
      "id": "befdab47-b603-49bd-ad92-4c9619c24fa7",
      "content": "A lone dire wolf stalks the party from the shadows",
      "weight": 2
    },
    {
      "id": "013b3b14-3b72-4265-8641-353a20a833ff",
      "content": "Wild boar with piglets charges when party gets too close to her young",
      "weight": 3
    },
    {
      "id": "3e3a12dc-1e42-462d-9409-ebf3ece2a0fc",
      "content": "Ancient standing stones hum with fey magic - touching them teleports characters 1 mile in random direction",
      "weight": 1
    },
    {
      "id": "01e9b5fc-c99a-46cc-b250-a689db9f08d5",
      "content": "A hunter's abandoned camp with mysterious claw marks and signs of struggle",
      "weight": 2
    },
    {
      "id": "6d5c1bb8-a4e8-4069-be2c-2cf65d5ed494",
      "content": "Thorny vines animate and attempt to entangle anyone who passes (awakened shrub stats)",
      "weight": 2
    },
    {
      "id": "2b8e8a67-bff1-4d51-9743-574e8170f236",
      "content": "A talking raven offers cryptic warnings about dangers ahead in exchange for shiny objects",
      "weight": 1
    },
    {
      "id": "567d00e0-f0a1-47ea-8042-b080efaa167d",
      "content": "Flash flood from distant storm turns peaceful stream into raging torrent",
      "weight": 1
    }
  ]
}
```

## Using the Forest Encounter Table

Once the table is created, you can use it to generate encounters. Here's an example conversation:

**User:**

```
Could you roll on the table 3 times? one for morning, noon, and night, present the result as well as a bit of block text to use to set up the encounter for each
```

**LLM:**

```
Let me check what tables are available first:

Perfect! Here are your three forest encounters for different times of day:

Morning Encounter: Sprite Mischief
Mischievous sprites swap one random item from each character's pack with forest debris

Setup: As the morning mist begins to lift and golden sunlight filters through the canopy, the party notices tiny, tinkling laughter echoing from the trees above. Suddenly, each character feels a strange lightness in their pack. Upon inspection, they discover that one random item from each pack has been replaced with forest debris—perhaps a dried mushroom where their rations were, or a bundle of twigs in place of their rope. The sprites giggle from the branches overhead, clearly delighted with their prank. The party can attempt to negotiate, chase, or simply accept this minor inconvenience as the price of traveling through fey-touched woods.

Noon Encounter: The Approaching Owlbear
An owlbear's territorial roar echoes through the trees, growing closer

Setup: The midday sun beats down through the forest canopy as the party makes their way along the forest path. Suddenly, a deep, bone-chilling roar echoes from somewhere ahead—part bear growl, part owl screech. Birds scatter from the trees in all directions, and smaller woodland creatures flee past the party's feet. The roar comes again, definitely closer this time, and the party can hear the heavy crash of underbrush being trampled. They have perhaps a minute or two before whatever made that sound arrives. Do they stand and fight, attempt to hide, or try to retreat while they still can?

Night Encounter: The Stalking Dire Wolf
A lone dire wolf stalks the party from the shadows

Setup: The forest grows ominous as night falls, with only the party's campfire or torchlight pushing back the encroaching darkness. As they make camp or continue their nighttime travel, an uneasy feeling settles over the group—the sensation of being watched. Occasionally, pairs of yellow eyes glint in the darkness just beyond their light, disappearing whenever someone looks directly at them. The dire wolf is patient, intelligent, and calculating, following just out of sight as it evaluates these potential threats or prey. Wisdom (Perception) checks might catch glimpses of its massive form moving between the trees, but it won't attack immediately—it's studying the party's weaknesses first.

Each encounter offers different tactical and roleplay opportunities, from negotiating with fey creatures to stealth and combat scenarios!
```

## How It Works

Behind the scenes, when the LLM rolls on the table, the MCP Random Tables server:

1. Selects a random entry from the table based on the weights
2. Returns the content of the selected entry
3. The LLM then uses this content to create a detailed encounter description

The weighting system ensures that more common encounters (like wolf packs and wasp swarms with weight 4) occur more frequently than rare encounters (like the dryad's plea or the ancient standing stones with weight 1).

## Weighted Probabilities

This table uses weighted entries to make some encounters more common than others:

- Common encounters (weight 4):

  - A pack of 2-4 wolves emerges from the underbrush, hungry and territorial
  - Swarm of angry wasps from a disturbed nest

- Moderately common encounters (weight 3):

  - Hidden pit trap covered by branches and leaves (10 ft deep, 1d6 damage)
  - A bear foraging for berries, will attack if surprised or threatened
  - A group of bandits (3-5) demands toll for passage through 'their' forest
  - Poisonous berries that look identical to safe ones (Constitution save or poisoned)
  - Wild boar with piglets charges when party gets too close to her young

- Less common encounters (weight 2):

  - Thick fog suddenly rolls in, reducing visibility to 10 feet for 1 hour
  - Mischievous sprites swap one random item from each character's pack with forest debris
  - A wounded deer approaches, seeking help - arrow in its flank suggests hunters nearby
  - An owlbear's territorial roar echoes through the trees, growing closer
  - A pixie offers to guide the party but leads them in circles for its amusement
  - Unstable ground gives way to a sinkhole (Dexterity save or fall 15 ft)
  - A lone dire wolf stalks the party from the shadows
  - A hunter's abandoned camp with mysterious claw marks and signs of struggle
  - Thorny vines animate and attempt to entangle anyone who passes (awakened shrub stats)

- Rare encounters (weight 1):
  - A dryad's tree is being cut down by loggers - she pleads for help
  - Ancient standing stones hum with fey magic - touching them teleports characters 1 mile in random direction
  - A talking raven offers cryptic warnings about dangers ahead in exchange for shiny objects
  - Flash flood from distant storm turns peaceful stream into raging torrent

The probability of each entry being rolled is proportional to its weight. For example, "A pack of wolves" has a weight of 4 out of a total weight of 43, giving it a 4/43 probability of being rolled.

## Usage in a Game

This table can be used by a Game Master during a tabletop RPG session when the players are traveling through a forest. The GM can roll on this table at different times of day to create varied encounters throughout the journey.

The detailed descriptions provided by the LLM help the GM set the scene and create immersive encounters that can lead to combat, social interaction, or exploration challenges.

## Conclusion

This example demonstrates how to create and use a simple encounter table with the MCP Random Tables server. By using weighted entries and detailed descriptions, you can create dynamic and engaging encounters for your tabletop RPG sessions.

The MCP Random Tables server, configured with the recommended npx approach, makes it easy to create, manage, and use these tables through your LLM client.
