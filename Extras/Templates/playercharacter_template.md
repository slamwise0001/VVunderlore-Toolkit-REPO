<%*
// ─── SETUP: Access APIs ───────────────────────────────────────────────
const modalForm = app.plugins.plugins.modalforms.api;
const dv = app.plugins.plugins.dataview ? app.plugins.plugins.dataview.api : null;
if (!dv) {
  new Notice("Dataview plugin is not enabled.");
  return;
}

const result = await modalForm.openForm("new-player-character");
if (!result) {
  new Notice("Player Character creation cancelled.");
  return;
}

// ─── Helper: Remove all double-asterisks (bold markers) ───────────────
function removeBold(str) {
  return str.replace(/\*\*/g, "").trim();
}

// ─── Helper: Choose the Correct Subclass ──────────────────────────────
function getSubclass() {
  const subclassFields = [
    "subclass-cleric",
    "subclass-artificer",
    "subclass-barbarian",
    "subclass-Bard",
    "subclass-Druid",
    "subclass-Fighter",
    "subclass-Monk",
    "subclass-Mystic",
    "subclass-paladin",
    "subclass-ranger",
    "subclass-ranger revised",
    "subclass-ranger spelless",
    "subclass-rogue",
    "subclass-sorcerer",
    "subclass-warlock",
    "subclass-wizard"
  ];

  for (const key of subclassFields) {
    const val = result.get(key);
    if (val && String(val).trim() !== "") {
      return String(val).trim();
    }
  }
  return "";
}
const subclass = getSubclass();

// ─── Helper: Calculate Proficiency Bonus ──────────────────────────────
function getProficiencyBonus(level) {
  const lvl = Math.max(1, parseInt(level || "1", 10));
  if (lvl <= 4)  return 2;
  if (lvl <= 8)  return 3;
  if (lvl <= 12) return 4;
  if (lvl <= 16) return 5;
  return 6;
}

// ─── Helper: Process a comma-separated list into a JSON array string ─
function processList(value) {
  if (!value) return "[]";
  let items = value.split(",")
    .map(item => item.trim())
    .filter(item => item.length > 0);
  return JSON.stringify(items);
}

// ─── Helper: Convert a string or array to a wiki link ────────────────
function asWikilink(value) {
  if (!value) return "";
  // If Modal Forms is returning an array (e.g. ["Aven"]), flatten it:
  if (Array.isArray(value)) value = value.join(" "); 
  const trimmed = value.trim();
  return trimmed ? `[[${trimmed}]]` : "";
}

function toYamlList(key, arr) {
 
  if (!arr || arr.length === 0) return `${key}: []`;
  const lines = arr.map(item => `  - "${item}"`).join("\n");
  return `${key}:\n${lines}`;
}


let name = result.get("Name") ? String(result.get("Name")).trim() : "Unnamed Character";
if (name.toLowerCase().endsWith(".md")) {
  name = name.slice(0, -3);
}
// 1. Get the user’s Status and normalize it
let statusValue = result.get("Status") || "";
statusValue = statusValue.trim().toLowerCase();

// 2. Decide which folder to use based on Status
const folder = (statusValue === "inactive") ? "Inactive" : "Active";

// 3. Build the final file path
const filePath = `World/People/Player Characters/${folder}/${name}`;


//  character level and compute proficiency bonus.
const level = parseInt(result.get("level") || "1", 10);
const proficiencyBonus = getProficiencyBonus(level);

// ─── Speed from the Chosen Species ───────────────────────────
let speciesName = result.get("species") ? String(result.get("species")).trim() : "";
let speciesSpeed = "";
if (speciesName !== "") {
  try {
    let speciesPath = `Compendium/Species/${speciesName}.md`;
    let speciesFile = app.vault.getAbstractFileByPath(speciesPath);
    if (speciesFile) {
      let speciesContent = await app.vault.cachedRead(speciesFile);
      let lines = speciesContent.split("\n");
      for (let line of lines) {
        let trimmed = line.trim();
        if (trimmed.startsWith("- **Speed")) {
          let rawValue = trimmed.split(":").slice(1).join(":").trim();
          speciesSpeed = removeBold(rawValue);
          break;
        }
      }
    } else {
      new Notice("Species file not found: " + speciesPath);
    }
  } catch (e) {
    new Notice("Error reading species note for " + speciesName + ": " + e.message);
  }
}

