// .scripts/generate-manifest.mjs
import { fileURLToPath } from 'url';
import { dirname, resolve, join, basename, extname } from 'path';
import fs from 'fs';

const __filename   = fileURLToPath(import.meta.url);
const __dirname    = dirname(__filename);
const ROOT_DIR     = resolve(__dirname, '..');
const OUTPUT_PATH  = join(ROOT_DIR, 'manifest.json');

// Folders or files to skip entirely
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
  'manifest.json',
  '.gitkeep.txt',
  // your private WotC IP, demos, etc:
  'Adventures/WotC IP',
  'Adventures/Your-Homebrew-Demo',
  // …add any more you never want in the manifest
]);

// Paths to mark optional in the manifest
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
  files:   [],
  folders: []
};

/** 
 * Turn a relative path into a kebab-cased key (no extension, lowercase). 
 */
function makeDefaultKey(relPath) {
  return relPath
    .replace(/[/\\]/g, '-')
    .replace(/\.[^.]+$/, '')
    .toLowerCase();
}

/** 
 * Make a human-friendly Display Name from the file/folder name. 
 */
function makeDefaultDisplayName(name) {
  return name
    .replace(/\.[^.]+$/, '')    // strip extension
    .replace(/[-_]/g, ' ')      // dashes/underscores → spaces
    .replace(/\b\w/g, c => c.toUpperCase());  // Title Case
}

function walk(dir, relative = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip excluded names or paths
    const name         = entry.name;
    const relPath      = join(relative, name).replace(/\\/g, '/');
    if (EXCLUDED.has(name) || EXCLUDED.has(relPath)) continue;

    const fullPath     = join(dir, name);
    const key          = makeDefaultKey(relPath);
    const displayName  = makeDefaultDisplayName(name);
    const optional     = OPTIONAL.has(relPath);

    if (entry.isDirectory()) {
      manifest.folders.push({
        path:        relPath,
        optional,
        key,
        displayName,
        requires:    []
      });
      walk(fullPath, relPath);

    } else if (entry.isFile()) {
      manifest.files.push({
        path:        relPath,
        optional,
        key,
        displayName,
        requires:    []
      });
    }
  }
}

// Generate the manifest
walk(ROOT_DIR);

// Sort for consistency
manifest.files.sort  ((a, b) => a.path.localeCompare(b.path));
manifest.folders.sort((a, b) => a.path.localeCompare(b.path));

// ─── 1) Add parent-folder dependencies ────────────────────────────────────────────
function addParentDeps(manifest) {
  // Map folder paths → keys
  const folderMap = new Map(manifest.folders.map(f => [f.path, f.key]));

  // For every entry (folder or file), walk its path segments
  for (const entry of manifest.folders.concat(manifest.files)) {
    // Start with any existing requires
    const deps = new Set(entry.requires);

    // Split "Extras/Templates/foo.md" → ["Extras","Templates","foo.md"] then drop last
    const parts = entry.path.split('/').slice(0, -1);
    let acc = '';
    for (const segment of parts) {
      acc = acc ? `${acc}/${segment}` : segment;
      const parentKey = folderMap.get(acc);
      if (parentKey) deps.add(parentKey);
    }

    entry.requires = Array.from(deps);
  }
}

// ─── 2) Scan code & YAML files for quoted-path mentions ─────────────────────────────
function addCodeMentionsDeps(manifest) {
  // include .md so we catch templater calls & markdown links
  const CODE_EXTS = new Set(['.js', '.ts', '.mjs', '.json', '.yaml', '.yml', '.md']);
  const escapeRx  = s => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  // build path→key lookup once
  const pathMap = new Map(
    manifest.folders.concat(manifest.files).map(e => [e.path, e.key])
  );

  for (const entry of manifest.folders.concat(manifest.files)) {
    const ext  = extname(entry.path).toLowerCase();
    const full = join(ROOT_DIR, entry.path);
    // only scan code/YAML/MD files
    if (!fs.existsSync(full) || fs.lstatSync(full).isDirectory() || !CODE_EXTS.has(ext)) {
      continue;
    }

    const content = fs.readFileSync(full, 'utf8');
    const deps    = new Set(entry.requires);

    for (const [otherPath, otherKey] of pathMap) {
      if (otherPath === entry.path) continue;

      // Split off the extension (e.g. ".md")
      const ext   = extname(otherPath);
      const base  = otherPath.slice(0, -ext.length);

      // Build a regex that matches:
      //   (base) or (base.ext), inside quotes, backticks, or parentheses
      const pat = `(?:["'\\(\\\`])` +           // opening delimiter
                  `\\s*${escapeRx(base)}(?:${escapeRx(ext)})?` + // base + optional ext
                  `\\s*(?:["'\\)\\\`])`;         // closing delimiter

      const rx = new RegExp(pat);
      if (rx.test(content)) {
        deps.add(otherKey);
      }
    }
    entry.requires = Array.from(deps);
  }
}

// ─── 3) Scan code/YAML files for folder mentions only ─────────────────────────────────
function addFolderMentionsDeps(manifest) {
  // Only scan code and YAML files; skip pure Markdown
  const CODE_EXTS = new Set(['.js', '.ts', '.mjs', '.json', '.yaml', '.yml']);
  // Build a map of folder-path + "/" → folderKey
  const folderMap = new Map(
    manifest.folders.map(f => [f.path + '/', f.key])
  );

  // For each entry (file or folder)
  for (const entry of manifest.folders.concat(manifest.files)) {
    const ext  = extname(entry.path).toLowerCase();
    const full = join(ROOT_DIR, entry.path);
    // Skip non-existent, directories, and non-code/YAML files
    if (
      !fs.existsSync(full) ||
      fs.lstatSync(full).isDirectory() ||
      !CODE_EXTS.has(ext)
    ) {
      continue;
    }

    const content = fs.readFileSync(full, 'utf8');
    const deps    = new Set(entry.requires);

    // If any folder-path/ appears in the code, add that folder’s key
    for (const [folderPathSlash, folderKey] of folderMap) {
      if (content.includes(folderPathSlash)) {
        deps.add(folderKey);
      }
    }

    entry.requires = Array.from(deps);
  }
}



// ─── Invoke both helpers ─────────────────────────────────────────────────────────────
addParentDeps(manifest);
addCodeMentionsDeps(manifest);
addFolderMentionsDeps(manifest);
// ──────────────────────────────────────────────────────────────────────────────────────


// Write to disk
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✅ Generated manifest with ${manifest.files.length} files and ${manifest.folders.length} folders.`);
