---
hp: 11
ac: 14
modifier: 2
level: 2
Name: Chixlum the Handsy
Species: "[[Gnome]]"
Race: 
Class: "[[Rogue]]"
Subclass: "[[Thief]]"
Level: 7
Alignment: Chaotic Neutral
Strength: 13
Dexterity: 15
Constitution: 16
Intelligence: 13
Wisdom: 14
Charisma: 18
current_hp: 56
Speed: "30"
Proficiency Bonus: 3
Skill Proficiencies:
  - Athletics
  - Perception
  - Stealth
  - Survival
ST Proficiencies:
  - Constitution
  - Charisma
Weapon Proficiencies:
  - Daggers
  - Darts
  - Slings
  - Quarterstaffs
  - Light Crossbows
Armor Proficiencies: 
Tool Proficiencies: 
Languages:
  - Common
  - Gnomish
  - Abyssal
  - Dwarvish
  - Klingon
Spells:
  - "[[Lightning Bolt]]"
  - "[[Blade Ward]]"
  - "[[Create Bonfire]]"
  - "[[Green-flame Blade]]"
  - "[[Vortex Warp]]"
  - "[[Mage Hand]]"
  - "[[Mending]]"
  - "[[Tasha's Caustic Brew]]"
  - "[[Alter Self]]"
  - "[[Knock]]"
  - "[[Melf's Minute Meteors]]"
  - "[[Dimension Door]]"
  - "[[Fire Bolt]]"
aliases:
  - Fellatia
Status: Active
adventures:
  - The Testing of VVunderlore
spell_mod: Charisma
key_items:
  - "[[Cloak of Protection]]"
  - "[[Circlet of Blasting]]"
  - "[[Rod of Security]]"
vcredit: 50
---
# ⚔️ Combat Stats
```dataviewjs
const file = dv.current();

// Handle undefined values
const armorClass = file["ac"] || "N/A";
const dexterity = file.Dexterity || 10; // Default to 10 if undefined
const dexModifier = Math.floor((dexterity - 10) / 2);
const hpMax = file["hp"] || "0";
const hpCurrent = file["current_hp"] || "0";
const hp = `${hpMax}/${hpCurrent}`;

// Output as Markdown table
const tableMarkdown = `
| Armor Class | Initiative | HP (Max/Current) |
|-------------|------------|------------------|
| **${armorClass}** | **+${dexModifier}** | **${hp}** |
`;

dv.paragraph(tableMarkdown);

```
```dataviewjs
// Get current file's metadata
const file = dv.current();

// Function to calculate the ability modifier
function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
}

// List of abilities to display
const abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

// Get proficiency list and proficiency bonus
const proficiencies = file["ST Proficiencies"] || [];
const proficiencyBonus = Number(file["Proficiency Bonus"]) || 0; // Ensure it's treated as a number

// Debugging output
console.log("Proficiencies:", proficiencies);
console.log("Proficiency Bonus:", proficiencyBonus);

// Generate the table markdown
const tableMarkdown = `
| Ability      | Value | Modifier | Saving Throw |
|--------------|-------|----------|--------------|
${abilities.map(ability => {
    const value = Number(file[ability]) || 10; // Ensure the value is treated as a number
    const modifier = calculateModifier(value);
    const total = proficiencies.includes(ability) ? modifier + proficiencyBonus : modifier;
    
    return `| ${ability} | **${value}** | **+${modifier}** | **+${total}** |`;
}).join("\n")}
`;

dv.paragraph(tableMarkdown);

```

# 🧠  Skills
```dataviewjs
// List of all D&D skills and their associated abilities
const skills = {
    "Acrobatics": "Dexterity", "Animal Handling": "Wisdom", "Arcana": "Intelligence", "Athletics": "Strength", "Deception": "Charisma",
    "History": "Intelligence", "Insight": "Wisdom", "Intimidation": "Charisma", "Investigation": "Intelligence", "Medicine": "Wisdom",
    "Nature": "Intelligence", "Perception": "Wisdom", "Performance": "Charisma", "Persuasion": "Charisma", "Religion": "Intelligence",
    "Sleight of Hand": "Dexterity", "Stealth": "Dexterity", "Survival": "Wisdom"
};

// Get current file's metadata
const file = dv.current();

// Get skill proficiency list and proficiency bonus
const skillProficiencies = file["Skill Proficiencies"] || [];
const proficiencyBonus = Number(file["Proficiency Bonus"]) || 0; // Ensure proficiency bonus is treated as a number

// Function to calculate the ability modifier
function calculateModifier(score) {
    return Math.floor((Number(score) - 10) / 2); // Ensure ability scores are treated as numbers
}

// Generate the table markdown
const tableMarkdown = `
| Skill            | Modifier | Proficient |
|------------------|----------|------------|
${Object.entries(skills).map(([skill, ability]) => {
    const value = Number(file[ability]) || 10; // Ensure ability score is treated as a number
    const modifier = calculateModifier(value);
    const total = skillProficiencies.includes(skill) ? modifier + proficiencyBonus : modifier;
    const proficiencyIndicator = skillProficiencies.includes(skill) ? "⭐" : "";
    return `| ${skill} | **+${total}** | ${proficiencyIndicator} |`;
}).join("\n")}
`;

dv.paragraph(tableMarkdown);

```
```dataviewjs
// Get current file's metadata
const file = dv.current();

// Retrieve proficiency lists
const weaponProficiencies = file["Weapon Proficiencies"] || [];
const armorProficiencies = file["Armor Proficiencies"] || [];
const toolProficiencies = file["Tool Proficiencies"] || [];

// Generate the table markdown
const tableMarkdown = `
| Type     | Proficiencies                                      |
|----------|----------------------------------------------------|
| Weapons  | ${weaponProficiencies.join(", ")}                  |
| Armor    | ${armorProficiencies.join(", ")}                   |
| Tools    | ${toolProficiencies.join(", ")}                    |
`;

dv.paragraph(tableMarkdown);
```