// ─── Retrieve Proficiencies from the Chosen Class Note ────────────────

let className = result.get("pcclass") ? String(result.get("pcclass")).trim() : "";
let weaponProficiencies = "";
let armorProficiencies = "";
let toolProficiencies = "";
let stProficiencies = "";
if (className !== "") {
  try {
    let classPath = `Compendium/Classes/${className}/${className}.md`;
    let classFile = app.vault.getAbstractFileByPath(classPath);
    if (classFile) {
      let classContent = await app.vault.cachedRead(classFile);
      let classLines = classContent.split("\n");
      for (let line of classLines) {
        let trimmed = line.trim();
        if (trimmed.startsWith("**Armor:**")) {
          let rawArmor = trimmed.split(":").slice(1).join(":").trim();
          armorProficiencies = processList(removeBold(rawArmor));
        }
        if (trimmed.startsWith("**Weapons:**")) {
          let rawWeapons = trimmed.split(":").slice(1).join(":").trim();
          weaponProficiencies = processList(removeBold(rawWeapons));
        }
        if (trimmed.startsWith("**Tools:**")) {
          let rawTools = trimmed.split(":").slice(1).join(":").trim();
          toolProficiencies = processList(removeBold(rawTools));
        }
        if (trimmed.startsWith("**Saving Throws:**")) {
          let rawSaves = trimmed.split(":").slice(1).join(":").trim();
          stProficiencies = processList(removeBold(rawSaves));
        }
      }
    } else {
      new Notice("Class file not found: " + classPath);
    }
  } catch (e) {
    new Notice("Error reading class note for " + className + ": " + e.message);
  }
}

// ─── Spells: Parse the Raw JSON and Convert to Wiki-Links ─────────────
const rawSpells = result.get("spells");
new Notice("Raw spells = " + JSON.stringify(rawSpells));

// Attempt to parse the raw JSON string from the form
let spellsArray = [];
try {
  // rawSpells should be something like: "[\"Absorb Elements\",\"Scrying\"]"
  if (rawSpells) {
    spellsArray = JSON.parse(rawSpells);
  }
} catch (err) {
  new Notice("Error parsing spells JSON: " + err.message);
}

// Convert each spell name into [[Spell]]
const wikiLinkedSpells = spellsArray.map(spell => `[[${spell}]]`);

// Build the multi-line YAML
const spellsYaml = toYamlList("Spells", wikiLinkedSpells);

// ─── Build Frontmatter ────────────────────────────────────────────────
const frontmatter = `---
hp: ${result.get("hp") || ""}
ac: ${result.get("ac") || ""}
modifier: ${result.get("modifier") || ""}
level: ${result.get("level") || ""}
Name: ${name}
Species: "${asWikilink(result.get("species"))}"
Class: "${asWikilink(result.get("pcclass"))}"
Subclass: "${asWikilink(subclass)}"
Alignment: ${result.get("Alignment") || ""}
Strength: ${result.get("strength") || ""}
Dexterity: ${result.get("dexterity") || ""}
Constitution: ${result.get("constitution") || ""}
Intelligence: ${result.get("intelligence") || ""}
Wisdom: ${result.get("wisdom") || ""}
Charisma: ${result.get("charisma") || ""}
current_hp: ${result.get("current_hp") || ""}
Armor Class: ${result.get("ac") || ""}
Speed: ${speciesSpeed}
Proficiency Bonus: +${proficiencyBonus}
Skill Proficiencies: ${result.get("Skill Proficiencies") || ""}
ST Proficiencies: ${stProficiencies}
Weapon Proficiencies: ${weaponProficiencies}
Armor Proficiencies: ${armorProficiencies}
Tool Proficiencies: ${toolProficiencies}
key_items: ${Array.isArray(result.get("key_items")) ? JSON.stringify(result.get("key_items")) : (result.get("key_items") || "[]")}
Languages: ${result.get("Languages") || ""}

${spellsYaml}

aliases: ${result.get("aliases") || ""}
appearances: ${Array.isArray(result.get("appearances")) ? JSON.stringify(result.get("appearances")) : (result.get("appearances") || "[]")}
---`;

