// .scripts/generate-manifest.mjs
import fs from 'fs';
import { join, basename, extname } from 'path';

const EXCLUDED = new Set(['.git', '.github', 'node_modules']);
const OPTIONAL = new Set([
  // list any paths you treat as optional…
]);

const manifest = {
  folders: [],
  files: [],
};

function makeDefaultKey(relPath) {
  return relPath
    .replace(/[/\\]/g, '-')
    .replace(/\.[^.]+$/, '')
    .toLowerCase();
}

function makeDefaultDisplayName(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function walk(dir, relative = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (EXCLUDED.has(entry.name)) continue;

    const fullPath     = join(dir, entry.name);
    const relativePath = join(relative, entry.name).replace(/\\/g, '/');
    const key          = makeDefaultKey(relativePath);
    const displayName  = makeDefaultDisplayName(entry.name);
    const optional     = OPTIONAL.has(relativePath);

    if (entry.isDirectory()) {
      manifest.folders.push({
        path:        relativePath,
        optional,
        key,
        displayName,
        requires:    [],
      });
      walk(fullPath, relativePath);

    } else if (entry.isFile()) {
      manifest.files.push({
        path:        relativePath,
        optional,
        key,
        displayName,
        requires:    [],
      });
    }
  }
}

// Generate from repo root
walk(process.cwd());

// Write out the JSON
fs.writeFileSync(
  'manifest.json',
  JSON.stringify(manifest, null, 2),
  'utf8'
);
console.log('✅ manifest.json generated');