# Spells

```dataviewjs
// Get current file's metadata
const file = dv.current();

// Retrieve the list of spells from the frontmatter
const spellsList = file["Spells"] || [];

// Check if there are any spells listed in the frontmatter
if (spellsList.length > 0) {

    // Generate the table
    dv.table(
      ["Spell", "Level", "Saving Throw", "Duration", "Casting Time", "Range", "Damage Type"],
      dv.pages('"Compendium/Spells"')
        .where(p => spellsList.some(spell => spell.path === p.file.path)) // Match spells by path
        .sort(p => p.file.name, 'asc') // Sort by spell name
        .map(p => [
            p.file.link,          // Spell name (as link)
            p.level,              // Level
            p.save,       // Saving Throw
            p.duration,           // Duration
            p.casting_time,       // Casting Time
            p.range,              // Range
            p.damage_type         // Damage Type
        ])
    );
} else {
    // Display custom message when no spells are found
    dv.paragraph("Character has 0 spells. What a dope.");
}

```

#  🧰 Equipment

###  🗡️ Weapons

- No weapons listed


### 🛡 Armor

- No armor listed


###  🪕 Tools

- No tools listed


#  👤 Personal Details

- **Status**: NaN
- **Height**: NaN m
- **Weight**: NaN kg
- **Background**: NaN
- **Gender**: NaN
- **Birthday**: NaN

## Fun Facts!
- Fellatia has never been romantic with another Tabaxi.
- Fellatia knew of Captain Quinn and the history of kidnapping Tabaxi. Uh oh!
- Incredibly allergic to cows
- Has silvery fur but actually has fully brown fur but takes herbs to make it silver. Silverleaf and silverberry
- Very good at fishing but was barred from all international fishing competitions because she used her magic to turn her claws into fish hooks and was caught. 
- Piss attracts enemies. Cat stuff. SHe has to be really careful when she pees.
- Fellatia sometimes has a poison scratch but it's super rando and she can't figure it out.
- Oldest of 13 across 4 litters. Over 100 nieces and nephews. 103 to be exact
- FUUUJNNN FACT
- Fellatia is a very accomplished pickpocket but didn't want to steal Tilly's thunder but would still steal something from tilly every morning but then put it back because she felt bad.## Appearance
*Physical description, notable features, and anything special about the character's appearance.*
- Fellatia was extremely attracted to Lira. Felt a connection like never before.
- Is lactose intolerant. 
- Published a since-banned book called "The Stuffed Kitty," a cross-species intructional sex tome. 
- Throughout her life has only very occasionally suffered bouts of alopecia and has lost all her fur. Hasn't happened in over two decades. Hopefully the stress of the mine doesn't make her loose tufts.## Personality Traits
*Key traits, motivations, and quirks of the character.*
- Really enjoys seafood but is allergic to mollusks. 
- Alopecia is really starting to show. Being in the dark and underground is not good, especially the stress and stuff.## Backstory
*Character backstory, origins, and any important life events.*
- Salve for alopecia: it's called tiger balm. 
- Despite the fact the Fellatia doesn't love to swim, she's a champ at holding her breath. She won a contest holding her breath for 22 minutes.## Current Story Threads
- Knew about Captain Nadia Quinn being a part of a Tabaxi-enslavement ring
- PULL TOWARDS THE DARKNESS - Fellatia failed her check at the mirrored pond in Tungurd Forest and saw the demons eyes. She'll always be drawn to death. **MAKE IT A CHOICE THOUGH**.
	- Certain doors should appear as the black breathing door from the mausoleum 
- When she was in prison, she was on a work crew that worked in the snow for a year staight so she has bad memories of the snow but now shes got good new piss memories from this trip.
- During Fellatia's FIRST prison stint, she directed an all-female acapella group.## Goals & Ambitions
*Long-term character goals or aspirations.*
- 1. Fellatia was born with a second vestigial tail. Removed.
2. Fellatia was born with an extra claw on each front paw. ITS A LIE.
3. Once won a chili dog eating contest.
- Her father was actually the mayor of the Tabaxi home town and was the seventh in a line of Bloodwhisper mayors. Felltaia was expected to follow in his footsteps but "abdicated" the mayoral throne so she's not well liked. Bummer## Allies & Enemies
*Important allies, NPCs, or enemies in the character’s life.*

## Inventory
*Track important items, loot, or equipment.*

## Notes
*Anything else worth remembering.*