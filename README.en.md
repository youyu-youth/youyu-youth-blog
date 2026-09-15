# yyyouth-blog

[简体中文](./README.md) | [English](./README.en.md)

![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-2F3741?style=for-the-badge)

A personal blog and content site built with Astro — half blog posts, half projects, albums, bookmarks, skills and tools. Heavily customized from [AstroPaper](https://github.com/satnaing/astro-paper), with a focus on a **multi-theme visual system** and **content-driven feature pages**.

![yyyouth-blog](public/default-og.jpg)

## ✨ Features

### Visuals & theming

- **Multiple color palettes**: light/dark mode × 14 presets (`default`, `pixel`, `dark-plus`, `dracula`, `everforest`, `github-dark`, `github-light`, `gruvbox-dark`, `gruvbox-light`, `nord`, `catppuccin`, `tokyo-night`, `kanagawa`, `one-dark`), with a searchable, keyboard-friendly picker.
- **Global background images**: auto-discovered from `src/assets/bg/`, switchable from the header, with transparent-adaptive header and content.
- **Responsive layout**: fixed left sidebar on desktop, horizontal pill nav on mobile.
- **No flash of unstyled theme**: theme, palette and background are restored by an inline first-paint script.

### Content-driven pages

- **Categories** (`/categories`): grouped by each post's `category` field.
- **Projects** (`/projects`): cards with tech stack, status, GitHub and demo links.
- **Albums** (`/albums`): photo galleries with a built-in lightbox (Esc / overlay to close).
- **Skills** (`/skills`): data-driven from `src/data/skills.json`, bento layout.
- **Tools** (`/tools`): data-driven from `src/data/tools.json`, with category and search filters.
- **Bookmarks** (`/bookmarks`): tree-based folder browsing with search and category filtering.
- **Donate**: a modal with WeChat / Alipay QR codes at the end of each post, hideable per post via `hideDonate`.

### Reading experience

- Reading progress bar, code-block copy button, heading anchor links, scroll-spy table of contents.
- Image lightbox inside posts: pinch zoom, double-tap zoom, panning and keyboard support.
- Shiki syntax highlighting with two themes, file-name labels, line highlighting and diff markers.
- Callouts (`rehype-callouts`) and a collapsible table of contents.

### i18n & publishing

- **Bilingual**: Chinese at the site root, English under the `/en/` prefix — both UI strings and search index.
- **Static search**: [Pagefind](https://pagefind.app/) index generated at build time.
- **Dynamic OG images**: Satori + Sharp + Astro Fonts for posts and the site.
- RSS, sitemap, `robots.txt`, 404 page and View Transitions.
- **Bookmark import CLI**: `pnpm bookmarks:import` parses a browser-exported bookmarks HTML file, keeping folder hierarchy and icons.

## 🧱 Project Structure

```bash
/
├── public/                      # Static assets (favicon, default OG image, donate QR codes)
├── scripts/
│   └── import-bookmarks.mjs     # Bookmark import CLI
├── src/
│   ├── assets/                  # Icons, post images, backgrounds (bg/), avatar
│   ├── components/              # Shared components
│   │   ├── home/                # Hero, SideNav, RecentPosts, PixelDecor
│   │   ├── bookmarks/           # Bookmark tree browsing
│   │   ├── albums/ projects/ skills/ tools/
│   │   └── Donate.astro         # Donate modal
│   ├── content/                 # Content collections
│   │   ├── posts/               # Blog posts
│   │   ├── pages/               # Standalone pages (about, etc.)
│   │   ├── projects/            # Projects
│   │   └── albums/              # Albums
│   ├── data/                    # Standalone JSON data sources
│   │   ├── bookmarks.json       # Bookmark entries
│   │   ├── bookmarkFolders.json # Bookmark folder tree
│   │   ├── skills.json
│   │   └── tools.json
│   ├── i18n/
│   │   ├── index.ts             # useTranslations / locale auto-discovery
│   │   ├── types.ts             # UIStrings type constraints
│   │   └── lang/{zh,en}.ts      # Translation files
│   ├── layouts/                 # Layout (theme + background init, View Transitions)
│   ├── pages/                   # Routes and endpoints (incl. en/ wrapper pages)
│   ├── styles/
│   │   ├── global.css           # Tailwind entry and custom @utility rules
│   │   └── theme.css            # Semantic CSS variables and palette blocks
│   ├── types/config.ts          # Config types and defineAstroPaperConfig
│   ├── utils/
│   │   ├── palettes.ts          # Palette list
│   │   ├── backgrounds.ts       # Background auto-discovery
│   │   └── postFilter.ts        # Draft and scheduled publishing
│   ├── config.ts                # Internal resolved config
│   └── content.config.ts        # Content collection schemas
├── astro-paper.config.ts        # User-facing configuration
└── astro.config.ts
```

### Content collections

| Collection | Directory               | Notes                                                                                                                            |
| :--------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `posts`    | `src/content/posts/`    | Posts. Required `pubDatetime`, `title`, `description`; optional `category`, `featured`, `tags`, `draft`, `hideDonate`, `hideEditPost` |
| `pages`    | `src/content/pages/`    | Standalone pages such as `about.md`                                                                                              |
| `projects` | `src/content/projects/` | Projects with `techStack`, `cover`, `github`, `demo`, `status` (`shipped`/`building`/`archived`)                                 |
| `albums`   | `src/content/albums/`   | Albums; each entry in `photos[]` has `src`, `caption`, `alt`                                                                     |

Files starting with `_` are excluded by the loader and can be used as a private/draft convention. Posts are sorted by `modDatetime ?? pubDatetime` in descending order.

## 🚀 Running Locally

Requirements: Node `>=22.12.0`, package manager `pnpm`.

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321` by default. To start it in the background:

```bash
astro dev --background
astro dev status   # check status
astro dev logs     # view logs
astro dev stop     # stop
```

## 🧞 Commands

| Command                 | Action                                                                                          |
| :---------------------- | :---------------------------------------------------------------------------------------------- |
| `pnpm install`          | Install dependencies                                                                            |
| `pnpm dev`              | Start the local dev server                                                                      |
| `pnpm build`            | Type-check, build, run Pagefind indexing, and copy the index to `public/pagefind/`              |
| `pnpm preview`          | Preview the build locally                                                                       |
| `pnpm sync`             | Generate Astro module types (run after changing collections or integrations)                    |
| `pnpm bookmarks:import` | Parse a browser-exported bookmarks HTML file into `src/data/`                                    |
| `pnpm lint`             | Run ESLint                                                                                      |
| `pnpm format`           | Format with Prettier (`format:check` to verify)                                                 |

> The search index is produced by `pnpm build`, so search only works after a build.

## ⚙️ Configuration

In day-to-day use, edit only `astro-paper.config.ts`; `src/config.ts` is the internally resolved config with defaults applied, referenced everywhere as `@/config`.

```ts
export default defineAstroPaperConfig({
  site: {
    url: "https://example.com/",
    title: "yyyouth blog",
    description: "...",
    author: "...",
    profile: "https://...",
    avatar: "yyyouth.jpg", // resolved from src/assets/images/
    logoText: "yyyouth", // short brand text in the header
    ogImage: "default-og.jpg",
    lang: "zh",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: { perPage: 4, perIndex: 4, scheduledPostMargin: 15 * 60 * 1000 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind", // or false to disable search
  },
  socials: [/* name maps to src/assets/icons/socials/<name>.svg */],
  shareLinks: [/* base share URLs; the post URL is appended as a parameter */],
  donate: {
    enabled: true,
    wechat: "/qr/wechat-placeholder.svg",
    alipay: "/qr/alipay-placeholder.svg",
    tip: "If this post helped you, consider buying me a coffee",
  },
});
```

### Adding a palette

1. Copy a pair of `[data-palette="x"][data-theme="light"]` and `[data-theme="dark"]` variable blocks in `src/styles/theme.css`.
2. Register it in `PALETTES` and `PALETTE_LABELS` in `src/utils/palettes.ts`.

The palette picker picks up new presets automatically.

### Adding a language

1. Register the locale in `astro.config.ts` under `i18n.locales`.
2. Add `src/i18n/lang/<locale>.ts` (its shape is constrained by `UIStrings` in `src/i18n/types.ts`; keep all language files in sync).
3. Create the matching `<locale>/` wrapper page directory under `src/pages/`, following `src/pages/en/`.

> UI strings are localized only: post content is language-agnostic and the same posts are shown in every language.

## 💻 Tech Stack

**Main Framework** - [Astro](https://astro.build/)  
**Type Checking** - [TypeScript](https://www.typescriptlang.org/)  
**Styling** - [TailwindCSS v4](https://tailwindcss.com/)  
**Static Search** - [Pagefind](https://pagefind.app/)  
**Icons** - [Tabler Icons](https://tabler-icons.io/)  
**Code Formatting** - [Prettier](https://prettier.io/)  
**Linting** - [ESLint](https://eslint.org)  
**Dynamic OG images** - [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/) + [Astro Fonts](https://docs.astro.build/en/guides/fonts/)  
**Deployment** - [Cloudflare Pages](https://pages.cloudflare.com/)

## 🖼️ Screenshots

<!-- To be added: -->
<!-- ![Home](docs/screenshots/home.png) -->
<!-- ![Post page (TOC and reading progress)](docs/screenshots/post.png) -->
<!-- ![Theme picker](docs/screenshots/theme-picker.png) -->
<!-- ![Bookmarks](docs/screenshots/bookmarks.png) -->

## 📜 License & Credits

Built on top of [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev). Thanks for the great starting point.

Licensed under the MIT License.
