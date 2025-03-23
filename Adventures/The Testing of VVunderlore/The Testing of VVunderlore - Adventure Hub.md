---
players:
  - "[[Chixlum the Handsy]]"
  - "[[Munch Tippledew]]"
adventure: The Testing of VVunderlore
---
# 📜 The Testing of VVunderlore - Adventure Hub

## 📚 Chapter Links
```dataviewjs
const currentFolder = dv.current().file.folder; 
const adventureFolder = `${currentFolder}/Adventure`; 

const pages = dv.pages(`"${adventureFolder}"`).sort(p => p.file.name);
if (pages.length === 0) {
    dv.paragraph("You haven't written anything yet.");
} else {
    pages.forEach(p => dv.header(4, p.file.link));
}
```
---
>[!success] Current Session:
> ```dataviewjs
> const pages = dv.pages('"Adventures/The Testing of VVunderlore/Session Notes"')
>                  .sort(p => p.file.ctime, 'desc')
>                  .limit(1);
> if (pages.length) {
>     dv.header(4, pages[0].file.link);
> }
> ```

```meta-bind-button
label: Create first session
icon: ""
hidden: false
class: ""
tooltip: "Create your first session note"
id: first-session
style: primary
actions:
  - type: templaterCreateNote
    templateFile: "Extras/Templates/(The Testing of VVunderlore)sessiontemplate.md"
    folderPath: "Adventures/The Testing of VVunderlore/Session Notes"
    fileName: ""
    openNote: true

```
---
## 👥 Player Characters
```dataviewjs
const container = dv.container;
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.gap = "10px";
container.style.marginBottom = "20px";

// Create button container for better alignment
const buttonContainer = document.createElement("div");
buttonContainer.style.display = "flex";
buttonContainer.style.gap = "10px"; // Spacing between buttons
buttonContainer.style.alignItems = "center"; // Align buttons properly
buttonContainer.style.justifyContent = "flex-start"; // Align to left

// Fetch player character notes from both folders
let playerCharacters = dv
  .pages('"World/People/Player Characters/Active"')
  .concat(dv.pages('"World/People/Player Characters/Inactive"'))
  .map(p => p.file.name)
  .sort();

// Create dropdown button
const dropdownButton = document.createElement("button");
dropdownButton.innerHTML = "Select Player Characters";
dropdownButton.style.padding = "6px 12px";
dropdownButton.style.border = "1px solid #444";
dropdownButton.style.borderRadius = "4px";
dropdownButton.style.cursor = "pointer";
dropdownButton.style.backgroundColor = "#444";
dropdownButton.style.color = "#fff";
dropdownButton.style.minWidth = "180px"; // Set fixed width for consistency
dropdownButton.style.textAlign = "center";

// Create dropdown content (hidden initially)
const dropdownContent = document.createElement("div");
dropdownContent.style.display = "none";
dropdownContent.style.position = "absolute";
dropdownContent.style.backgroundColor = "#333";
dropdownContent.style.border = "1px solid #444";
dropdownContent.style.borderRadius = "4px";
dropdownContent.style.padding = "10px";
dropdownContent.style.width = "200px";
dropdownContent.style.zIndex = "9999";
dropdownContent.style.maxHeight = "200px";
dropdownContent.style.overflowY = "auto";

// Populate dropdown with checkboxes
playerCharacters.forEach(character => {
  const label = document.createElement("label");
  label.style.color = "#fff";
  label.style.display = "flex";
  label.style.alignItems = "center";
  label.style.padding = "5px";
  label.style.cursor = "pointer";
  
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = character;
  
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(" " + character));

  // Hover effect
  label.addEventListener("mouseover", () => (label.style.backgroundColor = "#555"));
  label.addEventListener("mouseout", () => (label.style.backgroundColor = "transparent"));

  dropdownContent.appendChild(label);
});

// Append dropdown to BODY to prevent clipping
document.body.appendChild(dropdownContent);

// Toggle dropdown visibility and position it correctly
dropdownButton.addEventListener("click", function () {
  if (dropdownContent.style.display === "none") {
    dropdownContent.style.display = "block";
    const rect = dropdownButton.getBoundingClientRect();
    dropdownContent.style.left = rect.left + "px";
    dropdownContent.style.top = rect.bottom + window.scrollY + "px";
  } else {
    dropdownContent.style.display = "none";
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
    dropdownContent.style.display = "none";
  }
});

// Create "Add" button
const addCharacterButton = document.createElement("button");
addCharacterButton.innerHTML = "Add";
addCharacterButton.style.padding = "6px 12px";
addCharacterButton.style.border = "1px solid #444";
addCharacterButton.style.borderRadius = "4px";
addCharacterButton.style.cursor = "pointer";
addCharacterButton.style.backgroundColor = "#444";
addCharacterButton.style.color = "#fff";
addCharacterButton.style.minWidth = "80px";
addCharacterButton.style.textAlign = "center";

// Modify "Add" button to update metadata
addCharacterButton.addEventListener("click", async () => {
  const selectedCharacters = Array.from(dropdownContent.querySelectorAll("input:checked"))
    .map(cb => "[[" + cb.value + "]]");

  if (selectedCharacters.length === 0) {
    new Notice("Please select at least one player character.");
    return;
  }

  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("No active file detected.");
    return;
  }

  await app.fileManager.processFrontMatter(file, frontmatter => {
    if (!frontmatter.players) {
      frontmatter.players = [];
    }
    if (!Array.isArray(frontmatter.players)) {
      frontmatter.players = [frontmatter.players];
    }
    frontmatter.players = [...new Set([...frontmatter.players, ...selectedCharacters])];
  });

  new Notice("Updated players: " + selectedCharacters.join(", "));
});

// Add buttons above the table
buttonContainer.appendChild(dropdownButton);
buttonContainer.appendChild(addCharacterButton);
container.appendChild(buttonContainer);

// --- Existing Player Table ---
const players = dv.current().players; 

if (!players || players.length === 0) {
    dv.paragraph("No players found.");
} else {
    const playerPages = players
        .map(player => dv.page(player)) 
        .filter(p => p);

    dv.table(
        ["Player", "Species", "Class", "Subclass", "Level", "Max HP", "AC", "STR", "DEX", "CON", "INT", "WIS", "CHA"],
        playerPages.map(p => [
            p.file.link, p.Species, p.Class, p.Subclass, p.level, p.hp, p.ac, 
            p.Strength, p.Dexterity, p.Constitution, p.Intelligence, 
            p.Wisdom, p.Charisma
        ])
    );
}

```
---
## ⏳ Takeaways
```dataviewjs
const folderPath = "Adventures/The Testing of VVunderlore/Session Notes";

const extractTakeaways = (content, startHeader, endHeader) => {
    const startPattern = new RegExp(`^#+\s*${startHeader}\s*`, "im");
    const endPattern = new RegExp(`^#+\s*${endHeader}\s*`, "im");

    const startMatch = content.match(startPattern);
    const endMatch = content.match(endPattern);

    if (!startMatch) return null;

    const startIndex = startMatch.index + startMatch[0].length;
    const endIndex = endMatch ? endMatch.index : content.length;

    return content.slice(startIndex, endIndex).replace(/^(#+.*|Notes last touched.*)$/gim, "").trim() || null;
};

// Collect notes, extract takeaways, sort them, and build the table
(async () => {
    let tableData = await Promise.all(dv.pages(`"${folderPath}"`)
        .map(async page => {
            const content = await dv.io.load(page.file.path);
            const takeaway = content ? extractTakeaways(content, "Takeaways", "Next Session") : null;
            return takeaway ? [page.file.name, takeaway] : null;
        }));

    tableData = tableData.filter(row => row !== null);

    tableData.sort((a, b) => {
        // Remove optional chaining for compatibility:
        const matchA = a[0].match(/Session (d+)/);
        const matchB = b[0].match(/Session (d+)/);
        const sessionNumberA = parseInt(matchA ? matchA[1] : 0, 10);
        const sessionNumberB = parseInt(matchB ? matchB[1] : 0, 10);
        return sessionNumberB - sessionNumberA;
    });

    tableData = tableData.slice(0, 5);

    if (tableData.length > 0) dv.table(["Note", "Takeaway"], tableData);
})();
```
