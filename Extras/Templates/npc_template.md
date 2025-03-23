<%*
// ─── SETUP: Access APIs ───────────────────────────────────────────────
const modalForm = app.plugins.plugins.modalforms.api;
const dv = app.plugins.plugins.dataview ? app.plugins.plugins.dataview.api : null;
if (!dv) {
  new Notice("Dataview plugin is not enabled.");
  return;
}

const result = await modalForm.openForm("new-npc-form");
if (!result) {
  new Notice("NPC creation cancelled.");
  return;


}

// ─── Function to Convert Comma-Separated Strings into Wiki-Links ─────
function toWikiLinks(fieldValue) {
  return (fieldValue || "")
    .split(",")
    .map(item => `[[${item.trim()}]]`)
    .join(", ");
}

// ─── Process NPC Basic Data ──────────────────────────────────────────
let npcName = result.Name ? String(result.Name).trim() : "Unnamed NPC";
if (npcName.toLowerCase().endsWith(".md")) {
  npcName = npcName.slice(0, -3);
}
let notePath = `World/People/Non-Player Characters/${npcName}`;
let useStatBlock = String(result.get("Stats") || "").toLowerCase() === "true";

// ─── Retrieve NPC Level ───────────────────────────────────────────────
let npcLevel = parseInt(result.get("Level"), 10) || 1;

// ─── Ability Scores & Derived Stats ───────────────────────────────────
function rollAbilityScore() {
  let rolls = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3] + Math.floor(npcLevel / 2);  // Level-based boost
}

let npc_str = result.get("npc_STR") || rollAbilityScore();
let npc_dex = result.get("npc_DEX") || rollAbilityScore();
let npc_con = result.get("npc_CON") || rollAbilityScore();
let npc_int = result.get("npc_INT") || rollAbilityScore();
let npc_wis = result.get("npc_WIS") || rollAbilityScore();
let npc_cha = result.get("npc_CHA") || rollAbilityScore();

function abilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

let bonusAC = Math.floor(npcLevel / 5);
let npc_ac = result.get("npc_ac") || (10 + abilityModifier(npc_dex) + bonusAC);

let totalHP = 0;
for (let i = 0; i < npcLevel; i++) {
  totalHP += (Math.floor(Math.random() * 8) + 1);
}
totalHP += npcLevel * abilityModifier(npc_con);
let npc_hp = result.get("npc_hp") || totalHP;

let npc_hit_dice = `${npcLevel}d8+${npcLevel * abilityModifier(npc_con)}`;

// ─── Spells Processing for Frontmatter ──────────────────────────────
let spellsInput = result.get("Known Spells") || "";
let spellsArray;
try {
  spellsArray = JSON.parse(spellsInput);
} catch (e) {
  spellsArray = spellsInput.split(",").map(s => s.trim());
}
spellsArray = spellsArray.map(s => {
  let clean = s.trim();
  if (clean.startsWith("[")) clean = clean.slice(1);
  if (clean.endsWith("]")) clean = clean.slice(0, -1);
  clean = clean.replace(/^"+|"+$/g, '');
  return clean;
});
spellsArray = spellsArray.filter(s => s !== "");
let spellsList = spellsArray.map(s => `"[[${s}]]"`);
let spellsYaml = spellsList.map(spell => `  - ${spell}`).join("\n");

function parseArrayToPlainText(fieldValue) {
  if (!fieldValue) return "";
  try {
    let arr = JSON.parse(fieldValue);
    if (Array.isArray(arr)) {
      return arr.join(", ");
    } else {
      return fieldValue;
    }
  } catch (e) {
    return fieldValue;
  }
}

// ─── Build Frontmatter ─────────────────────────────────────────────────
let frontmatter = `---
Name: ${npcName}
Species: ${result.get("Species")}
Size: ${result.get("Size")}
Alignment: ${result.get("Alignment")}
Type: ${result.get("Type")}
hp: ${npc_hp}
ac: ${npc_ac}
Strength: ${npc_str}
Dexterity: ${npc_dex}
Constitution: ${npc_con}
Intelligence: ${npc_int}
Wisdom: ${npc_wis}
Charisma: ${npc_cha}
Skill Proficiencies: ${result.get("Proficiency")}
ST Proficiencies: ${result.get("Saving Throws")}
Languages: 
Spells:
${spellsYaml}
Location: ${result.get("Primary Location")}
aliases: ${result.get("Aliases")}
Factions: ${result.get("Factions")}
Affiliates: ${result.get("Affiliates")}
Appearances: ${result.get("Appearences")}
---`;

