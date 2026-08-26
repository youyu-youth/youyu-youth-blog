## AGENTS.md

启动开发服务器时，请使用后台模式：

```
astro dev --background
```

使用 `astro dev stop`、`astro dev status` 和 `astro dev logs` 管理后台服务器。

## 开发原则
- 不要重复造轮子，优先复用现有可用的ui组件,组件化优先
- 禁止渐变色，响应式布局,适配移动端

## 工具使用习惯
- 涉及到浏览器交互的操作，优先使用 browser-use mcp 工具
- 技术文档查询时，适用context7 tools 即可 (在LLM知识库对该技术文档的掌握低于90%时即可使用 context7 实时查询)



## 技术栈
Main Framework - Astro
Type Checking - TypeScript
Styling - TailwindCSS
UI/UX - Figma Design File
Static Search - Pagefind
Icons - Tablers
Code Formatting - Prettier
Deployment - Cloudflare Pages
Linting - ESLint
Dynamic OG images - Satori + Sharp + Astro Fonts

README.md

## 文档参考

完整文档：https://docs.astro.build
- [添加页面、动态路由或中间件](https://docs.astro.build/en/guides/routing/)
- [使用 Astro 组件](https://docs.astro.build/en/basics/astro-components/)
- [使用 React、Vue、Svelte 或其他框架组件](https://docs.astro.build/en/guides/framework-components/)
- [添加或管理内容](https://docs.astro.build/en/guides/content-collections/)
- [添加样式或使用 Tailwind](https://docs.astro.build/en/guides/styling/)
- [支持多种语言](https://docs.astro.build/en/guides/internationalization/)

## 包管理与运行环境

- 包管理器是 `pnpm`（CI 与 Docker 均锁定 11.3.0），不要用 npm/yarn。`engines.node >=22.12.0`，CI 使用 Node 24。安装依赖用 `pnpm install --frozen-lockfile`，勿改动 lockfile。

## 构建管线

`pnpm build` 实际执行：`astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/`

- 类型检查（`astro check`）内嵌在 build 中，无独立 typecheck 脚本。
- Pagefind 搜索索引在 `astro build` 之后生成到 `dist/pagefind/`，再拷贝回 `public/pagefind/`（该目录已被 `.gitignore`、`tsconfig.json exclude` 与 `eslint.config.js ignores` 排除）。搜索功能仅在执行过 build 后可用；勿把 `public/pagefind/` 纳入版本控制或 lint。

## Lint 与格式化

- ESLint 规则 `no-console: error`：源码中禁止 `console.*`。
- Prettier：使用**双引号**（`singleQuote: false`）、`arrowParens: avoid`、`trailingComma: "es5"`、`semi: true`。生成代码时务必匹配，不要用单引号。
- `.prettierignore` 为白名单式：默认忽略全部，仅放行 `src`/`public`/`.github` 等少数目录；`*.mdx` 被显式忽略，不要对其运行 Prettier。
- CI 校验顺序：`pnpm run lint` → `pnpm run format:check` → `pnpm run build`。

## 配置架构

存在两份配置，不要混用：

- `astro-paper.config.ts`：**用户侧**配置（站点信息、分页、社交链接、功能开关等），是最终用户的编辑入口。
- `src/config.ts`：**内部已解析**配置（带默认值合并后的 `ResolvedAstroPaperConfig`）。代码中统一以 `import ... from "@/config"` 引用，不要直接导入 `@/astro-paper.config`。
- 路径别名（`tsconfig.json`）：`@/*` → `./src/*`、`@/astro-paper.config` → `./astro-paper.config`。

## 内容集合（`src/content.config.ts`）

- 文章目录：`src/content/posts/`（常量 `BLOG_PATH`）；页面目录：`src/content/pages/`。
- loader glob 为 `**/[^_]*.{md,mdx}`：**以 `_` 开头的文件会被排除**（用作私有/草稿约定）。
- 文章 frontmatter schema 见 `content.config.ts`；必填 `pubDatetime`（Date）、`title`、`description`，`tags` 默认 `["others"]`。
- 草稿与定时发布逻辑见 `src/utils/postFilter.ts`：`draft: true` 永不发布；生产环境下需 `pubDatetime` 早于「当前时间 − `scheduledPostMargin`」（默认 15 分钟）才可见；开发环境下非草稿全部可见。
- 文章按 `modDatetime ?? pubDatetime` 倒序排序（`getSortedPosts`）。
- 修改 collection 或 integration 后运行 `pnpm sync`（`astro sync`）以重新生成 `.astro/` 下的类型。

## 样式（Tailwind v4）

- 经 `@tailwindcss/vite` 插件 + `src/styles/global.css` 中的 `@import "tailwindcss"` 启用（v4 写法）。**无 `tailwind.config.js`**，不要创建。
- 自定义工具用 `@utility`（如 `max-w-app`、`app-layout`、`active-nav`），暗色变体用 `@custom-variant dark`（基于 `[data-theme=dark]`）。
- 主题体系为「明暗模式 × 配色预设」两个正交维度：`<html data-theme="light|dark" data-palette="...">`。语义 CSS 变量（`--background`、`--accent`、`--deco` 等）定义在 `src/styles/theme.css` 的各调色板块中，`@theme inline` 将其桥接为 Tailwind 令牌（`bg-background`、`text-accent` 等），**组件中不要硬编码颜色**。
- 配色预设清单在 `src/utils/palettes.ts`（当前 `default`、`pixel`）。新增主题 = 在 `theme.css` 复制一组 `[data-palette="x"][data-theme="light|dark"]` 变量块 + 在 `palettes.ts` 注册名称，Header 调色板按钮自动循环到它。
- 运行时切换：`Layout.astro` 内联 FOUC 防抖脚本同步设置 `data-theme`/`data-palette`（localStorage 键 `theme`/`palette`），`src/scripts/theme.ts` 负责交互切换，改动需同步两者。

## 国际化（i18n）

- `astro.config.ts`：`locales: ["zh", "en"]`、`defaultLocale: "zh"`、`prefixDefaultLocale: false`——中文在根路径（`/`），英文在 `/en/` 前缀下。
- UI 文案存放于 `src/i18n/lang/*.ts`（文件名即 locale），经 `useTranslations(locale)` / `tplStr` 访问，缺省回退到 `en`；语言包结构由 `src/i18n/types.ts` 的 `UIStrings` 约束，新增 key 需同步所有语言文件。
- Astro 静态构建不会自动复制页面，因此 `/en/` 路由由 `src/pages/en/` 下的**包装页**生成：每个文件仅 `import Page from "@/pages/<原页面>"` 并渲染（动态路由再 `export { getStaticPaths }`），`Astro.currentLocale` 会正确传递为 `"en"`。新增页面时须同步在 `src/pages/en/` 加包装页。
- 新增语言：① `astro.config.ts` 的 `i18n.locales` 注册；② 新增 `src/i18n/lang/<locale>.ts`；③ 在 `src/pages/` 下建对应 `<locale>/` 包装页目录（参照 `en/`）。Header 语言切换器自动循环所有语言。
- 仅 UI 多语言：文章内容（posts）不分语言，所有语言下显示同一批文章。RSS 与文章 OG 图端点只存在于默认语言路径。

## 测试

无自动化测试套件（见 `.github/CONTRIBUTING.md`）。不要臆造 `pnpm test` 之类的命令；验证以 `pnpm build` 与 `pnpm preview` 为准。

## 提交规范

遵循 Conventional Commits（commitizen，`cz.yaml`）：`type(scope): description`，tag 格式 `v$version`，版本方案 semver。