// ─── Build the Spells Dataview Block ──────────────────────────────────
const spellBlock = `
### Spells
\`\`\`dataviewjs
// This block renders the spells table from the frontmatter Spells field
const spells = dv.current().Spells;

if (spells && Array.isArray(spells) && spells.length > 0) {
  const spellTableData = spells.map(spellItem => {
    const spellString = typeof spellItem === 'string' ? spellItem : String(spellItem);
    // Attempt to extract wiki link
    const match = spellString.match(/^\\[\\[(.*?)\\]\\]$/);
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
      displayName = rawTarget.replace(/\\.md$/i, '').split('/').pop();
    }
    rawTarget = rawTarget.replace(/\\.md$/i, '');
    if (rawTarget.startsWith('/')) {
      rawTarget = rawTarget.slice(1);
    }
    const spellLink = \`<a href='/\${rawTarget}.md' class='internal-link'>\${displayName}</a>\`;
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

  let tableRows = spellTableData.map(spell => \`
    <tr>
      <td style='border: 1px solid #ccc; padding: 5px;'>\${spell.name}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>\${spell.level}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>\${spell.casting_time}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>\${spell.range}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>\${spell.save}</td>
    </tr>
  \`).join('');

  const tableHTML = \`
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
      \${tableRows}
    </tbody>
  </table>
  \`;
  dv.el('div', tableHTML);
} else {
  dv.el('div', 'No spells found.');
}
\`\`\`
`;

// ─── Saving Throws Block ──────────────────────────────────────────────
const savingThrowBlock = `
\`\`\`dataviewjs
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
  return \`| \${ability} | **\${value}** | **+\${mod}** | **+\${total}** |\`;
});

dv.paragraph(\`
| Ability      | Value | Modifier | Saving Throw |
|--------------|-------|----------|--------------|
\${rows.join("\\n")}
\`);
\`\`\`
`;

// ─── Assemble Note Content (Frontmatter + Unchanged Body) ─────────────
const noteContent = `${frontmatter}

# \`= this.Name\`
#### *\`= "Level" + " " +  this.level + " " + this.Species + " " + this.Class + " (" + this.Subclass + ")"\`* 

### ⚔️ Combat Stats
\`\`\`dataviewjs
const file = dv.current();
const armorClass = file["ac"] || "N/A";
const dexterity = file.Dexterity || 10;
const dexModifier = Math.floor((dexterity - 10) / 2);
const hpMax = file["hp"] || "0";

dv.paragraph(\`
| Armor Class | Initiative | HP |
|-------------|------------|------------------|
| **\${armorClass}** | **+\${dexModifier}** | **\${hpMax}** |
\`);
\`\`\`

${savingThrowBlock}

### 🧠 Skills & Proficiencies
\`\`\`dataviewjs
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
  return \`| \${skill} | **+\${totalMod}** | \${mark} |\`;
});
dv.paragraph(\`
| Skill            | Modifier | Proficient |
|------------------|----------|------------|
\${rows.join("\\n")}
\`);
\`\`\`

### ✨ Spells
${spellBlock}

### 🪕 Key Items
\`= this.key_items\`

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
`;

// ─── Create the File ──────────────────────────────────────────────────
await tp.file.create_new(noteContent, filePath);
await new Promise(resolve => setTimeout(resolve, 2000));
let newFile = tp.file.find_tfile(filePath) || app.vault.getAbstractFileByPath(filePath);
if (newFile) {
  app.workspace.openLinkText(newFile.basename, newFile.path, true);
} else {
  new Notice("File not found: " + filePath);
}

async function createSecondFileFromTemplate(playerName) {
  // 1) Locate the second template file by name/path:
  const secondTemplateTFile = tp.file.find_tfile("Extras/Templates/playerdash_template");
  if (!secondTemplateTFile) {
    new Notice("Second template not found: Templates/playerdash_template");
    return;
  }

  // 2) Read the entire template as a string:
  let secondTemplateContent = await app.vault.read(secondTemplateTFile);

  // 3) Replace any placeholder in that second template, e.g. {{PlayerName}}
  //    with the actual 'playerName' we already have.
  secondTemplateContent = secondTemplateContent.replace(/{{PlayerName}}/g, name);

  // 4) Decide where the new note should go:
  //    Adjust this path/folder name to suit your vault structure.
  const secondFilePath = `Extras/PC Dashboards/dash-${name}`;

  // 5) Create the new file using the Templater function:
  await tp.file.create_new(secondTemplateContent, secondFilePath);

  new Notice(`Created extra file for ${name}`);
}

// Finally, actually call that function, passing in the new character's name:
await createSecondFileFromTemplate(name);
%>







