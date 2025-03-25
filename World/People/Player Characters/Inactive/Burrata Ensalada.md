---
hp: 26
ac: 14
modifier: 
level: 4
Name: Burrata Ensalada
Species: "[[Elf]]"
Class: "[[Bard]]"
Subclass: "[[College of Glamour]]"
Alignment: Lawful Good
Strength: 14
Dexterity: 15
Constitution: 13
Intelligence: 10
Wisdom: 11
Charisma: 16
current_hp: 
Armor Class: 14
Speed: Walk 30 ft.
Proficiency Bonus: 2
Skill Proficiencies:
  - Arcana
  - Sleight of Hand
  - Performance
  - Perception
  - Persuasion
ST Proficiencies: 
Weapon Proficiencies:
  - simple
  - hand crossbows
  - longswords
  - rapiers
  - shortswords
Armor Proficiencies:
  - light
Tool Proficiencies:
  - three musical instruments of your choice
key_items: 
Languages:
  - Common
  - Elvish
Spells:
  - "[[Tasha's Hideous Laughter]]"
  - "[[Dissonant Whispers]]"
  - "[[Thorn Whip]]"
spells_raw_debug: "[\"Tasha's Hideous Laughter\",\"Dissonant Whispers\",\"Thorn Whip\"]"
aliases:
  - Burrata
appearances:
---

# `= this.Name`
#### *`= "Level" + " " +  this.level + " " + this.Species + " " + this.Class + " (" + this.Subclass + ")"`* 

### ⚔️ Combat Stats
```dataviewjs
const file = dv.current();
const armorClass = file["ac"] || "N/A";
const dexterity = file.Dexterity || 10;
const dexModifier = Math.floor((dexterity - 10) / 2);
const hpMax = file["hp"] || "0";

dv.paragraph(`
| Armor Class | Initiative | HP |
|-------------|------------|------------------|
| **${armorClass}** | **+${dexModifier}** | **${hpMax}** |
`);
```


```dataviewjs
const file = dv.current();
const abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
const proficiencies = file["ST Proficiencies"] || [];
const proficiencyBonus = Number(file["Proficiency Bonus"]) || 0;

function calculateModifier(score) {
  return Math.floor((score - 10) / 2);
}

const rows = abilities.map(ability => {
  const value = Number(file[ability]) || 10;
  const mod = calculateModifier(value);
  const total = proficiencies.includes(ability) ? mod + proficiencyBonus : mod;
  return `| ${ability} | **${value}** | **+${mod}** | **+${total}** |`;
});

dv.paragraph(`
| Ability      | Value | Modifier | Saving Throw |
|--------------|-------|----------|--------------|
${rows.join("\n")}
`);
```


### 🧠 Skills & Proficiencies
```dataviewjs
const skills = {
  "Acrobatics": "Dexterity", "Animal Handling": "Wisdom", "Arcana": "Intelligence",
  "Athletics": "Strength", "Deception": "Charisma", "History": "Intelligence",
  "Insight": "Wisdom", "Intimidation": "Charisma", "Investigation": "Intelligence",
  "Medicine": "Wisdom", "Nature": "Intelligence", "Perception": "Wisdom",
  "Performance": "Charisma", "Persuasion": "Charisma", "Religion": "Intelligence",
  "Sleight of Hand": "Dexterity", "Stealth": "Dexterity", "Survival": "Wisdom"
};
const file = dv.current();
const profSkills = file["Skill Proficiencies"] || [];
const profBonus = parseInt(String(file["Proficiency Bonus"] || "").replace("+", ""), 10) || 0;
function calcMod(score) { return Math.floor((score - 10) / 2); }
let rows = Object.entries(skills).map(([skill, ability]) => {
  const score = file[ability] || 10;
  const baseMod = calcMod(score);
  const totalMod = profSkills.includes(skill) ? baseMod + profBonus : baseMod;
  const mark = profSkills.includes(skill) ? "⭐" : "";
  return `| ${skill} | **+${totalMod}** | ${mark} |`;
});
dv.paragraph(`
| Skill            | Modifier | Proficient |
|------------------|----------|------------|
${rows.join("\n")}
`);
```

### ✨ Spells

### Spells
```dataviewjs
// This block renders the spells table from the frontmatter Spells field
const spells = dv.current().Spells;

if (spells && Array.isArray(spells) && spells.length > 0) {
  const spellTableData = spells.map(spellItem => {
    const spellString = typeof spellItem === 'string' ? spellItem : String(spellItem);
    // Attempt to extract wiki link
    const match = spellString.match(/^\[\[(.*?)\]\]$/);
    if (!match) {
      return {
        name: spellString,
        level: 'N/A',
        casting_time: 'N/A',
        range: 'N/A',
        save: '-'
      };
    }
    let linkPart = match[1];
    let [rawTarget, displayName] = linkPart.split('|');
    if (!displayName) {
      displayName = rawTarget.replace(/\.md$/i, '').split('/').pop();
    }
    rawTarget = rawTarget.replace(/\.md$/i, '');
    if (rawTarget.startsWith('/')) {
      rawTarget = rawTarget.slice(1);
    }
    const spellLink = `<a href='/${rawTarget}.md' class='internal-link'>${displayName}</a>`;
    const spellPage = dv.page(rawTarget);
    return {
      name: spellLink,
      level: spellPage?.level ?? 'N/A',
      casting_time: spellPage?.casting_time ?? 'N/A',
      range: spellPage?.range ?? 'N/A',
      save: spellPage?.save?.trim() ?? '-'
    };
  }).sort((a, b) => {
    // Attempt to sort by numeric level if possible
    const levelA = parseInt(a.level, 10) || 0;
    const levelB = parseInt(b.level, 10) || 0;
    return levelA - levelB;
  });

  let tableRows = spellTableData.map(spell => `
    <tr>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.name}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.level}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.casting_time}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.range}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.save}</td>
    </tr>
  `).join('');

  const tableHTML = `
  <table style='width: 100%; border-collapse: collapse;'>
    <thead>
      <tr>
        <th style='border: 1px solid #ccc; padding: 5px;'>Spell</th>
        <th style='border: 1px solid #ccc; padding: 5px;'>Level</th>
        <th style='border: 1px solid #ccc; padding: 5px;'>Casting Time</th>
        <th style='border: 1px solid #ccc; padding: 5px;'>Range</th>
        <th style='border: 1px solid #ccc; padding: 5px;'>Saving Throw</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  `;
  dv.el('div', tableHTML);
} else {
  dv.el('div', 'No spells found.');
}
```


### 🪕 Key Items
`= this.key_items`

### 👤 Personal Details
**Status:** NaN  
**Height:** NaN m  
**Weight:** NaN kg  
**Background:** NaN  
**Gender:** NaN  
**Birthday:** NaN

---
#### Appearance
*Physical description, notable features, and anything special about the character's appearance.*

#### Personality Traits
*Key traits, motivations, and quirks.*

#### Backstory
*Character backstory, origins, and any important life events.*

#### Current Story Threads
*Active missions or ongoing plotlines.*

#### Goals & Ambitions
*Long-term character goals or aspirations.*

#### Allies & Enemies
*Important allies, NPCs, or enemies.*

#### Notes
*Anything else worth remembering.*

#### Fun Facts!
*Quirky details about your character.*
