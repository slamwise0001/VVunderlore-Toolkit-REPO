<%*
const modalForm = app.plugins.plugins.modalforms.api;
const result = await modalForm.openForm("new-creature");
if (!result) {
  new Notice("Form cancelled.");
  return;
}

function getFieldAsString(fieldName, defaultValue = "") {
  let value = result[fieldName];
  if (!value) return defaultValue;
  return String(value).trim();
}

function getFieldAsNumber(fieldName, defaultValue = 0) {
  let value = result[fieldName];
  return value ? Math.floor(Number(value)) : defaultValue;
}

function getFieldAsBoolean(fieldName) {
  return result[fieldName] ? true : false;
}

function toYamlList(str) {

  if (!str) return "- None";
  let items = str.split(",").map(s => s.trim()).filter(s => s.length > 0);
  return items.length === 0 ? "- None" : items.map(item => `- ${item}`).join("\n");
}

// Function to calculate ability modifier
function getAbilityModifier(score) {
  let mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `(${mod})`;
}

// Calculate Proficiency Bonus based on CR
function getProficiencyBonus(cr) {
  let crToProficiency = {
    "0": 2, "1/8": 2, "1/4": 2, "1/2": 2, "1": 2,
    "2": 2, "3": 2, "4": 2, "5": 3, "6": 3, "7": 3, "8": 3,
    "9": 4, "10": 4, "11": 4, "12": 4, "13": 5, "14": 5,
    "15": 5, "16": 5, "17": 6, "18": 6, "19": 6, "20": 6,
    "21": 7, "22": 7, "23": 7, "24": 7, "25": 8, "26": 8,
    "27": 8, "28": 8, "29": 9, "30": 9
  };
  return crToProficiency[cr] || 2;
}

let name = getFieldAsString("name");
let classification = getFieldAsString("location"); // Folder classification
let size = getFieldAsString("size", "Medium");
let type = getFieldAsString("type", "humanoid");
let alignment = getFieldAsString("alignment", "unaligned");
let ac = String(getFieldAsNumber("ac") || "10");
let naturalArmor = getFieldAsBoolean("armortype") ? "Natural Armor" : "None";
let hp = String(getFieldAsNumber("hp") || "1");
let hitDie = getFieldAsString("hitdie") || "1d6";
let walkSpeed = String(getFieldAsNumber("w-speed") || "30");
let swimSpeed = String(getFieldAsNumber("s-speed") || "0");
let flySpeed = String(getFieldAsNumber("f-speed") || "0");

let str = String(getFieldAsNumber("cre-str") || "10");
let dex = String(getFieldAsNumber("cre-dex") || "10");
let con = String(getFieldAsNumber("cre-con") || "10");
let int = String(getFieldAsNumber("cre-int") || "10");
let wis = String(getFieldAsNumber("cre-wis") || "10");
let cha = String(getFieldAsNumber("cre-cha") || "10");

let challengeRating = getFieldAsString("cr") || "0";
let proficiencyBonus = String(getProficiencyBonus(challengeRating));

let savingThrows = toYamlList(getFieldAsString("savethrow"));
let skills = toYamlList(getFieldAsString("skills"));
let vulnerabilities = toYamlList(getFieldAsString("dmg_vul"));
let resistances = toYamlList(getFieldAsString("dmg_res"));
let immunities = toYamlList(getFieldAsString("dmg_imm"));
let conditionImmunities = toYamlList(getFieldAsString("cond_imm"));
let senses = toYamlList(getFieldAsString("senses"));

let traits = getFieldAsString("traits");
let actions = getFieldAsString("actions");
let reactions = getFieldAsString("reactions");
let legendaryActions = getFieldAsString("legendary");
let lairActions = getFieldAsString("lair-action");
let regionalEffects = getFieldAsString("regional");
let description = getFieldAsString("description");
let narrative = getFieldAsString("narrative");

// Build frontmatter

