<%*
const modalForm = app.plugins.plugins.modalforms.api;
const result = await modalForm.openForm("new-place-form");
if (!result) {
  new Notice("Form cancelled.");
  return;
}

function getFieldAsString(fieldName, defaultValue = "") {
  let value = result[fieldName];
  if (!value) {
    return defaultValue;
  }
  return String(value).trim();
}

function toItemArray(str) {
  if (!str) return [];
  return str
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function toWikiLinkYamlList(str) {
  const items = toItemArray(str);
  if (items.length === 0) return "  -";
  return items.map(item => `  - "[[${item}]]"`).join("\n");
}

function toPlainYamlList(str) {
  const items = toItemArray(str);
  if (items.length === 0) return "  -";
  return items.map(item => `  - "${item}"`).join("\n");
}

function toWikiLinkCsv(str) {
  const items = toItemArray(str);
  return items.map(item => `[[${item}]]`).join(", ");
}

function toPlainCsv(str) {
  const items = toItemArray(str);
  return items.join(", ");
}

let name            = getFieldAsString("name");
let type            = getFieldAsString("type");
let narrativeDesc   = getFieldAsString("narrative desc");
let desc            = getFieldAsString("desc");
let history         = getFieldAsString("history");
let world           = getFieldAsString("world");
let country         = getFieldAsString("country");
let popSize         = getFieldAsString("population size");
let climate         = getFieldAsString("climate");
let denizens        = getFieldAsString("denizens");
let appearsRaw      = getFieldAsString("appearances");  // Plain list, no wiki links

let countryYamlList    = toWikiLinkYamlList(country);  // wiki links in frontmatter
let denizensYamlList   = toWikiLinkYamlList(denizens); // wiki links in frontmatter
let appearsInYamlList  = toPlainYamlList(appearsRaw);     // plain list in frontmatter

let frontmatter = `---
name: "${name}"
world: "${world}"
country: "${country}"
size: "${popSize}"
type: "${type}"
climate: "${climate}"
denizens :
${denizensYamlList}
appearances :
${appearsInYamlList}
---`;

// Build the "Type in Country, World" line dynamically
let locationLine = `***\`= this.type\`***`;
if (country && world) {
  locationLine += ` in \`= this.country\`, \`= this.world\``;
} else if (country) {
  locationLine += ` in \`= this.country\``;
} else if (world) {
  locationLine += ` in \`= this.world\``;
}

let noteBody = `# \`= this.name\`
${locationLine}
**Known Denizens:** \`= this.denizens\`

---
_${narrativeDesc}_

---
${desc}

${history}

**Appears In:** \`= this.appearances\`
`;

let noteContent = frontmatter + "\n\n" + noteBody;

let fileName = name.endsWith() ? name.slice(0, -3) : name;
let filePath = `World/Places/${fileName}`;

await tp.file.create_new(noteContent, filePath);
await new Promise(resolve => setTimeout(resolve, 2000));

// open
let newFile = tp.file.find_tfile(filePath) || app.vault.getAbstractFileByPath(filePath);
if (newFile) {
  app.workspace.openLinkText(newFile.basename, newFile.path, true);
} else {
  new Notice("File not found: " + filePath);
}
%>