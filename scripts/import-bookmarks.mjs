#!/usr/bin/env node
/**
 * Bookmark HTML import — hierarchical (stack) parser
 * Usage: pnpm bookmarks:import <html> [--replace]
 * Preserves full folder path -> categoryPath, level, topCategory/subCategory, ADD_DATE & ICON
 */
import { readFile, writeFile, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

const INPUT = process.argv[2];
const OUTPUT = resolve("src/data/bookmarks.json");
const FOLDERS_OUTPUT = resolve("src/data/bookmarkFolders.json");

if (!INPUT) {
  console.error("Usage: node scripts/import-bookmarks.mjs <bookmarks.html> [--replace]");
  process.exit(1);
}

const replace = process.argv.includes("--replace");
const html = await readFile(resolve(INPUT), "utf-8");

function getAttr(tag, name) {
  const re = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i");
  const m = tag.match(re);
  return m ? m[1] : "";
}

function toISODate(addDate) {
  if (!addDate) return new Date().toISOString().slice(0, 10);
  const ts = parseInt(addDate, 10);
  if (!Number.isFinite(ts) || ts <= 0) return new Date().toISOString().slice(0, 10);
  // Netscape ADD_DATE is seconds since epoch
  const ms = ts * 1000;
  // sanity: if ts > 1e12 already ms, handle
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function stripRoot(path) {
  // Hide single-child container chain: 收藏夹栏 -> workpace
  let p = [...path];
  if (p[0] === "收藏夹栏") p = p.slice(1);
  if (p[0] === "workpace") p = p.slice(1);
  if (p.length === 0) {
    // bookmark directly under 收藏夹栏 (e.g. 加入 GitHub)
    // keep original leaf as single level
    if (path.length > 0) return [path[path.length - 1]];
    return ["未分类"];
  }
  return p;
}

function parse(htmlStr) {
  const stack = [];
  const folderPaths = new Set(); // stores full original path strings joined by "/"
  const foldersMeta = new Map(); // pathStr -> { name, fullPath, strippedPath, level, addDate }
  const results = [];

  let i = 0;
  const len = htmlStr.length;

  while (i < len) {
    const nextH3 = htmlStr.indexOf("<DT><H3", i);
    const nextA = htmlStr.indexOf("<DT><A", i);
    const nextClose = htmlStr.indexOf("</DL><p>", i);

    let minIdx = Infinity;
    let type = null;
    if (nextH3 !== -1 && nextH3 < minIdx) { minIdx = nextH3; type = "h3"; }
    if (nextA !== -1 && nextA < minIdx) { minIdx = nextA; type = "a"; }
    if (nextClose !== -1 && nextClose < minIdx) { minIdx = nextClose; type = "close"; }

    if (minIdx === Infinity) break;
    i = minIdx;

    if (type === "h3") {
      const end = htmlStr.indexOf("</H3>", i);
      if (end === -1) { i += 8; continue; }
      const closeIdx = end + 5;
      const tag = htmlStr.slice(i, closeIdx);
      const nameMatch = tag.match(/<H3[^>]*>([^<]+)<\/H3>/i);
      const name = nameMatch ? nameMatch[1].trim() : "未命名";
      const addDate = getAttr(tag, "ADD_DATE");
      // push
      stack.push(name);
      const fullPath = [...stack];
      const fullStr = fullPath.join("/");
      const stripped = stripRoot(fullPath);
      const strippedStr = stripped.join("/");
      folderPaths.add(fullStr);
      if (!foldersMeta.has(fullStr)) {
        foldersMeta.set(fullStr, {
          name,
          fullPath,
          strippedPath: stripped,
          strippedStr,
          level: stripped.length,
          addDate: toISODate(addDate),
          directCount: 0,
        });
      }
      i = closeIdx;
      // skip following <DL><p> if immediately after (don't need to handle)
      const after = htmlStr.slice(i, i + 20);
      if (after.startsWith("<DL><p>") || after.trimStart().startsWith("<DL><p>")) {
        // leave DL open to be handled as structural, but we already pushed; next loop will skip it
      }
    } else if (type === "a") {
      const end = htmlStr.indexOf("</A>", i);
      if (end === -1) { i += 7; continue; }
      const closeIdx = end + 4;
      const tag = htmlStr.slice(i, closeIdx);
      const href = getAttr(tag, "HREF");
      const addDate = getAttr(tag, "ADD_DATE");
      const icon = getAttr(tag, "ICON");
      const titleMatch = tag.match(/>([^<]+)<\/A>/);
      const title = titleMatch ? titleMatch[1].trim() : href;

      if (!href || href.startsWith("place:") || href.startsWith("javascript:")) {
        i = closeIdx;
        continue;
      }

      // description via <DD> after
      const afterSlice = htmlStr.slice(closeIdx, closeIdx + 800);
      const ddMatch = afterSlice.match(/<DD>([^<]*)/i);
      const description = ddMatch ? ddMatch[1].trim() : "";

      // derive categoryPath (stripped)
      let fullPathForBookmark = [...stack];
      // if stack empty -> 未分类
      if (fullPathForBookmark.length === 0) fullPathForBookmark = ["未分类"];

      const strippedPath = stripRoot(fullPathForBookmark);
      const category = strippedPath[strippedPath.length - 1] || "未分类";
      const topCategory = strippedPath[0] || "未分类";
      const subCategory = strippedPath.length > 1 ? strippedPath[1] : "";
      const level = strippedPath.length;

      // parent path (full without leaf) for reference
      const fullPathStr = fullPathForBookmark.join("/");
      const strippedStr = strippedPath.join("/");

      results.push({
        title: title || href,
        url: href.trim(),
        description,
        category,
        categoryPath: strippedPath,
        fullPath: fullPathForBookmark,
        fullPathStr,
        strippedStr,
        topCategory,
        subCategory,
        level,
        tags: [],
        addedAt: toISODate(addDate),
        icon,
      });

      // increment directCount for foldersMeta if exists
      const folderKey = fullPathForBookmark.join("/");
      const meta = foldersMeta.get(folderKey);
      if (meta) meta.directCount = (meta.directCount || 0) + 1;

      i = closeIdx;
    } else if (type === "close") {
      if (stack.length > 0) stack.pop();
      i += 8; // "</DL><p>".length
    } else {
      i += 1;
    }

    // skip over "<DL><p>" opens (they don't affect stack except via push already)
    // To avoid infinite loop on DL opens, advance past them if at current i
    if (htmlStr.slice(i, i + 7) === "<DL><p>") {
      i += 7;
    }
  }

  // Produce folders list including empty folders, exclude pure container workpace
  const hiddenRoots = new Set(["workpace", "收藏夹栏/workpace"]);
  const folders = [];
  for (const [fullStr, meta] of foldersMeta.entries()) {
    if (hiddenRoots.has(fullStr)) continue;
    // also skip stripped empty (already handled) and workpace stripped alone handled via hiddenRoots
    if (!meta.strippedStr) continue;
    const isEmpty = (meta.directCount || 0) === 0;
    folders.push({
      name: meta.name,
      fullPath: meta.fullPath,
      fullPathStr: fullStr,
      strippedPath: meta.strippedPath,
      strippedStr: meta.strippedStr,
      level: meta.level,
      addDate: meta.addDate,
      directCount: meta.directCount || 0,
      isEmpty,
    });
  }
  // keep insertion order (HTML order) — do not sort

  return { bookmarks: results, folders };
}

const { bookmarks: parsed, folders: parsedFolders } = parse(html);
console.log(`Parsed ${parsed.length} bookmarks, ${parsedFolders.length} folders from ${INPUT}`);
console.log(`Empty folders: ${parsedFolders.filter(f => f.isEmpty).length} (will be shown as empty)`);

// backup existing bookmarks.json if exists and replace mode
if (replace && existsSync(OUTPUT)) {
  const bak = OUTPUT + ".bak";
  try {
    await copyFile(OUTPUT, bak);
    console.log(`Backed up existing -> ${bak}`);
  } catch {}
}

let existing = [];
let existingFolders = [];
try {
  const raw = await readFile(OUTPUT, "utf-8");
  const data = JSON.parse(raw);
  if (Array.isArray(data)) existing = data;
  else if (data && Array.isArray(data.bookmarks)) existing = data.bookmarks;
} catch { existing = []; }

try {
  const rawF = await readFile(FOLDERS_OUTPUT, "utf-8");
  existingFolders = JSON.parse(rawF);
  if (!Array.isArray(existingFolders)) existingFolders = [];
} catch { existingFolders = []; }

let merged;
let mergedFolders;

if (replace) {
  merged = parsed;
  mergedFolders = parsedFolders;
} else {
  // merge without dedup per requirement (don't dedup), but still merge folders
  // Per current requirement: do not dedup bookmarks at all
  merged = [...existing, ...parsed];
  // folders dedup by strippedStr
  const seen = new Set(existingFolders.map(f => f.strippedStr || f.fullPathStr));
  const newFolders = parsedFolders.filter(f => !seen.has(f.strippedStr));
  mergedFolders = [...existingFolders, ...newFolders];
  console.log(`Merged (no dedup): ${existing.length} existing + ${parsed.length} new = ${merged.length}`);
}

await writeFile(OUTPUT, JSON.stringify(merged, null, 2) + "\n", "utf-8");
console.log(`Wrote ${merged.length} bookmarks to ${OUTPUT}`);

await writeFile(FOLDERS_OUTPUT, JSON.stringify(mergedFolders, null, 2) + "\n", "utf-8");
console.log(`Wrote ${mergedFolders.length} folders to ${FOLDERS_OUTPUT}`);