// ─── Build the Main Note Body ─────────────────────────────────────────
// Note that Appearances is just plain text here
let noteBody = `
# ${npcName}
_${result.get("Species")} ${result.get("Class")}, ${result.get("Alignment")}

**Appears In:** ${parseArrayToPlainText(result.get("Appearances"))}

${result.get("bio") && result.get("bio").trim() !== "" ? `_${result.get("bio")}_` : ""}

---
> [!infobox]
> # More Info
> **Primary Location:** ${toWikiLinks(result.get("Primary Location"))}
> **Aliases:** ${result.get("Aliases")}
> **Factions:** ${toWikiLinks(result.get("Factions"))}
> **Affiliates:** ${toWikiLinks(result.get("Affiliates"))}
>
> # Abilities
> \`\`\`dataviewjs
> const page = dv.current();
> dv.el("div", \`
> | STR     | DEX | CON | INT | WIS | CHA |
> |---------|-------|----------|---|---|---|
> | \${Math.floor((page.Strength - 10)/2)} | \${Math.floor((page.Dexterity - 10)/2)} | \${Math.floor((page.Constitution - 10)/2)} | \${Math.floor((page.Intelligence - 10)/2)} | \${Math.floor((page.Wisdom - 10)/2)} | \${Math.floor((page.Charisma - 10)/2)} |
> \`);
> \`\`\`
`;
// ─── Build Spells Dataview Block ─────────────────────────────────────
let dvBlock = "";
dvBlock += "```dataviewjs\n";
dvBlock += "// This block renders the spells table from the frontmatter Spells field\n";
dvBlock += "const spells = dv.current().Spells;\n";
dvBlock += "if (spells && Array.isArray(spells) && spells.length > 0) {\n";
dvBlock += "  const spellTableData = spells.map(spellItem => {\n";
dvBlock += "    const spellString = typeof spellItem === 'string' ? spellItem : String(spellItem);\n";
dvBlock += "    const match = spellString.match(/^\\[\\[(.*?)\\]\\]$/);\n";
dvBlock += "    if (!match) { return { name: spellString, level: 'N/A', casting_time: 'N/A', range: 'N/A', save: '-' }; }\n";
dvBlock += "    let linkPart = match[1];\n";
dvBlock += "    let [rawTarget, displayName] = linkPart.split('|');\n";
dvBlock += "    if (!displayName) {\n";
dvBlock += "      displayName = rawTarget.replace(/\\.md$/i, '').split('/').pop();\n";
dvBlock += "    }\n";
dvBlock += "    rawTarget = rawTarget.replace(/\\.md$/i, '');\n";
dvBlock += "    if (rawTarget.startsWith('/')) { rawTarget = rawTarget.slice(1); }\n";
dvBlock += "    const spellLink = `<a href='/${rawTarget}.md' class='internal-link'>${displayName}</a>`;\n";
dvBlock += "    const spellPage = dv.page(rawTarget);\n";
dvBlock += "    return {\n";
dvBlock += "      name: spellLink,\n";
dvBlock += "      level: spellPage?.level ?? 'N/A',\n";
dvBlock += "      casting_time: spellPage?.casting_time ?? 'N/A',\n";
dvBlock += "      range: spellPage?.range ?? 'N/A',\n";
dvBlock += "      save: spellPage?.save?.trim() ?? '-'\n";
dvBlock += "    };\n";
dvBlock += "  }).sort((a, b) => a.level - b.level);\n";
dvBlock += "  let tableRows = spellTableData.map(spell => `\n    <tr>\n      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.name}</td>\n      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.level}</td>\n      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.casting_time}</td>\n      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.range}</td>\n      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.save}</td>\n    </tr>\n  `).join('');\n";
dvBlock += "  const tableHTML = `\n  <table style='width: 100%; border-collapse: collapse;'>\n    <thead>\n      <tr>\n        <th style='border: 1px solid #ccc; padding: 5px;'>Spell</th>\n        <th style='border: 1px solid #ccc; padding: 5px;'>Level</th>\n        <th style='border: 1px solid #ccc; padding: 5px;'>Casting Time</th>\n        <th style='border: 1px solid #ccc; padding: 5px;'>Range</th>\n        <th style='border: 1px solid #ccc; padding: 5px;'>Saving Throw</th>\n      </tr>\n    </thead>\n    <tbody>\n      ${tableRows}\n    </tbody>\n  </table>\n  `;\n";
dvBlock += "  dv.el('div', tableHTML);\n";
dvBlock += "} else { dv.el('div', 'No spells found.'); }\n";
dvBlock += "```";

noteBody += "\n\n### Spells\n" + dvBlock;

// ─── Optionally, Build Stat Block ─────────────────────────────────────
let statBlock = "";
if (useStatBlock) {
  statBlock = `
\`\`\`statblock
layout: Basic 5e Layout
name: ${npcName}
size: ${result.get("Size")}
type: ${result.get("Type")}
alignment: ${result.get("Alignment")}
ac: ${npc_ac}
hp: ${npc_hp}
hit_dice: ${npc_hit_dice}
speed: 30 ft.
stats:
  - STR: ${npc_str}
  - DEX: ${npc_dex}
  - CON: ${npc_con}
  - INT: ${npc_int}
  - WIS: ${npc_wis}
  - CHA: ${npc_cha}
\`\`\`
`;
}

// ─── Combine All Content and Create the Note ─────────────────────────
let noteContent = `${frontmatter}

${noteBody}
${statBlock}
`;

await tp.file.create_new(noteContent, notePath);
await new Promise(resolve => setTimeout(resolve, 2000));
let newFile = tp.file.find_tfile(notePath) || app.vault.getAbstractFileByPath(notePath);
if (newFile) {
  app.workspace.openLinkText(newFile.basename, newFile.path, true);
} else {
  new Notice("File not found: " + notePath);
}
%>
