#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

interface ManifestEntry {
  key: string;
  path: string;
  requires?: string[];
}

function main() {
  const manifestPath = path.resolve(__dirname, '../manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  // include both files and folders
  const entries: ManifestEntry[] = [
    ...(manifest.folders || []),
    ...(manifest.files   || [])
  ];
  const allKeys = new Set(entries.map(e => e.key));
  let hasError = false;

  // 1. Ensure every `requires` key exists
  for (const e of entries) {
    for (const reqKey of e.requires || []) {
      if (!allKeys.has(reqKey)) {
        console.error(`✖ Missing required key: "${reqKey}" (required by "${e.path}" → key="${e.key}")`);
        hasError = true;
      }
    }
  }

  // 2. Detect cycles (DFS on key graph)
  const adj = new Map<string, string[]>(
    entries.map(e => [e.key, e.requires || []])
  );

  const visited = new Set<string>();
  const inStack = new Set<string>();

  function dfs(key: string): boolean {
    if (inStack.has(key)) {
      console.error(`✖ Cycle detected involving key "${key}"`);
      return true;
    }
    if (visited.has(key)) return false;

    visited.add(key);
    inStack.add(key);

    for (const depKey of adj.get(key)!) {
      if (dfs(depKey)) return true;
    }

    inStack.delete(key);
    return false;
  }

  for (const key of adj.keys()) {
    if (dfs(key)) {
      hasError = true;
      break;
    }
  }

  if (hasError) {
    console.error('Manifest validation failed.');
    process.exit(1);
  } else {
    console.log('✔ Manifest validation passed.');
  }
}

main();