let frontmatter = `---
name: "${name}"
classification: "${classification}"
size: "${size}"
type: "${type}"
alignment: "${alignment}"
armor_class: ${ac} (${naturalArmor})
hit_points: ${hp}
hit_die: "${hitDie}"
speed:
  Walk: ${walkSpeed} ft
  Swim: ${swimSpeed} ft
  Fly: ${flySpeed} ft
strength: ${str}
dexterity: ${dex}
constitution: ${con}
intelligence: ${int}
wisdom: ${wis}
charisma: ${cha}
proficiency_bonus: +${proficiencyBonus}
saving_throws:
${savingThrows}
skills:
${skills}
damage_vulnerabilities:
${vulnerabilities}
damage_resistances:
${resistances}
damage_immunities:
${immunities}
condition_immunities:
${conditionImmunities}
senses:
${senses}
challenge_rating: "${challengeRating}"
---`;

// Body with `= this.field_name` references and inline modifier calculations
let statBlock = `# \`= this.name\`
_\`= this.size\` \`= this.type\`, \`= this.alignment\`_

>[!info] *Description* 
>*${narrative || "None"}*


**Armor Class:** \`= this.armor_class\`  
**Hit Points:** \`= this.hit_points\` (\`= this.hit_die\`)  
**Speed:** Walk \`= this.speed.Walk\`, Swim \`= this.speed.Swim\`, Fly \`= this.speed.Fly\`

### **Abilities**
| STR | DEX | CON | INT | WIS | CHA |
|:---:|:---:|:---:|:---:|:---:|:---:|
| \`= this.strength\` (\`= floor((this.strength - 10) / 2)\`) | \`= this.dexterity\` (\`= floor((this.dexterity - 10) / 2)\`) | \`= this.constitution\` (\`= floor((this.constitution - 10) / 2)\`) | \`= this.intelligence\` (\`= floor((this.intelligence - 10) / 2)\`) | \`= this.wisdom\` (\`= floor((this.wisdom - 10) / 2)\`) | \`= this.charisma\` (\`= floor((this.charisma - 10) / 2)\`) |

**Proficiency Bonus:** +\`= this.proficiency_bonus\`  
**Saving Throws:** \`= this.saving_throws\`  
**Skills:** \`= this.skills\`  
**Damage Vulnerabilities:** \`= this.damage_vulnerabilities\`  
**Damage Resistances:** \`= this.damage_resistances\`  
**Damage Immunities:** \`= this.damage_immunities\`  
**Condition Immunities:** \`= this.condition_immunities\`  
**Senses:** \`= this.senses\`  
**Challenge Rating:** \`= this.challenge_rating\`

##### **Traits**
${traits || "None"}

##### **Actions**
${actions || "None"}

##### **Reactions**
${reactions || "None"}

##### **Legendary Actions**
${legendaryActions || "None"}

##### **Lair Actions**
${lairActions || "None"}

##### **Regional Effects**
${regionalEffects || "None"}

## Description
${description || "None"}
`;

// Function to convert multi-line text into YAML lists
function formatYamlList(text) {
  if (!text || text.trim() === "") return "  - none"; // Handle empty cases
  return text
    .split("\n")
    .map(line => {
      let parts = line.split(":");
      if (parts.length < 2) return ""; // Ensure valid format
      let name = parts[0].trim();
      let desc = parts.slice(1).join(":").trim();
      return `  - name: "${name}"\n    desc: "${desc}"`;
    })
    .filter(line => line !== "") // Remove empty lines
    .join("\n");
}

// Ensure folder path is valid and does not contain problematic characters
let sanitizedClassification = classification.replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
let fileName = name.replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
let filePath = `Compendium/Bestiary/${sanitizedClassification}/${fileName}`;





await tp.file.create_new(frontmatter.trim() + "\n" + statBlock.trim(), filePath);



await new Promise(resolve => setTimeout(resolve, 2000));

// Open the created file
let newFile = tp.file.find_tfile(filePath) || app.vault.getAbstractFileByPath(filePath);
if (newFile) {
  app.workspace.openLinkText(newFile.basename, newFile.path, true);
} else {
  new Notice("File not found: " + filePath);
}
%>
