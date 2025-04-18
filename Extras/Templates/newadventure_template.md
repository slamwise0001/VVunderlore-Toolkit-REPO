<%*  
// Prompt for adventure name
let adventureName = await tp.system.prompt("Enter Adventure Name:");
if (!adventureName || adventureName.trim() === "") {
    new Notice("Adventure creation canceled.");
    return;
}

// **Sanitize and trim adventure name**
adventureName = adventureName.trim().replace(/[<>:"/\\|?*]/g, ''); // Remove invalid filename characters

// Define paths
const basePath = `Adventures/${adventureName}`;
const sessionNotesPath = `${basePath}/Session Notes`;
const newFilePath = `${basePath}/${adventureName} - Adventure Hub`;
let sessionTemplatePath = `Extras/Templates/(${adventureName})sessiontemplate`; // we'll add “.md” below

// Link to your base session template
const baseSessionTemplate = "[[Extras/Templates/base_sessiontemplate.md]]";

// **Helper for code fences** so we never accidentally close our outer backtick
const fence = '```';

// Ensure folders exist
for (const f of [basePath, `${basePath}/Adventure`, `${basePath}/Materials`, sessionNotesPath]) {
    if (!(await app.vault.adapter.exists(f))) {
        await app.vault.createFolder(f);
    }
}
await new Promise(r => setTimeout(r, 500));  // tiny pause

// Build frontmatter
let frontmatter = `---
players: []
adventure: "${adventureName}"
---`;

// Build the Adventure Hub note
let noteContent = `${frontmatter}
# 📜 ${adventureName} - Adventure Hub

## 📚 Chapter Links
${fence}dataviewjs
const currentFolder = dv.current().file.folder;
const adventureFolder = currentFolder + '/Adventure';

const pages = dv.pages('"' + adventureFolder + '"').sort(p => p.file.name);
if (pages.length === 0) {
  dv.paragraph("You haven't written anything yet.");
} else {
  pages.forEach(p => dv.header(4, p.file.link));
}
${fence}

---
>[!success] Current Session:
>${fence}dataviewjs
>const pages = dv.pages('"Adventures/${adventureName}/Session Notes"')
>  .sort(p => p.file.ctime, 'desc')
>  .limit(1);
>if (pages.length) {
>  dv.header(4, pages[0].file.link);
>}
>${fence}

${fence}meta-bind-button
label: New Session
icon: ""
hidden: false
class: ""
tooltip: "Create a new session note for this adventure"
id: first-session
style: primary
actions:
  - type: templaterCreateNote
    templateFile: "Extras/Templates/(${adventureName})sessiontemplate.md"
    folderPath: "Adventures/${adventureName}/Session Notes"
    fileName: ""
    openNote: true
${fence}

---
## 👥 Player Characters
${fence}dataviewjs
// … your dropdown + table JavaScript as before …
${fence}

---
## ⏳ Takeaways
${fence}dataviewjs
// … your takeaway‑extraction JavaScript as before …
${fence}
`;

// === Copy & patch your base session template ===
const baseTemplatePath = "Extras/Templates/base_sessiontemplate.md";
const baseFile = app.vault.getAbstractFileByPath(baseTemplatePath);
if (!baseFile) {
  new Notice("Base session template not found!");
  return;
}
let baseTemplateContent = await app.vault.read(baseFile);
let finalTemplate = baseTemplateContent
  .replace(/\$\{adventureName\}/g, adventureName)
  .replace(/ADVENTURE FOLDER/g, adventureName)
  .replace(/SESSION NOTES FOLDER/g, "Session Notes")
  .replace(/\(exampleadventure\)/g, `(${adventureName})`);
if (!sessionTemplatePath.endsWith(".md")) sessionTemplatePath += ".md";
await app.vault.create(sessionTemplatePath, finalTemplate);
new Notice(`Session template created!`);

// Summary file
let summaryPath = `Extras/SYS/${adventureName}_summary.md`;
await app.vault.create(summaryPath, "");
new Notice(`Summary file: ${summaryPath}`);

// Finally, write and open the hub note
await tp.file.create_new(noteContent, newFilePath);
await app.workspace.openLinkText(newFilePath, "", true);
new Notice(`Adventure “${adventureName}” & session template done!`);
%>
