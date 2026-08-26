/**
 * Background images available site-wide.
 * Auto-discovers every file in `src/assets/bg/` – just drop a file there and it works.
 * `none` means pure color background (no image).
 */

// Vite glob: eagerly imports all images in src/assets/bg at build time.
// Works in both Astro frontmatter (SSR) and client scripts (Vite).
const bgModules = import.meta.glob("@/assets/bg/*.{png,jpg,jpeg,webp,avif,svg}", {
  eager: true,
}) as Record<string, { default: { src: string } } | { src: string } | string>;

function extractSrc(mod: unknown): string {
  if (typeof mod === "string") return mod;
  if (mod && typeof mod === "object") {
    const m = mod as Record<string, unknown>;
    if (typeof m.src === "string") return m.src;
    if (m.default && typeof m.default === "object") {
      const d = m.default as Record<string, unknown>;
      if (typeof d.src === "string") return d.src;
    }
    if (typeof m.default === "string") return m.default as string;
  }
  return "";
}

const discoveredEntries = Object.entries(bgModules)
  .map(([path, mod]) => {
    const file = path.split("/").pop() ?? "";
    const id = file.replace(/\.[^.]+$/, "");
    const src = extractSrc(mod);
    return [id, src] as const;
  })
  .filter(([id, src]) => id && src)
  .sort(([a], [b]) => a.localeCompare(b));

export const BG_IMAGES: Record<string, string> = {
  none: "",
  ...Object.fromEntries(discoveredEntries),
};

export const BACKGROUNDS = ["none", ...discoveredEntries.map(([id]) => id)] as const;

export type Background = (typeof BACKGROUNDS)[number];

export const DEFAULT_BACKGROUND: Background = "none";

function labelFor(id: string): string {
  if (id === "none") return "无背景";
  const m = /^bg(\d+)$/.exec(id);
  if (m) return `背景 ${m[1]}`;
  // fallback: capitalize file name, e.g. "sunset" -> "Sunset"
  return id.charAt(0).toUpperCase() + id.slice(1);
}

export const BACKGROUND_LABELS: Record<string, string> = Object.fromEntries(
  BACKGROUNDS.map(id => [id, labelFor(id)])
) as Record<Background, string>;

export function isBackground(value: unknown): value is Background {
  return (
    typeof value === "string" &&
    (BACKGROUNDS as readonly string[]).includes(value)
  );
}

export function nextBackground(current: Background): Background {
  const index = BACKGROUNDS.indexOf(current);
  return BACKGROUNDS[(index + 1) % BACKGROUNDS.length] as Background;
}
