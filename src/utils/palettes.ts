/**
 * Colour palettes available site-wide.
 *
 * Each palette MUST have matching CSS variable blocks in
 * `src/styles/theme.css` ([data-palette="<id>"][data-theme="light"|"dark"]).
 * To add a palette: add a CSS block + one entry here.
 */
export const PALETTES = ["default", "pixel"] as const;

export type Palette = (typeof PALETTES)[number];

export const DEFAULT_PALETTE: Palette = "default";

/** Human-readable labels shown by the palette switcher. */
export const PALETTE_LABELS: Record<Palette, string> = {
  default: "Default",
  pixel: "Pixel",
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
