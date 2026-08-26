#!/usr/bin/env node
/**
 * Bookmark HTML import script
 * Usage: pnpm bookmarks:import ./bookmarks.html
 * Parses Netscape bookmark format and merges into src/data/bookmarks.json
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const INPUT = process.argv[2];
const OUTPUT = resolve("src/data/bookmarks.json");

if (!INPUT) {
  console.error("Usage: node scripts/import-bookmarks.mjs <bookmarks.html> [--replace]");
  process.exit(1);
}

const replace = process.argv.includes("--replace");
const html = await readFile(resolve(INPUT), "utf-8");

// Extract DT > A and preceding H3 folder as category
// Bookmark file structure: <DT><H3>Folder</H3><DL><p> ... <DT><A HREF="url" ADD_DATE="...">title</A>
const folderRegex = /<DT><H3[^>]*>([^<]+)<\/H3>\s*<DL><p>/gi;
const linkRegex = /<DT><A\s+[^>]*HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi;

function parseBookmarks(htmlStr) {
  let currentCategory = "未分类";
  const results = [];

  // Build folder position map
  const folderPositions = [];
  let m;
  while ((m = folderRegex.exec(htmlStr)) !== null) {
    folderPositions.push({ index: m.index, name: m[1].trim() });
  }

  // For each link, find nearest preceding folder
  while ((m = linkRegex.exec(htmlStr)) !== null) {
    const url = m[1].trim();
    const title = m[2].trim();
    if (!url || url.startsWith("place:") || url.startsWith("javascript:")) continue;

    // find category by checking folders before this link index
    const preceding = folderPositions.filter(f => f.index < m.index).pop();
    if (preceding) currentCategory = preceding.name;
    else currentCategory = "未分类";

    // Try to extract description after ADD_DATE etc? fallback empty
    // Look ahead for <DD> description
    const after = htmlStr.slice(m.index, m.index + 500);
    const ddMatch = after.match(/<DD>([^<]*)/i);
    const description = ddMatch ? ddMatch[1].trim() : "";

    results.push({
      title: title || url,
      url,
      description,
      category: currentCategory,
      tags: [],
      addedAt: new Date().toISOString().slice(0, 10),
    });
  }
  return results;
}

const parsed = parseBookmarks(html);
console.log(`Parsed ${parsed.length} bookmarks from ${INPUT}`);

let existing = [];
try {
  const raw = await readFile(OUTPUT, "utf-8");
  existing = JSON.parse(raw);
  if (!Array.isArray(existing)) existing = [];
} catch {
  existing = [];
}

let merged;
if (replace) {
  merged = parsed;
} else {
  const urlSet = new Set(existing.map(b => b.url));
  const deduped = parsed.filter(b => !urlSet.has(b.url));
  merged = [...existing, ...deduped];
  console.log(`Deduped: ${parsed.length - deduped.length} duplicates skipped, ${deduped.length} new`);
}

await writeFile(OUTPUT, JSON.stringify(merged, null, 2) + "\n", "utf-8");
console.log(`Wrote ${merged.length} total bookmarks to ${OUTPUT}`);
