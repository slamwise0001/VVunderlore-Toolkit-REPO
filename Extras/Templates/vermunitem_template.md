<%*
const modalForm = app.plugins.plugins.modalforms.api;
const result = await modalForm.openForm('vermun-item-form');

if (!result) {
  new Notice("Form cancelled.");
  return;
}

let attunementToggle = String(result.attunement).toLowerCase();
let attunementLine = (attunementToggle === "yes" || attunementToggle === "true") ? "**Requires attunement.**" : "";


let vermunToggle = String(result.vermun).toLowerCase();
let vermunValue = (vermunToggle === "yes" || vermunToggle === "true") ? "true" : "false";

// file destination and default
let folderPath = result.folder ? String(result.folder).trim() : "Compendium/Items/Homebrew Items";

let frontmatter = `---
price: ${result.price}
attunement: ${(attunementToggle === "yes" || attunementToggle === "true") ? "true" : "false"}
itemType: "${result.itemType}"
rarity: "${result.rarity}"
vermun: ${vermunValue}
seen: false
owned: false
---`;


//body
let noteBody = `
# ${result.itemName}

*${result.itemType}, ${result.rarity}*. ${attunementLine}

*${result.narrativeDesc}*

${result.details}
`;

let attributionStr = result.attribution ? String(result.attribution).trim() : "";
let attributionBlock = attributionStr ? `\n\n---\n\n*${attributionStr}*` : "";

let noteContent = `${frontmatter}

${noteBody}
${attributionBlock}
`;

// filename
let fileName = (result.itemName ? String(result.itemName) : "Untitled Item").trim();
if (fileName.toLowerCase().endsWith(".md")) {
    fileName = fileName.slice(0, -3);
}
let notePath = `${folderPath}/${fileName}`;


await tp.file.create_new(noteContent, notePath);
await new Promise(resolve => setTimeout(resolve, 2000));
let newFile = tp.file.find_tfile(notePath) || app.vault.getAbstractFileByPath(notePath);
if (newFile) {
  app.workspace.openLinkText(newFile.basename, newFile.path, true);
} else {
  new Notice("File not found: " + notePath);
}
%>

