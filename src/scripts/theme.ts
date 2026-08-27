import {
  DEFAULT_PALETTE,
  PALETTE_LABELS,
  isPalette,
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

  // Sync palette dialog selection state
  document
    .querySelectorAll<HTMLButtonElement>("[data-palette-option]")
    .forEach(btn => {
      const isActive = btn.dataset.paletteOption === paletteValue;
      btn.setAttribute("aria-selected", String(isActive));
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

let paletteDialogBound = false;

function getVisibleOptions(): HTMLButtonElement[] {
  return Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-palette-option]")
  ).filter(btn => {
    const li = btn.closest("li") as HTMLElement | null;
    return li ? li.style.display !== "none" : true;
  });
}

function setActiveOption(index: number): void {
  const visible = getVisibleOptions();
  visible.forEach((btn, i) => {
    const isActive = i === index;
    btn.classList.toggle("!bg-muted", isActive);
    btn.classList.toggle("!text-foreground", isActive);
    if (isActive) {
      btn.scrollIntoView({ block: "nearest" });
    }
  });
}

function filterPaletteList(query: string): void {
  const q = query.trim().toLowerCase();
  let visibleCount = 0;
  document
    .querySelectorAll<HTMLButtonElement>("[data-palette-option]")
    .forEach(btn => {
      const label = (
        PALETTE_LABELS[btn.dataset.paletteOption as Palette] ?? ""
      ).toLowerCase();
      const id = (btn.dataset.paletteOption ?? "").toLowerCase();
      const match = !q || label.includes(q) || id.includes(q);
      const li = btn.closest("li") as HTMLElement | null;
      if (li) li.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });
  const empty = document.getElementById("palette-empty");
  if (empty) empty.classList.toggle("hidden", visibleCount !== 0);
  // reset active index to first visible or selected
  const visible = getVisibleOptions();
  const selectedIdx = visible.findIndex(
    b => b.dataset.paletteOption === paletteValue
  );
  setActiveOption(selectedIdx >= 0 ? selectedIdx : 0);
}

function openPaletteDialog(): void {
  const dialog = document.getElementById(
    "palette-dialog"
  ) as HTMLDialogElement | null;
  const search = document.getElementById(
    "palette-search"
  ) as HTMLInputElement | null;
  if (!dialog) return;
  // store previous focus
  (dialog as unknown as { _prevFocus?: Element | null })._prevFocus =
    document.activeElement;
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
    dialog.style.display = "flex";
  }
  document.body.style.overflow = "hidden";
  if (search) {
    search.value = "";
    filterPaletteList("");
    // focus with slight delay to ensure dialog is rendered
    requestAnimationFrame(() => search.focus());
  } else {
    const visible = getVisibleOptions();
    const idx = visible.findIndex(b => b.dataset.paletteOption === paletteValue);
    setActiveOption(idx >= 0 ? idx : 0);
  }
}

function closePaletteDialog(): void {
  const dialog = document.getElementById(
    "palette-dialog"
  ) as HTMLDialogElement | null;
  if (!dialog) return;
  if (dialog.open) {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
    (dialog as HTMLElement).style.display = "none";
  }
  document.body.style.overflow = "";
  const prev = (dialog as unknown as { _prevFocus?: Element | null })
    ._prevFocus as HTMLElement | null;
  if (prev && typeof prev.focus === "function") {
    prev.focus();
  } else {
    document.getElementById("palette-btn")?.focus();
  }
}

function setupPaletteDialog(): void {
  if (paletteDialogBound) return;
  const dialog = document.getElementById(
    "palette-dialog"
  ) as HTMLDialogElement | null;
  const search = document.getElementById(
    "palette-search"
  ) as HTMLInputElement | null;
  const backdrop = document.getElementById("palette-dialog-backdrop");
  if (!dialog) return;
  paletteDialogBound = true;

  // close on backdrop click
  dialog.addEventListener("click", e => {
    if (e.target === dialog) closePaletteDialog();
  });
  backdrop?.addEventListener("click", () => closePaletteDialog());

  // native cancel (Esc)
  dialog.addEventListener("cancel", e => {
    e.preventDefault();
    closePaletteDialog();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
  });

  // option selection
  dialog.querySelectorAll("[data-palette-option]").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = (btn as HTMLButtonElement).dataset.paletteOption;
      if (isPalette(val)) {
        paletteValue = val;
        persist();
      }
      closePaletteDialog();
    });
  });

  // search filter + keyboard navigation
  if (search) {
    let activeIndex = 0;
    const updateActive = (idx: number) => {
      const visible = getVisibleOptions();
      if (visible.length === 0) return;
      activeIndex = Math.max(0, Math.min(idx, visible.length - 1));
      setActiveOption(activeIndex);
    };

    search.addEventListener("input", () => {
      filterPaletteList(search.value);
      const visible = getVisibleOptions();
      activeIndex = visible.findIndex(
        b => b.dataset.paletteOption === paletteValue
      );
      if (activeIndex < 0) activeIndex = 0;
      setActiveOption(activeIndex);
    });

    search.addEventListener("keydown", e => {
      const visible = getVisibleOptions();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        updateActive(activeIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        updateActive(activeIndex - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = visible[activeIndex];
        const val = target?.dataset.paletteOption;
        if (isPalette(val)) {
          paletteValue = val;
          persist();
        }
        closePaletteDialog();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closePaletteDialog();
      } else if (e.key === "Home") {
        e.preventDefault();
        updateActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        updateActive(visible.length - 1);
      }
    });

    // when dialog opens, initialize activeIndex
    const observer = new MutationObserver(() => {
      if (dialog.open || dialog.hasAttribute("open")) {
        const visible = getVisibleOptions();
        activeIndex = visible.findIndex(
          b => b.dataset.paletteOption === paletteValue
        );
        if (activeIndex < 0) activeIndex = 0;
        setActiveOption(activeIndex);
      }
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
  }
}

function setup(): void {
  reflect();
  setupPaletteDialog();
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    persist();
  });
  document.querySelector("#palette-btn")?.addEventListener("click", () => {
    openPaletteDialog();
  });
  document.querySelector("#bg-btn")?.addEventListener("click", () => {
    bgValue = nextBackground(bgValue);
    persist();
  });
}

setup();

// Re-bind after View Transitions navigation (DOM replaced)
document.addEventListener("astro:after-swap", () => {
  paletteDialogBound = false;
  setup();
});

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
