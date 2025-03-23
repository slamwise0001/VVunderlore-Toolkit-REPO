async function create_adventure() {
    // Prompt for adventure name
    const adventureName = await tp.system.prompt("Enter Adventure Name:");
    if (!adventureName) return;

    // Define paths
    const basePath = `Adventures/${adventureName}`;
    const sessionNotesPath = `${basePath}/Session Notes`;
    const templatePath = "Extras/Templates";
    const newTemplatePath = `${templatePath}/(${adventureName})sessiontemplate.md`;

    // Ensure the folders exist
    const foldersToCreate = [
        basePath,
        `${basePath}/Adventure`,
        `${basePath}/Materials`,
        sessionNotesPath
    ];

    for (const folder of foldersToCreate) {
        if (!(await app.vault.adapter.exists(folder))) {
            await app.vault.createFolder(folder);
        }
    }

    // Copy and rename Adventure Hub template
    const hubTemplatePath = `${templatePath}/Adventure Hub Template.md`;
    const hubDestination = `${basePath}/${adventureName} - Adventure Hub.md`;

    if (await app.vault.adapter.exists(hubTemplatePath)) {
        let hubContent = await app.vault.read(hubTemplatePath);
        hubContent = hubContent.replaceAll("{{ADVENTURE_NAME}}", adventureName);
        await app.vault.create(hubDestination, hubContent);
    } else {
        new Notice("Adventure Hub Template not found!", 4000);
        return;
    }

    // Copy and rename Session Template
    const baseSessionTemplatePath = `${templatePath}/(base)sessiontemplate.md`;

    if (await app.vault.adapter.exists(baseSessionTemplatePath)) {
        let sessionTemplateContent = await app.vault.read(baseSessionTemplatePath);
        sessionTemplateContent = sessionTemplateContent
            .replaceAll("{{SESSION_NOTES_PATH}}", sessionNotesPath)
            .replaceAll("{{TEMPLATE_PATH}}", newTemplatePath);
        await app.vault.create(newTemplatePath, sessionTemplateContent);
    } else {
        new Notice("Base Session Template not found!", 4000);
        return;
    }

    new Notice(`Adventure "${adventureName}" Created Successfully!`);
}

module.exports = create_adventure;
