
```dataviewjs
const container = dv.container;
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.gap = "10px";
container.style.marginBottom = "20px";

const dropdownContainer = document.createElement('div');
dropdownContainer.style.display = "flex";
dropdownContainer.style.flexWrap = "wrap";
dropdownContainer.style.gap = "15px";
container.appendChild(dropdownContainer);

const controlContainer = document.createElement('div');
controlContainer.style.display = "flex";
controlContainer.style.flexDirection = "column";
controlContainer.style.gap = "10px";
container.appendChild(controlContainer);

const separator = document.createElement("div");
separator.innerHTML = "<hr>";
container.appendChild(separator);

// Create a small spacer div with two blank lines
const filterSpacer = document.createElement("div");
filterSpacer.innerHTML = "<br><br>";

// Insert the spacer before we append the filtersLine
container.appendChild(filterSpacer);

const filtersLine = document.createElement("div");
filtersLine.style.fontWeight = "bold";
filtersLine.style.marginBottom = "10px";
container.appendChild(filtersLine);

const marker = document.createElement("div");
marker.id = "table-marker";
container.appendChild(marker);

let levelModified = false,
    schoolModified = false,
    damageModified = false,
    attackModified = false;

// We'll use this to remember the selected sort option
let currentSortOption = "a-z";

function updateFiltersLine() {
  const levelSelection = Array.from(levelGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const schoolSelection = Array.from(schoolGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const damageSelection = Array.from(damageTypeGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const attackSelection = Array.from(attackTypeGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  
  let filterTexts = [];
  
  if (levelModified && levelSelection.length > 0) {
    if (levelSelection.includes("All")) {
      filterTexts.push("<b>All Spell Levels</b>");
    } else {
      filterTexts.push("<b>" + levelSelection.join(", ") + "</b>");
    }
  }
  if (schoolModified && schoolSelection.length > 0) {
    if (schoolSelection.includes("All")) {
      filterTexts.push("<b>All Spell Schools</b>");
    } else {
      filterTexts.push("<b>" + schoolSelection.join(", ") + "</b>");
    }
  }
  if (damageModified && damageSelection.length > 0) {
    if (damageSelection.includes("All")) {
      filterTexts.push("<b>All Damage Types</b>");
    } else {
      filterTexts.push("<b>" + damageSelection.join(", ") + "</b>");
    }
  }
  if (attackModified && attackSelection.length > 0) {
    if (attackSelection.includes("All")) {
      filterTexts.push("<b>All Attack Types</b>");
    } else {
      filterTexts.push("<b>" + attackSelection.join(", ") + "</b>");
    }
  }
  
  filtersLine.innerHTML = filterTexts.join(", ");
}

function createDropdownCheckboxGroup(options, groupName, title) {
  const groupDiv = document.createElement('div');
  groupDiv.style.position = "relative";
  groupDiv.style.flex = "1";
  groupDiv.style.minWidth = "175px";
  groupDiv.style.maxWidth = "75%";
  
  const titleLabel = document.createElement('h4');
  titleLabel.textContent = title;
  titleLabel.style.margin = "0 0 5px 0";
  titleLabel.style.color = "#fff";
  groupDiv.appendChild(titleLabel);
  
  const dropdownButton = document.createElement('button');
  dropdownButton.innerHTML = `Select ${title}`;
  dropdownButton.style.padding = "8px";
  dropdownButton.style.border = "1px solid #444";
  dropdownButton.style.borderRadius = "4px";
  dropdownButton.style.cursor = "pointer";
  dropdownButton.style.backgroundColor = "#444";
  dropdownButton.style.color = "#fff";
  dropdownButton.style.width = "100%";
  dropdownButton.style.textAlign = "left";
  groupDiv.appendChild(dropdownButton);
  
  const dropdownContent = document.createElement('div');
  dropdownContent.style.display = "none";
  dropdownContent.style.position = "absolute";
  dropdownContent.style.backgroundColor = "#333";
  dropdownContent.style.border = "1px solid #444";
  dropdownContent.style.borderRadius = "4px";
  dropdownContent.style.padding = "10px";
  dropdownContent.style.width = "100%";
  dropdownContent.style.zIndex = "9999";
  dropdownContent.style.maxHeight = "200px";
  dropdownContent.style.overflowY = "auto";
  
  options.forEach(option => {
    const label = document.createElement('label');
    label.style.color = "#fff";
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = option;
    checkbox.name = groupName;
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + option));
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.marginBottom = "5px";
    label.style.padding = "5px";
    label.style.borderRadius = "3px";
    label.style.cursor = "pointer";
    
    label.addEventListener('mouseover', () => label.style.backgroundColor = "#555");
    label.addEventListener('mouseout', () => label.style.backgroundColor = "transparent");
    
    dropdownContent.appendChild(label);
  });
  
  dropdownButton.addEventListener('click', function() {
    dropdownContent.style.display = (dropdownContent.style.display === "none") ? "block" : "none";
  });
  
  document.addEventListener('click', function(event) {
    if (!groupDiv.contains(event.target)) {
      dropdownContent.style.display = "none";
    }
  });
  
  groupDiv.appendChild(dropdownContent);
  return groupDiv;
}
  

let levelSet = [...new Set(dv.pages('"Compendium/Spells"').map(p => p.level))].sort((a, b) => a - b);
let schoolSet = [...new Set(dv.pages('"Compendium/Spells"').map(p => p.school))].sort();
  
let damageTypeOptions = ['All'].concat(['Fire', 'Cold', 'Lightning', 'Necrotic', 'Radiant', 'Force', 'Poison', 'Acid', 'Psychic', 'Bludgeoning', 'Piercing', 'Slashing']);
let attackTypeOptions = ['All'].concat(['Melee', 'Ranged']);
  
const levelGroup = createDropdownCheckboxGroup(['All'].concat(levelSet.map(l => `Level ${l}`)), 'level', 'Spell Level');
const schoolGroup = createDropdownCheckboxGroup(['All'].concat(schoolSet), 'school', 'Spell School');
const damageTypeGroup = createDropdownCheckboxGroup(damageTypeOptions, 'damageType', 'Damage Type');
const attackTypeGroup = createDropdownCheckboxGroup(attackTypeOptions, 'attackType', 'Attack Type');
  
dropdownContainer.appendChild(levelGroup);
dropdownContainer.appendChild(schoolGroup);
dropdownContainer.appendChild(damageTypeGroup);
dropdownContainer.appendChild(attackTypeGroup);
  

levelGroup.querySelectorAll('input').forEach(cb => {
  cb.addEventListener('change', () => { levelModified = true; updateFiltersLine(); });
});
schoolGroup.querySelectorAll('input').forEach(cb => {
  cb.addEventListener('change', () => { schoolModified = true; updateFiltersLine(); });
});
damageTypeGroup.querySelectorAll('input').forEach(cb => {
  cb.addEventListener('change', () => { damageModified = true; updateFiltersLine(); });
});
attackTypeGroup.querySelectorAll('input').forEach(cb => {
  cb.addEventListener('change', () => { attackModified = true; updateFiltersLine(); });
});
  
const goButton = document.createElement('button');
goButton.innerHTML = "MALOSO VOBISCUM ET CUM SPIRITUM";
goButton.style.marginTop = "10px";
goButton.style.padding = "8px 15px";
goButton.style.border = "none";
goButton.style.backgroundColor = "#444";
goButton.style.color = "#fff";
goButton.style.cursor = "pointer";
goButton.style.borderRadius = "4px";
goButton.addEventListener('mouseover', () => goButton.style.backgroundColor = "#555");
goButton.addEventListener('mouseout', () => goButton.style.backgroundColor = "#444");
controlContainer.appendChild(goButton);

const resetButton = document.createElement('button');
resetButton.innerHTML = "Reset Filters";
resetButton.style.marginTop = "10px";
resetButton.style.padding = "8px 15px";
resetButton.style.border = "none";
resetButton.style.backgroundColor = "#444";
resetButton.style.color = "#fff";
resetButton.style.cursor = "pointer";
resetButton.style.borderRadius = "4px";
resetButton.addEventListener('mouseover', () => resetButton.style.backgroundColor = "#555");
resetButton.addEventListener('mouseout', () => resetButton.style.backgroundColor = "#444");
controlContainer.appendChild(resetButton);

// Ensure "Reset Filters" starts below the "Go" button
const buttonSeparator = document.createElement("hr");
controlContainer.appendChild(goButton);
controlContainer.appendChild(buttonSeparator);
controlContainer.appendChild(resetButton);

// Prevent duplicate "Clear and Reset" buttons
let clearButton = null;

/**
 * Build a Dataview query code block based on selected filters
 */
function buildDataviewQuery(selectedLevels, selectedSchools, selectedDamageTypes, selectedAttackTypes) {
  let conditions = [];

  // Helper to parse "Level 0" -> 0
  function parseLevel(str) {
    return parseInt(str.replace("Level ", "").trim(), 10);
  }

  // Build conditions based on filters (ignoring "All")
  if (selectedLevels.length > 0 && !selectedLevels.includes("All")) {
    const orClauses = selectedLevels.map(l => `level = ${parseLevel(l)}`);
    conditions.push(`(${orClauses.join(" or ")})`);
  }
  if (selectedSchools.length > 0 && !selectedSchools.includes("All")) {
    const orClauses = selectedSchools.map(sch => `school = "${sch}"`);
    conditions.push(`(${orClauses.join(" or ")})`);
  }
  if (selectedDamageTypes.length > 0 && !selectedDamageTypes.includes("All")) {
    const orClauses = selectedDamageTypes.map(dt => `damage_type = "${dt}"`);
    conditions.push(`(${orClauses.join(" or ")})`);
  }
  if (selectedAttackTypes.length > 0 && !selectedAttackTypes.includes("All")) {
    const orClauses = selectedAttackTypes.map(at => `attack_type = "${at}"`);
    conditions.push(`(${orClauses.join(" or ")})`);
  }

  let dash = "—";

  let query = "```dataview\n";
  query +=
    "table without id " +
    "link(file.path, file.name) as \"Name\", " +
    `default(level, "${dash}") as "Level", ` +
    `default(save, "${dash}") as "Saving Throw", ` +
    `default(duration, "${dash}") as "Duration", ` +
    `default(casting_time, "${dash}") as "Casting Time", ` +
    `default(range, "${dash}") as "Range", ` +
    `default(damage_type, "${dash}") as "Damage Type", ` +
    `default(school, "${dash}") as "School", ` +
    `default(attack_type, "${dash}") as "Attack Type"\n`;
  query += 'from "Compendium/Spells"\n';

  if (conditions.length > 0) {
    query += "where " + conditions.join(" and ") + "\n";
  }

  query += "sort file.name asc\n";
  query += "```\n";

  return query;
}

