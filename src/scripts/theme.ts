import {
  DEFAULT_PALETTE,
  PALETTE_LABELS,
  isPalette,
  nextPalette,
  type Palette,
} from "@/utils/palettes";

const THEME_KEY = "theme";
const PALETTE_KEY = "palette";
const LIGHT = "light";
const DARK = "dark";

function getPreferredTheme(): string {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

function getPreferredPalette(): Palette {
  const stored = localStorage.getItem(PALETTE_KEY);
  return isPalette(stored) ? stored : DEFAULT_PALETTE;
}

// Reuse the values already set by the inline FOUC-prevention script if available.
const preset = (
  window as unknown as { __theme?: { value: string; palette?: string } }
).__theme;

let themeValue: string = preset?.value ?? getPreferredTheme();
let paletteValue: Palette = isPalette(preset?.palette)
  ? preset.palette
  : getPreferredPalette();

function persist(): void {
  localStorage.setItem(THEME_KEY, themeValue);
  localStorage.setItem(PALETTE_KEY, paletteValue);
  reflect();
}

function reflect(): void {
  const root = document.firstElementChild;
  root?.setAttribute("data-theme", themeValue);
  root?.setAttribute("data-palette", paletteValue);
  root?.classList.toggle("dark", themeValue === DARK);
  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);
  document
    .querySelector("#palette-btn")
    ?.setAttribute("aria-label", paletteValue);

  // Update the palette switcher label.
  document.querySelectorAll("[data-palette-label]").forEach(el => {
    el.textContent = PALETTE_LABELS[paletteValue];
  });

  // Fill <meta name="theme-color"> with the computed background colour so
  // Android's browser chrome matches the page background.
  const bg = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

function setup(): void {
  reflect();
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    persist();
  });
  document.querySelector("#palette-btn")?.addEventListener("click", () => {
    paletteValue = nextPalette(paletteValue);
    persist();
  });
}

setup();

// Re-run after View Transitions navigation.
document.addEventListener("astro:after-swap", setup);

// Carry the theme-color value across View Transitions to prevent the
// Android navigation bar from flashing during page transitions.
document.addEventListener("astro:before-swap", event => {
  const color = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");
  if (color) {
    (event as { newDocument: Document }).newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", color);
  }
});

// Sync with OS-level dark/light preference changes.
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    themeValue = matches ? DARK : LIGHT;
    persist();
  });
