# yyyouth-blog

[简体中文](./README.md) | [English](./README.en.md)

![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-2F3741?style=for-the-badge)

一个以 Astro 构建的个人博客与内容站：一半是文章，一半是项目、相册、收藏夹、技能和工具。在 [AstroPaper](https://github.com/satnaing/astro-paper) 的基础上做了大量本地化改造，重点是**多主题视觉系统**与**内容型功能页**。

![yyyouth-blog](public/default-og.jpg)

## ✨ 特色功能

### 视觉与主题

- **多主题调色板**：明暗模式 × 14 套配色预设（`default`、`pixel`、`dark-plus`、`dracula`、`everforest`、`github-dark`、`github-light`、`gruvbox-dark`、`gruvbox-light`、`nord`、`catppuccin`、`tokyo-night`、`kanagawa`、`one-dark`），调色板选择器支持搜索与键盘操作。
- **全局背景图**：自动扫描 `src/assets/bg/` 下的图片，顶部一键切换，Header 与正文做透明适配。
- **响应式布局**：桌面端固定左侧导航，移动端切换为横向 pill 导航。
- **无闪烁切换**：主题/配色/背景在首屏内联脚本中同步恢复，避免 FOUC。

### 内容型功能页

- **分类**（`/categories`）：按文章 `category` 字段聚合。
- **项目**（`/projects`）：卡片展示技术栈、状态、GitHub 与 Demo 链接。
- **相册**（`/albums`）：图集浏览，内置 lightbox（Esc / 遮罩关闭）。
- **技能**（`/skills`）：数据驱动自 `src/data/skills.json`，bento 布局。
- **工具**（`/tools`）：数据驱动自 `src/data/tools.json`，带分类与搜索过滤。
- **收藏夹**（`/bookmarks`）：树形文件夹浏览 + 搜索 + 分类筛选。
- **打赏**：文章底部弹窗展示微信 / 支付宝二维码，单篇文章可用 `hideDonate` 关闭。

### 阅读体验

- 阅读进度条、代码块复制按钮、标题锚点链接、TOC 滚动高亮。
- 文章图片灯箱：支持双指缩放、双击放大、平移与键盘操作。
- Shiki 双主题代码高亮（文件名标注、行高亮、增删标记）。
- Callout 提示块（`rehype-callouts`）、可折叠目录。

### 国际化与发布

- **中英双语**：中文在根路径，英文在 `/en/` 前缀下，UI 文案与搜索索引均覆盖两种语言。
- **静态搜索**：[Pagefind](https://pagefind.app/) 在构建后生成索引。
- **动态 OG 图**：Satori + Sharp + Astro Fonts 为文章与站点生成分享图。
- RSS、Sitemap、`robots.txt`、404 页面、View Transitions。
- **收藏夹导入 CLI**：`pnpm bookmarks:import` 解析浏览器导出的书签 HTML，保留层级与图标。

## 🧱 项目结构

```bash
/
├── public/                      # 静态资源（favicon、默认 OG 图、打赏二维码）
├── scripts/
│   └── import-bookmarks.mjs     # 收藏夹导入 CLI
├── src/
│   ├── assets/                  # 图标、文章图片、背景图（bg/）、头像
│   ├── components/              # 通用组件
│   │   ├── home/                # Hero、SideNav、RecentPosts、PixelDecor
│   │   ├── bookmarks/           # 收藏夹树形浏览
│   │   ├── albums/ projects/ skills/ tools/
│   │   └── Donate.astro         # 打赏弹窗
│   ├── content/                 # 内容集合
│   │   ├── posts/               # 文章
│   │   ├── pages/               # 独立页面（about 等）
│   │   ├── projects/            # 项目
│   │   └── albums/              # 相册
│   ├── data/                    # 独立 JSON 数据源
│   │   ├── bookmarks.json       # 收藏夹条目
│   │   ├── bookmarkFolders.json # 收藏夹文件夹树
│   │   ├── skills.json
│   │   └── tools.json
│   ├── i18n/
│   │   ├── index.ts             # useTranslations / 语言自动发现
│   │   ├── types.ts             # UIStrings 类型约束
│   │   └── lang/{zh,en}.ts      # 语言包
│   ├── layouts/                 # Layout（主题与背景初始化、View Transitions）
│   ├── pages/                   # 路由与端点（含 en/ 包装页）
│   ├── styles/
│   │   ├── global.css           # Tailwind 入口与自定义 @utility
│   │   └── theme.css            # 语义 CSS 变量与各调色板定义
│   ├── types/config.ts          # 配置类型与 defineAstroPaperConfig
│   ├── utils/
│   │   ├── palettes.ts          # 调色板清单
│   │   ├── backgrounds.ts       # 背景图自动发现
│   │   └── postFilter.ts        # 草稿与定时发布
│   ├── config.ts                # 内部已解析配置
│   └── content.config.ts        # 内容集合 schema
├── astro-paper.config.ts        # 用户配置入口
└── astro.config.ts
```

### 内容集合

| 集合       | 目录                    | 说明                                                                                                                         |
| :--------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `posts`    | `src/content/posts/`    | 文章。必填 `pubDatetime`、`title`、`description`；可选 `category`、`featured`、`tags`、`draft`、`hideDonate`、`hideEditPost` |
| `pages`    | `src/content/pages/`    | 独立页面，如 `about.md`                                                                                                      |
| `projects` | `src/content/projects/` | 项目。含 `techStack`、`cover`、`github`、`demo`、`status`（`shipped`/`building`/`archived`）                                 |
| `albums`   | `src/content/albums/`   | 相册。`photos[]` 每项含 `src`、`caption`、`alt`                                                                              |

以 `_` 开头的文件会被 loader 排除，可用作私有 / 草稿约定。文章按 `modDatetime ?? pubDatetime` 倒序排序。

## 🚀 本地开发

环境要求：Node `>=22.12.0`，包管理器使用 `pnpm`。

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:4321`。如果希望以后台方式启动：

```bash
astro dev --background
astro dev status   # 查看状态
astro dev logs     # 查看日志
astro dev stop     # 停止
```

## 🧞 命令

| 命令                    | 说明                                                            |
| :---------------------- | :-------------------------------------------------------------- |
| `pnpm install`          | 安装依赖                                                        |
| `pnpm dev`              | 启动本地开发服务器                                              |
| `pnpm build`            | 类型检查 + 构建 + Pagefind 索引 + 拷贝索引到 `public/pagefind/` |
| `pnpm preview`          | 本地预览构建产物                                                |
| `pnpm sync`             | 生成 Astro 模块类型（修改内容集合或集成后执行）                 |
| `pnpm bookmarks:import` | 解析浏览器导出的书签 HTML，写入 `src/data/`                     |
| `pnpm lint`             | ESLint 检查                                                     |
| `pnpm format`           | Prettier 格式化（`format:check` 用于校验）                      |

> 搜索索引由 `pnpm build` 生成，因此搜索功能仅在执行过构建后可用。

## ⚙️ 配置

日常只需编辑 `astro-paper.config.ts`；`src/config.ts` 是带默认值合并后的内部解析配置，代码中统一通过 `@/config` 引用。

```ts
export default defineAstroPaperConfig({
  site: {
    url: "https://example.com/",
    title: "yyyouth blog",
    description: "...",
    author: "...",
    profile: "https://...",
    avatar: "yyyouth.jpg", // 解析自 src/assets/images/
    logoText: "yyyouth", // Header 品牌短文字
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
    search: "pagefind", // 或 false 关闭搜索
  },
  socials: [/* name 对应 src/assets/icons/socials/<name>.svg */],
  shareLinks: [/* 分享链接基址，文章 URL 作为参数追加 */],
  donate: {
    enabled: true,
    wechat: "/qr/wechat-placeholder.svg",
    alipay: "/qr/alipay-placeholder.svg",
    tip: "如果觉得文章有帮助，欢迎打赏支持",
  },
});
```

### 新增主题调色板

1. 在 `src/styles/theme.css` 复制一组 `[data-palette="x"][data-theme="light"]` 与 `[data-theme="dark"]` 变量块。
2. 在 `src/utils/palettes.ts` 的 `PALETTES` 与 `PALETTE_LABELS` 中注册。

调色板切换器会自动纳入新预设。

### 新增语言

1. 在 `astro.config.ts` 的 `i18n.locales` 注册。
2. 新增 `src/i18n/lang/<locale>.ts`（结构由 `src/i18n/types.ts` 的 `UIStrings` 约束，需同步所有语言文件）。
3. 在 `src/pages/` 下建立对应的 `<locale>/` 包装页目录，参照 `src/pages/en/`。

> 仅 UI 多语言：文章内容不分语言，所有语言下展示同一批文章。

## 💻 技术栈

**主框架** - [Astro](https://astro.build/)  
**类型检查** - [TypeScript](https://www.typescriptlang.org/)  
**样式** - [TailwindCSS v4](https://tailwindcss.com/)  
**静态搜索** - [Pagefind](https://pagefind.app/)  
**图标** - [Tabler Icons](https://tabler-icons.io/)  
**代码格式化** - [Prettier](https://prettier.io/)  
**代码检查** - [ESLint](https://eslint.org)  
**动态 OG 图** - [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/) + [Astro Fonts](https://docs.astro.build/en/guides/fonts/)  
**部署** - [Cloudflare Pages](https://pages.cloudflare.com/)

## 🖼️ 截图

<!-- 待补充： -->
<!-- ![首页](docs/screenshots/home.png) -->
<!-- ![文章页（含目录与阅读进度）](docs/screenshots/post.png) -->
<!-- ![主题切换器](docs/screenshots/theme-picker.png) -->
<!-- ![收藏夹](docs/screenshots/bookmarks.png) -->

## 📜 许可与致谢

本项目基于 [AstroPaper](https://github.com/satnaing/astro-paper)（作者 [Sat Naing](https://satnaing.dev)）二次开发，在此致谢。

Licensed under the MIT License.
