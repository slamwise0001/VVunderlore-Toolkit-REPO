---
hp: 17
ac: 18
modifier: 2
level: 8
Name: Munch Tippledew
Species: "[[Half-Orc]]"
Race: 
Class: "[[Compendium/Classes/Bard/Bard|Bard]]"
Subclass: "[[College of Satire]]"
Alignment: Neutral Good
Strength: "15"
Dexterity: "14"
Constitution: "18"
Intelligence: "14"
Wisdom: "12"
Charisma: "10"
current_hp: 74
Speed: "30"
Proficiency Bonus: "3"
Skill Proficiencies:
  - Athletics
  - Insight
  - Intimidation
ST Proficiencies:
  - Strength
  - Constitution
Weapon Proficiencies: 
Armor Proficiencies: 
Tool Proficiencies: 
Languages: 
Spells: 
aliases:
  - 3mo
  - Dump
Status: Active
adventures:
  - The Testing of VVunderlore
key_items:
  - "[[Portable Hole]]"
  - "[[Bag of Tricks, Gray]]"
vcredit: "0"
---
# Munch Tippledew

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
            p.saving_throw,       // Saving Throw
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


## Allies & Enemies
*Important allies, NPCs, or enemies in the character’s life.*

## Inventory
*Track important items, loot, or equipment.*

## Notes
*Anything else worth remembering.*