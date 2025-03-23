---
Doc Lock: false
Adventure: The Testing of VVunderlore
Location: My Obsidian Vault
session: 3
session_date: 2.25.25
day: "14"
month: March
year: "2025"
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
    templateFile: "Extras/Templates/(The Testing of VVunderlore)sessiontemplate.md"
    folderPath: "Adventures/The Testing of VVunderlore/Session Notes"
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
      const folderPath = `Adventures/The Testing of VVunderlore/Session Notes`;
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
      const folderPath = `Adventures/The Testing of VVunderlore/Session Notes`;
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
      const folderPath = `Adventures/The Testing of VVunderlore/Session Notes`;
      
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
#### [[The Testing of VVunderlore_summary|Last time on...]]

>[!abstract]- Previously on...
>
## 🛠️ Prep
---
- take this party to the mat they are asking too many questions about things I haven't written yet
- drop like 50 shambling mounds on them
- give everyone OP magical items and watch them tear the world down
- find a goblin baby that was sent by god to assassinate one of the party members because they stole away with gods daughter but really she wanted to run away to become a librarian

---
## 📝 Session Notes



---
### ☑️ Summary

##### Takeaways

##### Next Session


