---
Doc Lock: false
Adventure: ${adventureName}
Location: 
session: 
session_date: 
day: 
month: 
year:
---
# 🏔 `= this.Adventure + " - Session " + this.session`

**`= this.location`***
```dataviewjs 


const dayField = dv.current().day;
const monthField = dv.current().month;
const yearField = dv.current().year;

if (!dayField || !monthField || !yearField) {
  dv.el("em", "In-game date not set yet.");
} else {

  const days = Array.isArray(dayField) ? dayField : [dayField];
  const months = Array.isArray(monthField) ? monthField : [monthField];
  const years = Array.isArray(yearField) ? yearField : [yearField];


  const finalYear = years.length > 0 ? years[0] : "????";

  function getDaySuffix(d) {
    if (d % 100 >= 11 && d % 100 <= 13) return d + "th";
    switch (d % 10) {
      case 1: return d + "st";
      case 2: return d + "nd";
      case 3: return d + "rd";
      default: return d + "th";
    }
  }

  function formatOneDayMonth(dayNum, monthStr) {
    return `${getDaySuffix(dayNum)} day of ${monthStr}`;
  }

  function joinWithAnd(list) {
    if (list.length === 0) return "";
    if (list.length === 1) return list[0];
    if (list.length === 2) return list.join(" and ");
    // For 3 or more, do commas plus final "and"
    return list.slice(0, -1).join(", ") + ", and " + list[list.length - 1];
  }

  let daysAndMonthsStr = "";

  if (days.length === months.length && days.length > 1) {
    const pairs = [];
    for (let i = 0; i < days.length; i++) {
      pairs.push(formatOneDayMonth(days[i], months[i]));
    }
    daysAndMonthsStr = joinWithAnd(pairs);

  } else if (days.length > 1 && months.length === 1) {
    const dayStrings = days.map(d => getDaySuffix(d));
    const joinedDays = joinWithAnd(dayStrings);
    daysAndMonthsStr = `${joinedDays} day${days.length > 1 ? "s" : ""} of ${months[0]}`;

  } else if (days.length === 1 && months.length > 1) {
    const pieces = months.map(m => formatOneDayMonth(days[0], m));
    daysAndMonthsStr = joinWithAnd(pieces);

  } else if (days.length === 1 && months.length === 1) {
    daysAndMonthsStr = formatOneDayMonth(days[0], months[0]);

  } else {
    daysAndMonthsStr = "Mixed or mismatched days/months (update the code logic).";
  }

  const finalString = `${daysAndMonthsStr}, ${finalYear}`;

  const container = dv.el("p", "");
  container.innerHTML = `<em>${finalString}</em>`;
}

```
---
`BUTTON[previous,current,next,new]`
```meta-bind-button
label: NEW SESSION!
icon: ""
hidden: true
class: ""
tooltip: Create a new session note
id: new
style: primary
actions:
  - type: templaterCreateNote
    templateFile: "Extras/Templates/(${adventureName})sessiontemplate.md"
    folderPath: "Adventures/${adventureName}/Session Notes"
    fileName: ""
    openNote: true
```
---
```meta-bind-button
label: Previous Session
icon: ""
hidden: true
class: meta-bind-button
tooltip: "Go to the previous session note"
id: previous
style: default
actions:
  - type: inlineJS
    code: |
      const folderPath = `Adventures/${adventureName}/Session Notes`;
      const currentTitle = app.workspace.activeLeaf.view.file.basename;
      const filePattern = /Session (\d+)/;
      const match = currentTitle.match(filePattern);

      if (match && match[1]) {
        const sessionNumber = parseInt(match[1]) - 1;
        const previousSessionTitle = `Session ${sessionNumber}`;
        
        const files = app.vault.getAbstractFileByPath(folderPath)?.children || [];
        const previousNote = files.find(file => file.basename.startsWith(previousSessionTitle));

        if (previousNote) {
          app.workspace.activeLeaf.openFile(previousNote);
        } else {
          alert("Previous session does not exist.");
        }
      }
```
```meta-bind-button
label: Next Session
icon: ""
hidden: true
class: meta-bind-button
tooltip: "Go to the next session note"
id: next
style: default
actions:
  - type: inlineJS
    code: |
      const folderPath = `Adventures/${adventureName}/Session Notes`;
      const currentTitle = app.workspace.activeLeaf.view.file.basename;
      const filePattern = /Session (\d+)/;
      const match = currentTitle.match(filePattern);

      if (match && match[1]) {
        const sessionNumber = parseInt(match[1]) + 1;
        const nextSessionTitle = `Session ${sessionNumber}`;
        
        const files = app.vault.getAbstractFileByPath(folderPath)?.children || [];
        const nextNote = files.find(file => file.basename.startsWith(nextSessionTitle));

        if (nextNote) {
          app.workspace.activeLeaf.openFile(nextNote);
        } else {
          alert("Next session does not exist.");
        }
      }
```
```meta-bind-button
label: Current Session
icon: ""
hidden: true
class: meta-bind-button
tooltip: "Go to the most recent session note"
id: current
style: destructive
actions:
  - type: inlineJS
    code: |
      const folderPath = `Adventures/${adventureName}/Session Notes`;
      
      // Get all notes in the folder and filter for those matching "Session X" format
      const files = app.vault.getAbstractFileByPath(folderPath)?.children || [];
      const sessionFiles = files
        .filter(file => file.basename.match(/Session \d+/))
        .sort((a, b) => {
          // Sort by session number in descending order
          const aNum = parseInt(a.basename.match(/Session (\d+)/)[1]);
          const bNum = parseInt(b.basename.match(/Session (\d+)/)[1]);
          return bNum - aNum;
        });
      
      if (sessionFiles.length > 0) {
        // Open the most recent session
        app.workspace.activeLeaf.openFile(sessionFiles[0]);
      } else {
        alert("No sessions found.");
      }
```
#### [[${adventureName}_summary|Last time on...]]