/**
 * Copies the built Dataview code to clipboard
 */
function copyAsDataviewCode(actualTableContainer) {
  const selectedLevels = Array.from(levelGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const selectedSchools = Array.from(schoolGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const selectedDamageTypes = Array.from(damageTypeGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const selectedAttackTypes = Array.from(attackTypeGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const codeBlock = buildDataviewQuery(selectedLevels, selectedSchools, selectedDamageTypes, selectedAttackTypes);
  navigator.clipboard.writeText(codeBlock).then(() => {
    new Notice("Dataview code copied!");
  }).catch(err => {
    console.error(err);
    new Notice("Failed to copy Dataview code.");
  });
}

/**
 * Filters and sorts the spells, then renders the table
 */
function updateTable() {
  const selectedLevels = Array.from(levelGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const selectedSchools = Array.from(schoolGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const selectedDamageTypes = Array.from(damageTypeGroup.querySelectorAll('input:checked')).map(cb => cb.value);
  const selectedAttackTypes = Array.from(attackTypeGroup.querySelectorAll('input:checked')).map(cb => cb.value);

  // Convert dv.pages(...) to a plain array for reliable filter + sort
  let allSpells = dv.pages('"Compendium/Spells"').array();

  // Filter by checkboxes (ignoring "All")
  let filteredSpells = allSpells.filter(spell => {
    // Filter by level
    if (selectedLevels.length > 0 && !selectedLevels.includes("All")) {
      if (!selectedLevels.includes(`Level ${spell.level}`)) {
        return false;
      }
    }
    // Filter by school
    if (selectedSchools.length > 0 && !selectedSchools.includes("All")) {
      if (!selectedSchools.includes(spell.school)) {
        return false;
      }
    }
    // Filter by damage type
    if (selectedDamageTypes.length > 0 && !selectedDamageTypes.includes("All")) {
      if (!selectedDamageTypes.includes(spell.damage_type)) {
        return false;
      }
    }
    // Filter by attack type
    if (selectedAttackTypes.length > 0 && !selectedAttackTypes.includes("All")) {
      if (!selectedAttackTypes.includes(spell.attack_type)) {
        return false;
      }
    }
    return true;
  });

  // Remove the old table if it exists
  let next = marker.nextSibling;
  while (next) {
    let toRemove = next;
    next = next.nextSibling;
    toRemove.remove();
  }

  // Create a container for the new table & buttons
  const tableContainer = document.createElement('div');
  marker.insertAdjacentElement("afterend", tableContainer);
  
  const buttonBar = document.createElement("div");
  buttonBar.style.display = "flex";
  buttonBar.style.gap = "10px";
  buttonBar.style.marginBottom = "10px";
  tableContainer.appendChild(buttonBar);
  
  // Sort dropdown (left of Copy button)
  const sortDropdown = document.createElement("select");
  sortDropdown.style.padding = "6px 12px";
  sortDropdown.style.border = "1px solid #444";
  sortDropdown.style.backgroundColor = "#333";
  sortDropdown.style.color = "#fff";
  sortDropdown.style.cursor = "pointer";
  sortDropdown.style.borderRadius = "4px";
  
  const optionAZ = document.createElement("option");
  optionAZ.value = "a-z";
  optionAZ.text = "a-z";
  sortDropdown.appendChild(optionAZ);
  
  const optionLevel = document.createElement("option");
  optionLevel.value = "level";
  optionLevel.text = "by level";
  sortDropdown.appendChild(optionLevel);
  
  const optionDamage = document.createElement("option");
  optionDamage.value = "damage";
  optionDamage.text = "alpha by damage type";
  sortDropdown.appendChild(optionDamage);
  
  const optionSchool = document.createElement("option");
  optionSchool.value = "school";
  optionSchool.text = "alpha by school";
  sortDropdown.appendChild(optionSchool);
  
  // Reflect current selection
  sortDropdown.value = currentSortOption;
  
  // Re-sort whenever user changes dropdown
  sortDropdown.addEventListener("change", () => {
    currentSortOption = sortDropdown.value;
    updateTable();
  });
  
  buttonBar.appendChild(sortDropdown);
  
  // "Copy as Dataview Code" button
  const dvBtn = document.createElement("button");
  dvBtn.textContent = "Copy as Dataview Code";
  dvBtn.style.padding = "6px 12px";
  dvBtn.style.border = "1px solid #444";
  dvBtn.style.backgroundColor = "#333";
  dvBtn.style.color = "#fff";
  dvBtn.style.cursor = "pointer";
  dvBtn.style.borderRadius = "4px";
  dvBtn.addEventListener("mouseover", () => dvBtn.style.backgroundColor = "#444");
  dvBtn.addEventListener("mouseout", () => dvBtn.style.backgroundColor = "#333");
  buttonBar.appendChild(dvBtn);

  // Perform the sort according to currentSortOption
  if (currentSortOption === "a-z") {
    // Sort by file name
    filteredSpells.sort((a, b) => 
      (a.file.name || "").toLowerCase().localeCompare((b.file.name || "").toLowerCase())
    );
  } else if (currentSortOption === "level") {
    // Sort by level numerically
    filteredSpells.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
  } else if (currentSortOption === "damage") {
    // Sort by damage_type alphabetically
    filteredSpells.sort((a, b) =>
      (a.damage_type || "").toLowerCase().localeCompare((b.damage_type || "").toLowerCase())
    );
  } else if (currentSortOption === "school") {
    // Sort by school alphabetically
    filteredSpells.sort((a, b) =>
      (a.school || "").toLowerCase().localeCompare((b.school || "").toLowerCase())
    );
  }

  // Finally, render the table
  const actualTableContainer = document.createElement("div");
  tableContainer.appendChild(actualTableContainer);
  
  if (filteredSpells.length === 0) {
    dv.paragraph("No spells match your filter criteria.", actualTableContainer);
  } else {
    dv.table(
      [
        "Name", 
        "Action", 
        "Level", 
        "Saving Throw", 
        "Duration", 
        "Casting Time", 
        "Range", 
        "Damage Type", 
        "School", 
        "Attack Type"
      ],
      filteredSpells.map(spell => [
        spell.file.link,
        `<button style="padding: 4px 8px; border: 1px solid #444; background-color: #333; color: #fff; cursor: pointer; border-radius: 4px;">Add to Spellbook</button>`,
        spell.level,
        spell.save || "—",
        spell.duration || "—",
        spell.casting_time || "—",
        spell.range || "—",
        spell.damage_type || "—",
        spell.school || "—",
        spell.attack_type || "—"
      ]),
      actualTableContainer
    );
  }
  
  // Handle clicks on the "Copy as Dataview Code" button
  dvBtn.addEventListener("click", () => {
    copyAsDataviewCode(actualTableContainer);
  });
}

/**
 * "Go" button logic
 */
goButton.addEventListener('click', function () {
  updateTable();

  // Ensure "Clear and Reset" button only appears once
  if (!clearButton) {
    clearButton = document.createElement('button');
    clearButton.innerHTML = "Clear and Reset";
    clearButton.style.marginTop = "10px";
    clearButton.style.padding = "8px 15px";
    clearButton.style.border = "none";
    clearButton.style.backgroundColor = "#d9534f";
    clearButton.style.color = "#fff";
    clearButton.style.cursor = "pointer";
    clearButton.style.borderRadius = "4px";

    clearButton.addEventListener('mouseover', () => clearButton.style.backgroundColor = "#c9302c");
    clearButton.addEventListener('mouseout', () => clearButton.style.backgroundColor = "#d9534f");

    clearButton.addEventListener("click", function () {
      // Clear all checkboxes
      levelGroup.querySelectorAll('input').forEach(cb => cb.checked = false);
      schoolGroup.querySelectorAll('input').forEach(cb => cb.checked = false);
      damageTypeGroup.querySelectorAll('input').forEach(cb => cb.checked = false);
      attackTypeGroup.querySelectorAll('input').forEach(cb => cb.checked = false);

      // Reset tracking variables
      levelModified = false;
      schoolModified = false;
      damageModified = false;
      attackModified = false;

      // Clear filters display
      updateFiltersLine();

      // Remove the generated table
      let next = marker.nextSibling;
      while (next) {
        let toRemove = next;
        next = next.nextSibling;
        toRemove.remove();
      }

      // Remove the "Clear and Reset" button itself
      clearButton.remove();
      clearButton = null;
    });

    // Insert "Clear and Reset" below "Reset Filters"
    controlContainer.appendChild(clearButton);
  }
});

/**
 * "Reset Filters" button logic
 */
resetButton.addEventListener('click', function() {
  levelGroup.querySelectorAll('input').forEach(cb => cb.checked = false);
  schoolGroup.querySelectorAll('input').forEach(cb => cb.checked = false);
  damageTypeGroup.querySelectorAll('input').forEach(cb => cb.checked = false);
  attackTypeGroup.querySelectorAll('input').forEach(cb => cb.checked = false);

  levelModified = false;
  schoolModified = false;
  damageModified = false;
  attackModified = false;
  updateFiltersLine();
});

```



