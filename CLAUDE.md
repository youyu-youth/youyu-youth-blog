## AGENTS.md

启动开发服务器时，请使用后台模式：

```
astro dev --background
```

使用 `astro dev stop`、`astro dev status` 和 `astro dev logs` 管理后台服务器。


不要重复造轮子，优先复用现有可用的ui组件
组件化优先

## 工具使用习惯
- 涉及到浏览器交互的操作，优先使用 browser-use mcp 工具
- 技术文档查询时，适用context7 tools 即可 (在LLM知识库对该技术文档的掌握低于90%时即可使用 context7 实时查询)


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
- 明暗主题：在 `<html>` 上设 `data-theme` 属性并切换 `.dark` 类；`Layout.astro` 内含同步 FOUC 防抖脚本，`src/scripts/theme.ts` 负责运行时切换，改动需同步两者。

## 国际化（i18n）

`astro.config.ts` 当前仅 `locales: ["en"]`、`prefixDefaultLocale: false`（默认语言不加 URL 前缀）。UI 文案存放于 `src/i18n/lang/*.ts`，经 `useTranslations(locale)` / `tplStr` 访问，缺省回退到 `en`。新增语言须同时在 `astro.config.ts` 的 `i18n.locales` 注册并新增对应 lang 文件。

## 测试

无自动化测试套件（见 `.github/CONTRIBUTING.md`）。不要臆造 `pnpm test` 之类的命令；验证以 `pnpm build` 与 `pnpm preview` 为准。

## 提交规范

遵循 Conventional Commits（commitizen，`cz.yaml`）：`type(scope): description`，tag 格式 `v$version`，版本方案 semver。