>[!abstract]- Previously on...
>
## 🛠️ Prep
---


---
## 📝 Session Notes



---
### ☑️ Summary

##### Takeaways

##### Next Session

<%*
// ------------------------
// Session Template with Modal Form Date Entry
// ------------------------

// 1. Define the folder path and scan for existing session notes
const folderPath = `Adventures/${adventureName}/Session Notes`; // Adjust if needed
const folder = app.vault.getAbstractFileByPath(folderPath);
const files = folder ? folder.children.filter(f => f.extension === "md") : [];
const filePattern = /Session (\d+) - (\d{1,2})\.(\d{1,2})\.(\d{2})/;  // Matches "Session X - mm.dd.yy"

let maxSessionNumber = 0;
let latestSessionDate = null;
files.forEach(file => {
  const match = file.name.match(filePattern);
  if (match) {
    const sessionNumber = parseInt(match[1]);
    const month = match[2];
    const day = match[3];
    const year = `20${match[4]}`;  // Convert yy to full year
    if (sessionNumber > maxSessionNumber) {
      maxSessionNumber = sessionNumber;
      latestSessionDate = new Date(`${year}-${month}-${day}`);
    }
  }
});

// 2. Determine a suggested date: if a previous session exists, add 7 days; otherwise, today + 7.
let suggestedDate = "";
if (latestSessionDate) {
  const nextDate = new Date(latestSessionDate);
  nextDate.setDate(nextDate.getDate() + 7);
  suggestedDate = `${nextDate.getMonth() + 1}.${nextDate.getDate()}.${String(nextDate.getFullYear()).slice(-2)}`;
} else {
  const today = new Date();
  today.setDate(today.getDate() + 7);
  suggestedDate = `${today.getMonth() + 1}.${today.getDate()}.${String(today.getFullYear()).slice(-2)}`;
}

// 3. Calculate the next session number
const nextSessionNumber = maxSessionNumber + 1;

// 4. Open the modal form for date entry (ID "next-session-date" with field "date")
const modalForm = app.plugins.plugins.modalforms.api;
const sessionResult = await modalForm.openForm("next-session-date");
if (!sessionResult) {
  new Notice("Form cancelled.");
  return;
}

// Retrieve the date as a string; if empty, use the suggested date.
// Also, if the input appears in ISO format (YYYY-MM-DD), convert it.
let sessionDateInput = String(sessionResult.date || "").trim();
if (!sessionDateInput) {
  sessionDateInput = suggestedDate;
} else if (sessionDateInput.includes("-")) {
  let parts = sessionDateInput.split("-");
  let year = parseInt(parts[0]);
  let month = parseInt(parts[1]); // Month is 1-indexed in the input.
  let day = parseInt(parts[2]);
  // Create the date using local time.
  let d = new Date(year, month - 1, day);
  sessionDateInput = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear().toString().slice(-2)}`;
}

let sessionDate = sessionDateInput;  // Now in the format M.D.YY

// 5. Rename the active note to "Session X - M.D.YY"
const newTitle = `Session ${nextSessionNumber} - ${sessionDate}`;
await tp.file.rename(newTitle);

// 6. Once all templates are executed, update the frontmatter and run extraction/insertion code.
tp.hooks.on_all_templates_executed(async () => {
  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("No active file found.");
    return;
  }

  // Update frontmatter with session number and date
  await app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["session"] = nextSessionNumber;
    frontmatter["session_date"] = sessionDate;
  });

  // --- Begin Extraction and Insertion Code ---
  let previousNote = null;
  let previousNoteContent = "";

  if (nextSessionNumber > 1) {
    const previousSessionNumber = nextSessionNumber - 1;
    const previousNotePattern = new RegExp(`^Session ${previousSessionNumber} - `);
    previousNote = files.find(f => previousNotePattern.test(f.name));

    if (previousNote) {
      previousNoteContent = await app.vault.read(previousNote);

      // Get previous note's frontmatter (day, month, year) if available.
      const prevFrontmatter = app.metadataCache.getFileCache(previousNote)?.frontmatter || {};
      const prevDay = prevFrontmatter.day || "";
      const prevMonth = prevFrontmatter.month || "";
      const prevYear = prevFrontmatter.year || "";

      await app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter.day = prevDay;
        frontmatter.month = prevMonth;
        frontmatter.year = prevYear;
      });
    } else {
      new Notice("Previous session note not found.");
    }
  } else {
    console.log("No previous session exists.");
  }
// Extract summary from the previous note and update the "Summary Temp" note.
  const summaryRegex = /### ☑️ Summary\s*\n([\s\S]*?)(?=\n##### Takeaways)/;
  const summaryMatch = previousNoteContent.match(summaryRegex);
  if (summaryMatch) {
    const summaryText = summaryMatch[1].trim();
    const newSummaryTempContent = summaryText;
    const summaryTempPath = "Extras/SYS/${adventureName}_summary.md";
    const summaryTempFile = app.vault.getAbstractFileByPath(summaryTempPath);
    if (summaryTempFile) {
      await app.vault.modify(summaryTempFile, newSummaryTempContent);
    } else {
      new Notice("Summary Temp note not found!");
    }
  } else {
    new Notice("Could not find summary text between '### ☑️ Summary' and '##### Takeaways' in the previous note.");
  }

  await new Promise(r => setTimeout(r, 250));
}); // <-- Ensure this closing bracket matches `tp.hooks.on_all_templates_executed`

%>
