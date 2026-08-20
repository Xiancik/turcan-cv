// Content build: reads content/*.yml and rewrites text between
//   <!-- copy:FILE.KEY.SUBKEY -->...<!-- /copy -->
// markers in every .html file at the repo root and in projects/.
//
// Edit prose in content/*.yml, run `npm run build`, commit the changed HTML.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, relative, resolve, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const ROOT = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(ROOT, "content");

// Directories to scan for .html files. Everything else is left alone.
const SCAN_DIRS = ["", "projects", "projects/automation-bots"];

// Directories to skip entirely if we ever recurse.
const SKIP = new Set(["node_modules", ".git", "notify", "pl1-candidates", "plate-candidates"]);

const MARKER_RE = /<!--\s*copy:([a-zA-Z0-9_.-]+)\s*-->([\s\S]*?)<!--\s*\/copy\s*-->/g;

async function loadContent() {
  const files = await readdir(CONTENT_DIR).catch(() => []);
  const map = {};
  for (const f of files) {
    if (extname(f) !== ".yml" && extname(f) !== ".yaml") continue;
    const name = basename(f, extname(f));
    const raw = await readFile(join(CONTENT_DIR, f), "utf8");
    map[name] = parseYaml(raw) ?? {};
  }
  return map;
}

function lookup(obj, path) {
  let cur = obj;
  for (const seg of path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[seg];
  }
  return cur;
}

function toReplacement(value) {
  if (value == null) return null;
  if (typeof value === "string") return value.replace(/\s+$/, "");
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null; // arrays/objects not supported as content values yet
}

async function listHtml(dir) {
  const abs = join(ROOT, dir);
  const entries = await readdir(abs, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((e) => e.isFile() && extname(e.name) === ".html")
    .map((e) => join(abs, e.name));
}

async function processFile(path, content, usedKeys) {
  const before = await readFile(path, "utf8");
  let missing = [];
  const after = before.replace(MARKER_RE, (match, key, inner) => {
    const segs = key.split(".");
    const value = lookup(content, segs);
    const replacement = toReplacement(value);
    if (replacement === null) {
      missing.push(key);
      return match;
    }
    usedKeys.add(key);
    return `<!-- copy:${key} -->${replacement}<!-- /copy -->`;
  });
  const rel = relative(ROOT, path).replaceAll("\\", "/");
  if (missing.length) {
    for (const k of missing) console.warn(`  ! ${rel}: no value for copy:${k}`);
  }
  if (after !== before) {
    await writeFile(path, after);
    console.log(`  wrote ${rel}`);
  }
}

function collectYamlKeys(obj, prefix, out) {
  if (obj == null) return;
  if (typeof obj !== "object" || Array.isArray(obj)) {
    out.add(prefix.join("."));
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    collectYamlKeys(v, [...prefix, k], out);
  }
}

async function main() {
  const content = await loadContent();
  const files = (await Promise.all(SCAN_DIRS.map(listHtml))).flat();
  console.log(`Scanning ${files.length} html file(s)…`);
  const usedKeys = new Set();
  for (const f of files) await processFile(f, content, usedKeys);

  // Warn about yaml keys that never appeared in any marker.
  const declared = new Set();
  for (const [name, tree] of Object.entries(content)) {
    collectYamlKeys(tree, [name], declared);
  }
  const unused = [...declared].filter((k) => !usedKeys.has(k));
  if (unused.length) {
    console.warn("Unused content keys:");
    for (const k of unused) console.warn(`  - ${k}`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
