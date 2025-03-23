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
 
 `BUTTON[chixlum,Munch]`
 
```meta-bind-button
label: Chixlum the Handy
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: chixlum
style: default
actions:
  - type: replaceInNote
    fromLine: 69
    toLine: 69
    replacement: |
      ![[dash-Chixlum the Handsy#Chixlum the Handsy]]
      
```
```meta-bind-button
label: Munch Tippledew
icon: ""
hidden: true
class: meta-bind-button
tooltip: ""
id: Munch
style: default
actions:
  - type: replaceInNote
    fromLine: 69
    toLine: 69
    replacement: |
      ![[dash-Munch Tippledew#Munch Tippledew]]
      
```
>[!info] Player Stats
![[dash-Munch Tippledew#Munch Tippledew]]

































