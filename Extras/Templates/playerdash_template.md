## {{PlayerName}}
```dataviewjs
const character = dv.page("World/People/Player Characters/Active/{{PlayerName}}");

if (character) {
    const species = character.Species || "N/A";
    const className = character.Class || "N/A";
    const subclass = character.Subclass || "N/A";
    const hpMax = character.hp || "N/A";
    const hpCurrent = character.current_hp || "N/A";
    const alignment = character.Alignment || "N/A";
    const skillProfs = character["Skill Proficiencies"] || [];
    const stProfs = character["ST Proficiencies"] || [];
    const proficiencyBonus = Number(character["Proficiency Bonus"]) || 0;
    const wisdom = character.wisdom || 10; // default to 10 if not found, for safety
    


    const combinedProfs = [...skillProfs, ...stProfs]; 
    const keyItems = character["key_items"] || [];
    const spells = character.spells || [];

    // Helper function to extract the display name from a link
    const getDisplayName = (link) => {
        if (typeof link === "string" && link.includes("|")) {
            return link.split("|")[1].replace("]]", "").trim();
        }
        if (typeof link === "object" && link.path) {
            return link.path.split("/").pop().replace(".md", "").trim();
        }
        return link.toString().trim(); // Fallback in case it's a plain string
    };

    // Extract display names for Species, Class, and Subclass
    const speciesName = getDisplayName(species);
    const classNameDisplay = getDisplayName(className);
    const subclassName = getDisplayName(subclass);

    // Preprocess the links
    const speciesLink = species && species.path
        ? `<a href="${species.path}" class="internal-link">${speciesName}</a>`
        : speciesName;

    const classLink = className && className.path
        ? `<a href="${className.path}" class="internal-link">${classNameDisplay}</a>`
        : classNameDisplay;

    const subclassLink = subclass && subclass.path
        ? `<a href="${subclass.path}" class="internal-link">${subclassName}</a>`
        : subclassName;

    // Create an object to hold table data
    const infoTableData = {
        species: speciesLink,
        class: classLink,
        subclass: subclassLink,
        alignment: alignment,
        proficiencies: combinedProfs.join(", ") || "None"
    };

    // Left section with character info and name
    dv.el("div", "", { style: "flex: 1;" }).innerHTML = `<h2>${character.Name}</h2>`;

    // Build the table including the new Passive Perception column
    const infoTable = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ccc; padding: 5px;">Species</th>
                    <th style="border: 1px solid #ccc; padding: 5px;">Class</th>
                    <th style="border: 1px solid #ccc; padding: 5px;">Subclass</th>
                    <th style="border: 1px solid #ccc; padding: 5px;">Alignment</th>
                    <th style="border: 1px solid #ccc; padding: 5px;">Proficiencies</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 5px;">${infoTableData.species}</td>
                    <td style="border: 1px solid #ccc; padding: 5px;">${infoTableData.class}</td>
                    <td style="border: 1px solid #ccc; padding: 5px;">${infoTableData.subclass}</td>
                    <td style="border: 1px solid #ccc; padding: 5px;">${infoTableData.alignment}</td>
                    <td style="border: 1px solid #ccc; padding: 5px;">${infoTableData.proficiencies}</td>
                </tr>
            </tbody>
        </table>
    `;
    dv.el("div", "").innerHTML = infoTable;

	// Key Items
if (keyItems.length > 0) {
    const keyItemsFormatted = keyItems.map(item => {
        // If item is an object with a path, it's a link
        if (typeof item === 'object' && item.path) {
            const itemName = item.path.split('/').pop().replace('.md', '');
            return `<a href="/${item.path}" class="internal-link">${itemName}</a>`;
        }

        // If item is a string and contains a wiki-link pattern [[...]]
        if (typeof item === 'string' && item.includes('[[') && item.includes(']]')) {
            // Extract the inner part of the link: [[something]] or [[something|display]]
            const inner = item.replace(/\[\[|\]\]/g, ''); 
            let [itemPath, itemName] = inner.split('|');
            if (!itemName) itemName = itemPath; // If no display name, use the path itself

            return `<a href="/${itemPath}" class="internal-link">${itemName.trim()}</a>`;
        }

        // Otherwise, just return the plain text item
        return item.toString();
    });

    dv.el("div", "").innerHTML = `<p><strong>Key Items:</strong> ${keyItemsFormatted.join(", ")}</p>`;
} else {
    dv.el("div", "").innerHTML = `<p><strong>Key Items:</strong> None</p>`;
}


	dv.el("hr", "");

    // Spells
    if (spells.length > 0) {
        const spellTableData = spells.map(spell => {
            const spellPage = dv.page(spell.path); 
            let spellName = spellPage ? spellPage.file.name.replace(".md", "") : spell.path;

            if (typeof spell === 'string' && spell.includes('|')) {
                const splitSpell = spell.split('|');
                spellName = splitSpell[1].replace(']]', '');
            }

            const spellLink = `<a href="/Compendium/Spells/${spellName}.md" class="internal-link">${spellName}</a>`;

            return {
                name: spellLink,
                level: spellPage ? spellPage.level : "N/A",
                casting_time: spellPage ? spellPage.casting_time : "N/A",
                range: spellPage ? spellPage.range : "N/A",
                save: spellPage?.save?.trim() || "-"

            };
        }).sort((a, b) => a.level - b.level); 

        const spellTable = `
            <h3>Spells</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ccc; padding: 5px;">Spell</th>
                        <th style="border: 1px solid #ccc; padding: 5px;">Level</th>
                        <th style="border: 1px solid #ccc; padding: 5px;">Casting Time</th>
                        <th style="border: 1px solid #ccc; padding: 5px;">Range</th>
                        <th style="border: 1px solid #ccc; padding: 5px;">Saving Throw</th>
                    </tr>
                </thead>
                <tbody>
                    ${spellTableData.map(spell => `
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 5px;">${spell.name}</td>
                            <td style="border: 1px solid #ccc; padding: 5px;">${spell.level}</td>
                            <td style="border: 1px solid #ccc; padding: 5px;">${spell.casting_time}</td>
                            <td style="border: 1px solid #ccc; padding: 5px;">${spell.range}</td>
                            <td style="border: 1px solid #ccc; padding: 5px;">${spell.save}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
        dv.el("div", "").innerHTML = spellTable;
    } else {
        dv.el("div", "").innerHTML = ``;
    }

    
	    
}
```
