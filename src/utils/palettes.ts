/**
 * Colour palettes available site-wide.
 *
 * Each palette MUST have matching CSS variable blocks in
 * `src/styles/theme.css` ([data-palette="<id>"][data-theme="light"|"dark"]).
 * To add a palette: add a CSS block + one entry here.
 */
export const PALETTES = [
  "default",
  "pixel",
  "dark-plus",
  "dracula",
  "everforest",
  "github-dark",
  "github-light",
  "gruvbox-dark",
  "gruvbox-light",
  "nord",
  "catppuccin",
  "tokyo-night",
  "kanagawa",
  "one-dark",
] as const;

export type Palette = (typeof PALETTES)[number];

export const DEFAULT_PALETTE: Palette = "default";

/** Human-readable labels shown by the palette switcher. */
export const PALETTE_LABELS: Record<Palette, string> = {
  default: "Default",
  pixel: "Pixel",
  "dark-plus": "Dark Plus",
  dracula: "Dracula",
  everforest: "Everforest",
  "github-dark": "Github Dark",
  "github-light": "Github Light",
  "gruvbox-dark": "Gruvbox Dark",
  "gruvbox-light": "Gruvbox Light",
  nord: "Nord",
  catppuccin: "Catppuccin",
  "tokyo-night": "Tokyo Night",
  kanagawa: "Kanagawa",
  "one-dark": "One Dark Pro",
};

export function isPalette(value: unknown): value is Palette {
  return (
    typeof value === "string" && (PALETTES as readonly string[]).includes(value)
  );
}

/** Next palette in the list (wraps around). Used by the cycle button. */
export function nextPalette(current: Palette): Palette {
  const index = PALETTES.indexOf(current);
  return PALETTES[(index + 1) % PALETTES.length];
}
