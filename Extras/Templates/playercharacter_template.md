<%*
const name = await tp.system.prompt("Enter the character's name:");
const folder = "World/People/Player Characters/Active";

// Define the file path for the new note
const filePath = `${folder}/${name}`;

// Define the frontmatter with initial properties
const frontmatter = `---
hp: 
ac: 
modifier: 
level: 
Name: ${name}
Species: 
Race: 
Class: 
Subclass: 
Level: 
Alignment: 
Strength: 
Dexterity: 
Constitution: 
Intelligence: 
Wisdom: 
Charisma: 
current_hp: 
Armor Class: 
Speed: 
Proficiency Bonus: 
Skill Proficiencies: 
ST Proficiencies: 
Weapon Proficiencies: 
Armor Proficiencies: 
Tool Proficiencies: 
Languages: 
Spells: []
aliases:
Status:
---`;

// Define the content for the new note
const noteContent = `${frontmatter}

# ⚔️ Combat Stats
\`\`\`dataviewjs
const file = dv.current();
const armorClass = file["ac"] || "N/A";
const dexterity = file.Dexterity || 10;
const dexModifier = Math.floor((dexterity - 10) / 2);
const hpMax = file["hp"] || "0";
const hpCurrent = file["Current HP"] || "0";
const hp = \`\${hpMax}/\${hpCurrent}\`;

const tableMarkdown = \`
| Armor Class | Initiative | HP (Max/Current) |
|-------------|------------|------------------|
| **\${armorClass}** | **+\${dexModifier}** | **\${hp}** |
\`;

dv.paragraph(tableMarkdown);
\`\`\`

# 🧠 Skills and Proficiencies
\`\`\`dataviewjs
const skills = {
    "Acrobatics": "Dexterity", "Animal Handling": "Wisdom", "Arcana": "Intelligence", "Athletics": "Strength", "Deception": "Charisma",
    "History": "Intelligence", "Insight": "Wisdom", "Intimidation": "Charisma", "Investigation": "Intelligence", "Medicine": "Wisdom",
    "Nature": "Intelligence", "Perception": "Wisdom", "Performance": "Charisma", "Persuasion": "Charisma", "Religion": "Intelligence",
    "Sleight of Hand": "Dexterity", "Stealth": "Dexterity", "Survival": "Wisdom"
};

const file = dv.current();
const skillProficiencies = file["Skill Proficiencies"] || [];
const proficiencyBonus = file["Proficiency Bonus"] || 0;

function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
}

const tableMarkdown = \`
| Skill            | Modifier | Proficient |
|------------------|----------|------------|
\${Object.entries(skills).map(([skill, ability]) => {
    const value = file[ability] || 10;
    const modifier = calculateModifier(value);
    const total = skillProficiencies.includes(skill) ? modifier + proficiencyBonus : modifier;
    const proficiencyIndicator = skillProficiencies.includes(skill) ? "⭐" : "";
    return \`| \${skill} | **+\${total}** | \${proficiencyIndicator} |\`;
}).join("\\n")}
\`;

dv.paragraph(tableMarkdown);
\`\`\`

## 🧰 Equipment
#### 🗡️ Weapons
- No weapons listed

#### 🛡 Armor
- No armor listed

#### 🪕 Tools
- No tools listed

## 👤 Personal Details
- **Status**: NaN
- **Height**: NaN m
- **Weight**: NaN kg
- **Background**: NaN
- **Gender**: NaN
- **Birthday**: NaN

---
#### Appearance
*Physical description, notable features, and anything special about the character's appearance.*

#### Personality Traits
*Key traits, motivations, and quirks of the character.*

#### Backstory
*Character backstory, origins, and any important life events.*

#### Current Story Threads
*Active storylines or ongoing missions that the character is involved in.*

#### Goals & Ambitions
*Long-term character goals or aspirations.*

#### Allies & Enemies
*Important allies, NPCs, or enemies in the character’s life.*

#### Inventory
*Track important items, loot, or equipment.*

#### Notes
*Anything else worth remembering.*

#### Fun Facts!
`;


await tp.file.create_new(noteContent, filePath);
await new Promise(resolve => setTimeout(resolve, 2000));

let newFile = tp.file.find_tfile(filePath) || app.vault.getAbstractFileByPath(filePath);
if (newFile) {
  app.workspace.openLinkText(newFile.basename, newFile.path, true);
} else {
  new Notice("File not found: " + filePath);
}
%>
