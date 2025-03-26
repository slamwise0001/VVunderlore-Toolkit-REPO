```dataviewjs
const characters = dv.pages('"World/People/Player Characters/Active"');

// passive perception calc
function calcPassivePerception(page) {
    const wis = page.wisdom || 10;
    const wisMod = Math.floor((wis - 10) / 2);
    const skillProfs = page["Skill Proficiencies"] || [];
    const profBonus = Number(page["Proficiency Bonus"]) || 0;

    const isPerceptionProficient = skillProfs.map(s => s.toLowerCase()).includes("perception");
    return 10 + wisMod + (isPerceptionProficient ? profBonus : 0);
}

// table
dv.table(
    ["Name",  "PP", "AC", "HP (Current/Max)", "Walk Speed", "Alignment", "Languages"],
    characters.map(c => {
        const name = c.Name || c.file.link;
        const pp = calcPassivePerception(c);
        const ac = c.ac || "N/A";
        const hpMax = c.hp || "N/A";
        const hpCurrent = c.current_hp || hpMax;
        const speed = c.Speed || c.Speed;
        const alignment = c.Alignnment || c.Alignment;
        const languages = c.Languages 

        return [name, pp, ac, `${hpCurrent}/${hpMax}`, speed, alignment, languages];
    })
);

```
 
 `BUTTON[Player1,Player2,Player3,Player4,Player5,Player6,Player7,Player8,Player9,Player10]`
 
```meta-bind-button
label: Chixlum the Handy
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player1
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-Chixlum the Handsy#Chixlum the Handsy]]
      
```
```meta-bind-button
label: Munch Tippledew
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player2
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-Munch Tippledew#Munch Tippledew]]
      
```
```meta-bind-button
label: Player 3
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player3
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-NAME GOES HERE]]
      
```
```meta-bind-button
label: Player 4
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player4
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-NAME GOES HERE]]
      
```
```meta-bind-button
label: Player 5
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player5
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-NAME GOES HERE]]
      
```
```meta-bind-button
label: Player 6
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player6
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-NAME GOES HERE]]
      
```
```meta-bind-button
label: Player 7
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player7
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-NAME GOES HERE]]
      
```
```meta-bind-button
label: Player 8
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player8
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-NAME GOES HERE]]
      
```
```meta-bind-button
label: Player 9
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player9
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-NAME GOES HERE]]
      
```
```meta-bind-button
label: Player 10
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Player10
style: default
actions:
  - type: replaceInNote
    fromLine: 197
    toLine: 197
    replacement: |
      ![[dash-NAME GOES HERE]]
      
```
>[!info] Player Stats
![[dash-Chixlum the Handsy#Chixlum the Handsy]]




































































