import {
  DEFAULT_PALETTE,
  PALETTE_LABELS,
  isPalette,
  nextPalette,
  type Palette,
} from "@/utils/palettes";
import {
  BACKGROUND_LABELS,
  BG_IMAGES,
  DEFAULT_BACKGROUND,
  isBackground,
  nextBackground,
  type Background,
} from "@/utils/backgrounds";

const THEME_KEY = "theme";
const PALETTE_KEY = "palette";
const BG_KEY = "bg";
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

function getPreferredBackground(): Background {
  const stored = localStorage.getItem(BG_KEY);
  return isBackground(stored) ? stored : DEFAULT_BACKGROUND;
}

// Reuse the values already set by the inline FOUC-prevention script if available.
const preset = (
  window as unknown as {
    __theme?: { value: string; palette?: string; bg?: string };
  }
).__theme;

let themeValue: string = preset?.value ?? getPreferredTheme();
let paletteValue: Palette = isPalette(preset?.palette)
  ? preset.palette
  : getPreferredPalette();
let bgValue: Background = isBackground(preset?.bg)
  ? preset.bg
  : getPreferredBackground();

function persist(): void {
  localStorage.setItem(THEME_KEY, themeValue);
  localStorage.setItem(PALETTE_KEY, paletteValue);
  localStorage.setItem(BG_KEY, bgValue);
  reflect();
}

function reflect(): void {
  const root = document.firstElementChild;
  root?.setAttribute("data-theme", themeValue);
  root?.setAttribute("data-palette", paletteValue);
  root?.setAttribute("data-bg", bgValue);
  root?.classList.toggle("dark", themeValue === DARK);
  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);
  document
    .querySelector("#palette-btn")
    ?.setAttribute("aria-label", paletteValue);
  document.querySelector("#bg-btn")?.setAttribute("aria-label", bgValue);

  // Update the palette/background switcher labels.
  document.querySelectorAll("[data-palette-label]").forEach(el => {
    el.textContent = PALETTE_LABELS[paletteValue];
  });
  document.querySelectorAll("[data-bg-label]").forEach(el => {
    el.textContent = BACKGROUND_LABELS[bgValue];
  });

  // Background image layer
  const layer = document.getElementById("bg-layer") as HTMLElement | null;
  const img = document.getElementById("bg-image") as HTMLElement | null;
  if (layer && img) {
    const src = BG_IMAGES[bgValue];
    if (!src) {
      layer.setAttribute("data-show", "false");
      layer.classList.add("hidden");
      img.style.backgroundImage = "";
    } else {
      // Preload then crossfade
      const doShow = () => {
        img.style.backgroundImage = `url("${src}")`;
        layer.classList.remove("hidden");
        requestAnimationFrame(() => layer.setAttribute("data-show", "true"));
      };
      if (layer.getAttribute("data-show") === "true") {
        layer.setAttribute("data-show", "false");
        window.setTimeout(doShow, 180);
      } else {
        doShow();
      }
    }
  }

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
  document.querySelector("#bg-btn")?.addEventListener("click", () => {
    bgValue = nextBackground(bgValue);
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
