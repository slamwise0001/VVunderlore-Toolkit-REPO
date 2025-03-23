---
Name: Lomin Topplesquirt
Species: Half-Elf
Size: 
Alignment: Chaotic Neutral
Type: 
hp: 3
ac: 12
Strength: 15
Dexterity: 15
Constitution: 12
Intelligence: 11
Wisdom: 8
Charisma: 16
Skill Proficiencies: 
ST Proficiencies: 
Languages: 
Spells:
  - "[[Grease]]"
  - "[[Create Or Destroy Water]]"
  - "[[Poison Spray]]"
Location: Thunderburg
aliases: Ol' Squirty, Loomin Lomin
Factions: null
Affiliates: Chixlum the Handsy
Appearances: 
---


# Lomin Topplesquirt
_Half-Elf Cleric, Chaotic Neutral

**Appears In:** The Testing of VVunderlore

_Lomin was a sad old man who got his last name in exactly the way you're thinking he did. End of biography._

---
> [!infobox]
> # More Info
> **Primary Location:** [[Thunderburg]]
> **Aliases:** Ol' Squirty, Loomin Lomin
> **Factions:** [[null]]
> **Affiliates:** [[Chixlum the Handsy]]
>
> # Abilities
> ```dataviewjs
> const page = dv.current();
> dv.el("div", `
> | STR     | DEX | CON | INT | WIS | CHA |
> |---------|-------|----------|---|---|---|
> | ${Math.floor((page.Strength - 10)/2)} | ${Math.floor((page.Dexterity - 10)/2)} | ${Math.floor((page.Constitution - 10)/2)} | ${Math.floor((page.Intelligence - 10)/2)} | ${Math.floor((page.Wisdom - 10)/2)} | ${Math.floor((page.Charisma - 10)/2)} |
> `);
> ```


### Spells
```dataviewjs
// This block renders the spells table from the frontmatter Spells field
const spells = dv.current().Spells;
if (spells && Array.isArray(spells) && spells.length > 0) {
  const spellTableData = spells.map(spellItem => {
    const spellString = typeof spellItem === 'string' ? spellItem : String(spellItem);
    const match = spellString.match(/^\[\[(.*?)\]\]$/);
    if (!match) { return { name: spellString, level: 'N/A', casting_time: 'N/A', range: 'N/A', save: '-' }; }
    let linkPart = match[1];
    let [rawTarget, displayName] = linkPart.split('|');
    if (!displayName) {
      displayName = rawTarget.replace(/\.md$/i, '').split('/').pop();
    }
    rawTarget = rawTarget.replace(/\.md$/i, '');
    if (rawTarget.startsWith('/')) { rawTarget = rawTarget.slice(1); }
    const spellLink = `<a href='/${rawTarget}.md' class='internal-link'>${displayName}</a>`;
    const spellPage = dv.page(rawTarget);
    return {
      name: spellLink,
      level: spellPage?.level ?? 'N/A',
      casting_time: spellPage?.casting_time ?? 'N/A',
      range: spellPage?.range ?? 'N/A',
      save: spellPage?.save?.trim() ?? '-'
    };
  }).sort((a, b) => a.level - b.level);
  let tableRows = spellTableData.map(spell => `
    <tr>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.name}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.level}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.casting_time}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.range}</td>
      <td style='border: 1px solid #ccc; padding: 5px;'>${spell.save}</td>
    </tr>
  `).join('');
  const tableHTML = `
  <table style='width: 100%; border-collapse: collapse;'>
    <thead>
      <tr>
        <th style='border: 1px solid #ccc; padding: 5px;'>Spell</th>
        <th style='border: 1px solid #ccc; padding: 5px;'>Level</th>
        <th style='border: 1px solid #ccc; padding: 5px;'>Casting Time</th>
        <th style='border: 1px solid #ccc; padding: 5px;'>Range</th>
        <th style='border: 1px solid #ccc; padding: 5px;'>Saving Throw</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  `;
  dv.el('div', tableHTML);
} else { dv.el('div', 'No spells found.'); }
```

