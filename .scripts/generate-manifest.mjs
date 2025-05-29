// generate-manifest.mjs
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import fs from 'fs';
import fm from 'front-matter';
import { basename, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = resolve(__dirname, '..');
const OUTPUT_PATH = join(ROOT_DIR, 'manifest.json');

const EXCLUDED = new Set([
	'.git',
	'.github',
	'.obsidian',
	'.DS_Store',
	'.version.json',
	'README.md',
	'plugins',
	'Compendium',
	'.gitignore',
	'.gitattributes',
	'.scripts',
	'.gitkeep.txt',
]);

const OPTIONAL = new Set([
	"Adventures/The Testing of VVunderlore",
    "Adventures/The Testing of VVunderlore/Adventure",
    "Adventures/The Testing of VVunderlore/Materials",
    "Adventures/The Testing of VVunderlore/Session Notes",
	"Extras/Images",
    "Extras/Images/NPCs",
    "Extras/Images/Player Characters",
    "Extras/Images/icons",
	"World/People/Player Characters/Inactive/Burrata Ensalada.md",
    "World/Places/EXAMPLE - Tower of Struug Nur.md",
	"World/People/Non-Player Characters/Lomin Topplesquirt.md",
    "World/People/Player Characters/Active/Chixlum the Handsy.md",
    "World/People/Player Characters/Active/Munch Tippledew.md",
	"Extras/Templates/(The Testing of VVunderlore)sessiontemplate.md",
	"Extras/PC Dashboards/dash-Burrata Ensalada.md",
    "Extras/PC Dashboards/dash-Chixlum the Handsy.md",
    "Extras/PC Dashboards/dash-Munch Tippledew.md",
    "Extras/SYS/The Testing of VVunderlore_summary.md",
	"Adventures/The Testing of VVunderlore/Adventure/Chapter 1 - A Man with a Dream.md",
    "Adventures/The Testing of VVunderlore/Materials/.gitkeep.txt",
    "Adventures/The Testing of VVunderlore/Session Notes/Session 1 - 3.18.25.md",
    "Adventures/The Testing of VVunderlore/Session Notes/Session 2 - 3.19.25.md",
    "Adventures/The Testing of VVunderlore/Session Notes/Session 3 - 2.25.25.md",
    "Adventures/The Testing of VVunderlore/The Testing of VVunderlore - Adventure Hub.md",
    "Welcome.md"
]);

const manifest = {
	files: [],
	folders: []
};

function walk(dir, relative = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (EXCLUDED.has(entry.name)) continue;

    const fullPath     = join(dir, entry.name);
    const relativePath = join(relative, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      // Try to read a folder-level frontmatter file if you have one,
      // otherwise derive from the folder name.
      const defaultKey  = relativePath.replace(/\//g, '-').toLowerCase();
      const defaultName = entry.name;
      let folderAttrs = {};

      // e.g. if you keep a _folder.md inside each folder with front-matter:
      const fmFile = join(fullPath, '_folder.md');
      if (fs.existsSync(fmFile)) {
        const raw = fs.readFileSync(fmFile, 'utf8');
        folderAttrs = fm(raw).attributes;
      }

      manifest.folders.push({
        path:        relativePath,
        optional:    OPTIONAL.has(relativePath),
        key:         folderAttrs.key         || defaultKey,
        displayName: folderAttrs.displayName || defaultName,
        requires:    folderAttrs.requires    || [],
      });

      walk(fullPath, relativePath);

    } else if (entry.isFile()) {
      const raw       = fs.readFileSync(fullPath, 'utf8');
      const { attributes } = fm(raw);

      const defaultKey  = relativePath.replace(/\//g, '-').replace(/\.[^.]+$/, '').toLowerCase();
      const defaultName = attributes.title || basename(relativePath, extname(relativePath));

      manifest.files.push({
        path:        relativePath,
        optional:    OPTIONAL.has(relativePath),
        key:         attributes.key         || defaultKey,
        displayName: attributes.displayName || defaultName,
        requires:    attributes.requires    || [],
      });
    }
  }
}


walk(ROOT_DIR);

manifest.files.sort((a, b) => a.path.localeCompare(b.path));
manifest.folders.sort((a, b) => a.path.localeCompare(b.path));

fs.writeFileSync(
	OUTPUT_PATH,
	JSON.stringify(manifest, null, 2)
);

console.log(`✅ Generated manifest with ${manifest.files.length} files and ${manifest.folders.length} folders.`);



