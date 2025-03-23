<%* //REMOVE THE SPACE BEFORE THE % TO MAKE IT GO
// Access the ModalForms API
const modalForm = app.plugins.plugins.modalforms.api;
const result = await modalForm.openForm('new-item-form');

// Abort if the form was cancelled
if (!result) {
  new Notice("Form cancelled.");
  return;
}

// Process the 'magical' toggle
let magicalToggle = String(result.magical).toLowerCase();
let magicalValue = (magicalToggle === "yes" || magicalToggle === "true") ? "true" : "false";

// Process the attunement toggle
let attunementToggle = String(result.attunement).toLowerCase();
let attunementLine = (attunementToggle === "yes" || attunementToggle === "true") ? "**Requires attunement.**" : "";

// Define finalItemType, subItem, and displayType based on magical status
let finalItemType = "";
let subItem = "";
let displayType = "";

if (magicalValue === "true") {
    // For magical items, use the magicalitemtype field directly.
    finalItemType = (result.magicalitemtype ? String(result.magicalitemtype) : "").trim();
    // For magical items, just display the final item type.
    displayType = finalItemType;
} else {
    // For non-magical items, use the itemtype field.
    let rawItemType = (result.itemtype ? String(result.itemtype) : "").trim();
    // Convert folder-path values to friendly labels.
    const typeMapping = {
       "Compendium/Items/Tools": "Tool",
       "Compendium/Items/Instruments": "Instrument"
    };
    if (rawItemType in typeMapping) {
        finalItemType = typeMapping[rawItemType];
    } else {
        finalItemType = rawItemType;
    }
    
    // For types with conditional questions, extract the subtype from the corresponding field.
    if (["Consumable", "Valuable", "Gear", "Weapon", "Armor"].includes(finalItemType)) {
       let fieldValue = "";
       if (finalItemType === "Consumable") {
         fieldValue = (result.consumable ? String(result.consumable) : "").trim();
       } else if (finalItemType === "Valuable") {
         fieldValue = (result.valuable ? String(result.valuable) : "").trim();
       } else if (finalItemType === "Gear") {
         fieldValue = (result.gear ? String(result.gear) : "").trim();
       } else if (finalItemType === "Weapon") {
         fieldValue = (result.weapon ? String(result.weapon) : "").trim();
       } else if (finalItemType === "Armor") {
         fieldValue = (result.armor ? String(result.armor) : "").trim();
       }
       if (fieldValue && fieldValue.includes("/")) {
         let parts = fieldValue.split("/");
         subItem = parts[parts.length - 1].trim();
       } else {
         subItem = fieldValue;
       }
    }
    
    // Determine displayType:
    // For Weapon, Armor, or Gear, always use finalItemType.
    // For the others, if a conditional sub-item exists, use that; otherwise, fall back to finalItemType.
    if (["Weapon", "Armor", "Gear"].includes(finalItemType)) {
         displayType = finalItemType;
    } else {
         displayType = subItem ? subItem : finalItemType;
    }
}

// Determine the final destination folder (folderPath)
let folderPath = "";
if (magicalValue === "true") {
    folderPath = result.folder;
} else {
    let rawItemType = (result.itemtype ? String(result.itemtype) : "").trim();
    let destinationFolder = "";
    if (rawItemType.includes("/")) {
        destinationFolder = rawItemType;
    } else {
        if (rawItemType === "Consumable" && result.consumable) {
            destinationFolder = String(result.consumable).trim();
        } else if (rawItemType === "Valuable" && result.valuable) {
            destinationFolder = String(result.valuable).trim();
        } else if (rawItemType === "Gear" && result.gear) {
            destinationFolder = String(result.gear).trim();
        } else if (rawItemType === "Weapon" && result.weapon) {
            destinationFolder = String(result.weapon).trim();
        } else if (rawItemType === "Armor" && result.armor) {
            destinationFolder = String(result.armor).trim();
        }
    }
    if (!destinationFolder) {
         destinationFolder = "Compendium/Items/Homebrew Items";
    }
    folderPath = destinationFolder;
}

// Build the frontmatter
let frontmatter = `---
owned: false
shopkeep: false
price: ${result.price}
magical: ${magicalValue}
attunement: ${(attunementToggle === "yes" || attunementToggle === "true") ? "true" : "false"}
itemType: "${finalItemType}"
subtype: "${subItem}"
---`;

// Build the main note body (layout unchanged)
let noteBody = `
# ${result.itemName}

*${displayType}, ${result.rarity}*. ${attunementLine}

*${result.narrativeDesc}*

${result.details}
`;

// Process attribution safely
let attributionStr = "";
if (result.attribution != null) {
    attributionStr = String(result.attribution).trim();
}
let attributionBlock = "";
if (attributionStr.length > 0) {
    attributionBlock = `
---
Source: *${attributionStr}*`;
}

// Assemble the final note content
let noteContent = `${frontmatter}

${noteBody}
${attributionBlock}
`;

// Define the file name
let fileName = (result.itemName ? String(result.itemName) : "Untitled Item").trim();
if (fileName.toLowerCase().endsWith(".md")) {
    fileName = fileName.slice(0, -3);
}
let notePath = `${folderPath}/${fileName}`;

// Create the new file
await tp.file.create_new(noteContent, notePath);
await new Promise(resolve => setTimeout(resolve, 2000));
let newFile = tp.file.find_tfile(notePath) || app.vault.getAbstractFileByPath(notePath);
if (newFile) {
  app.workspace.openLinkText(newFile.basename, newFile.path, true);
} else {
  new Notice("File not found: " + notePath);
}
%>