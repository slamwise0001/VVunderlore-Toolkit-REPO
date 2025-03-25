
<center><h1> Omninomicon</h1></center>
```meta-bind-button
label: Start a New Adventure
icon: ""
style: destructive
class: ""
cssStyle: ""
backgroundImage: ""
tooltip: ""
id: ""
hidden: false
actions:
  - type: runTemplaterFile
    templateFile: Extras/Templates/newadventure_template.md

```
```dataviewjs
(async () => {
  // Gather all pages under "Adventures"
  const allPages = dv.pages('"Adventures"');
  let adventureFolders = new Set();
  allPages.forEach(p => {
    const parts = p.file.folder.split("/");
    if (parts.length >= 2) {
      adventureFolders.add(parts[1]);
    }
  });

  // Get summary files from Extras/SYS that have "_summary" in their name
  const summaries = dv.pages('"Extras/SYS"').where(p => p.file.name.toLowerCase().includes("_summary"));

  const rows = [];

  for (let adv of adventureFolders) {
    // 1) Most recent session note in Adventures/<adv>/Session Notes
    const sessionPages = dv.pages(`"Adventures/${adv}/Session Notes"`);
    let recentSession = "No session";
    if (sessionPages.length > 0) {
      const sorted = sessionPages.sort(p => p.file.ctime, 'desc');
      recentSession = dv.fileLink(sorted[0].file.path);
    }

    // 2) Summary file from Extras/SYS: load content and create 40-character preview.
    const matchingSummaries = summaries.filter(p => 
      p.file.name.toLowerCase().startsWith(adv.toLowerCase() + "_summary")
    );
    let summaryLink = "No summary";
    if (matchingSummaries.length > 0) {
      try {
        let content = await dv.io.load(matchingSummaries[0].file.path);
        // Remove YAML frontmatter if present.
        if (content.startsWith("---")) {
          content = content.replace(/^---[\s\S]*?---\s*/, "");
        }
        let preview = content.replace(/\r?\n/g, " ").trim().slice(0, 200);
        if (content.length > 40) preview += "…";
        // Manually build a markdown wikilink using the preview.
        summaryLink = `[[${matchingSummaries[0].file.path}|${preview}]]`;
      } catch(e) {
        summaryLink = "Error reading summary";
      }
    }

    // 3) Adventure Hub note (expected at Adventures/<adv>/<adv> - Adventure Hub)
    const adventureHubPath = `Adventures/${adv}/${adv} - Adventure Hub`;
    let hubPage = dv.page(adventureHubPath);
    let displayName = hubPage ? hubPage.file.name.replace(/ - Adventure Hub$/, "") : adv;
    const adventureLinkWithHeader = `### [[${adventureHubPath}|${displayName}]]`;

    // 4) Most recently edited note in Adventures/<adv>/Adventure
    const adventureNotes = dv.pages(`"Adventures/${adv}/Adventure"`);
    let recentAdventure = "Nothing is written...";
    if (adventureNotes.length > 0) {
      const sortedAdventure = adventureNotes.sort(p => p.file.mtime, 'desc');
      recentAdventure = dv.fileLink(sortedAdventure[0].file.path);
    }

    rows.push([adventureLinkWithHeader, recentSession, summaryLink, recentAdventure]);
  }

  dv.table(["Adventure", "Current Session", "Previously On...", "Recent Writings"], rows);

  // Center content vertically in all table cells.
  // Delay a bit to ensure the table is rendered.
  setTimeout(() => {
    document.querySelectorAll("table.dataview-table td, table.dataview-table th").forEach(cell => {
      cell.style.verticalAlign = "middle";
    });
  }, 100);
})();

```
```meta-bind-button
label: New Player Character!
icon: ""
style: destructive
class: ""
cssStyle: ""
backgroundImage: ""
tooltip: Create a New Character
id: newcreature
hidden: false
actions:
  - type: runTemplaterFile
    templateFile: Extras/Templates/playercharacter_template.md

```

>[!success] ## All Active Players
> ```dataview
> table Species, Race, Class, Subclass, level as "Level", Alignment, adventures as "Adventures"
> from "World/People/Player Characters/Active"
> ```

>[!danger] ### All Inactive Players
> ```dataview
> table adventures, species, race, class, level, alignment
> from "World/People/Player Characters/Inactive"
> 
> ```

>[!done] #  Recently Edited World and Compendium Notes
>
> `BUTTON[newcreature]`  `BUTTON[newitem]`  `BUTTON[newplace]`  `BUTTON[newNPC]`
> ```dataviewjs
> const categories = [
>   { title: "Bestiary", folder: "Compendium/Bestiary" },
>   { title: "Items", folder: "Compendium/Items" },
>   { title: "Spells", folder: "Compendium/Spells" },
>   { title: "Places", folder: "World/Places" },
>   { title: "Factions", folder: "People/Factions" },
>   { title: "NPCs", folder: "World/People/Non-Player Characters" }
> ];
> 
> let rows = [];
> 
> // For each category, find the single most recently edited note.
> for (const cat of categories) {
>   // Sort by last modified time (descending) and limit to 1
>   const pages = dv.pages(`"${cat.folder}"`)
>     .sort(p => p.file.mtime, 'desc')
>     .limit(1);
> 
>   // If no pages found, skip
>   if (pages.length === 0) continue;
> 
>   // Only one page in `pages` now
>   const page = pages[0];
>   // Format the last edited date
>   const lastEdited = new Date(page.file.mtime).toLocaleDateString();
> 
>   rows.push([
>     cat.title,               // Category name
>     dv.fileLink(page.file.path), // Note link
>     lastEdited
>   ]);
> }
> 
> // Build a single table with columns: Category, Name, Last Edited
> dv.table(["Category", "Name", "Last Edited"], rows);
> 
> ```
```meta-bind-button
label: New Creature
icon: ""
style: default
class: ""
cssStyle: ""
backgroundImage: ""
tooltip: Create a New Creature
id: newcreature
hidden: true
actions:
  - type: runTemplaterFile
    templateFile: Extras/Templates/newcreature_template.md

```

```meta-bind-button
label: New Item
icon: ""
style: default
class: ""
cssStyle: ""
backgroundImage: ""
tooltip: Create a New Item
id: newitem
hidden: true
actions:
  - type: runTemplaterFile
    templateFile: Extras/Templates/newitem_template.md

```

```meta-bind-button
label: New Place
icon: ""
style: default
class: ""
cssStyle: ""
backgroundImage: ""
tooltip: Create a New Place
id: newplace
hidden: true
actions:
  - type: runTemplaterFile
    templateFile: Extras/Templates/newplace_template.md

```

```meta-bind-button
label: New NPC
icon: ""
style: default
class: ""
cssStyle: ""
backgroundImage: ""
tooltip: Create a New NPC
id: newNPC
hidden: true
actions:
  - type: runTemplaterFile
    templateFile: Extras/Templates/npc_template.md

```
