import type { UIStrings } from "../types";

export default {
  localeName: "中文",
  nav: {
    home: "首页",
    posts: "文章",
    tags: "标签",
    categories: "分类",
    projects: "项目",
    bookmarks: "收藏",
    albums: "相册",
    skills: "技能",
    tools: "工具",
    about: "关于",
    archives: "归档",
    search: "搜索",
  },
  post: {
    publishedAt: "发布于",
    updatedAt: "更新于",
    sharePostIntro: "分享本文：",
    sharePostOn: "在 {{platform}} 上分享本文",
    sharePostViaEmail: "通过邮件分享本文",
    tagLabel: "标签",
    backToTop: "回到顶部",
    goBack: "返回",
    editPage: "编辑本页",
    previousPost: "上一篇",
    nextPost: "下一篇",
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
    page: "第 {{n}} 页",
  },
  home: {
    socialLinks: "社交链接",
    featured: "精选",
    recentPosts: "最近文章",
    allPosts: "查看全部文章",
    heroTagline: "在代码与思想之间，探索更好的答案。",
    heroRole: "开发者",
    heroLocation: "中国 · 北京",
    heroQuote: "Build ideas. Ship slowly.",
    heroQuoteAuthor: "",
  },
  footer: {
    copyright: "版权所有",
    allRightsReserved: "保留所有权利。",
  },
  pages: {
    tagTitle: "标签",
    tagDesc: "包含该标签的所有文章",

    tagsTitle: "标签",
    tagsDesc: "文章中使用的所有标签。",

    postsTitle: "文章",
    postsDesc: "我发布的所有文章。",

    archivesTitle: "归档",
    archivesDesc: "我归档的所有文章。",

    searchTitle: "搜索",
    searchDesc: "搜索任意文章……",

    categoriesTitle: "分类",
    categoriesDesc: "按分类浏览文章。",

    categoryTitle: "分类",
    categoryDesc: "该分类下的所有文章",

    projectsTitle: "项目",
    projectsDesc: "我的作品与开源项目。",

    bookmarksTitle: "收藏",
    bookmarksDesc: "精心收藏的链接与资源。",

    albumsTitle: "相册",
    albumsDesc: "记录生活的光影。",

    skillsTitle: "技能",
    skillsDesc: "掌握的技术栈与工具。",

    toolsTitle: "工具",
    toolsDesc: "常用的工具与资源导航。",
  },
  a11y: {
    skipToContent: "跳到正文",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    toggleTheme: "切换明暗模式",
    switchPalette: "切换配色主题",
    switchLanguage: "切换语言",
    searchPlaceholder: "搜索文章……",
    noResults: "未找到结果",
    goToPreviousPage: "前往上一页",
    goToNextPage: "前往下一页",
  },
  notFound: {
    title: "404 页面不存在",
    message: "页面不存在",
    goHome: "返回首页",
  },
  donate: {
    title: "打赏支持",
    tip: "如果觉得文章有帮助，欢迎打赏支持",
    wechat: "微信",
    alipay: "支付宝",
    close: "关闭",
  },
  bookmarks: {
    searchPlaceholder: "搜索收藏…",
    allCategories: "全部",
    count: "{{n}} 个收藏",
    importTip: "可通过 `pnpm bookmarks:import <html>` 批量导入浏览器书签",
  },
  albums: {
    count: "{{n}} 张照片",
    empty: "暂无照片",
  },
  skills: {
    years: "{{n}} 年",
    level: "熟练度",
  },
  tools: {
    visit: "访问",
  },
  projects: {
    visitDemo: "预览",
    viewCode: "源码",
    techStack: "技术栈",
    statusShipped: "已发布",
    statusBuilding: "进行中",
    statusArchived: "已归档",
  },
  categories: {
    count: "{{n}} 篇文章",
    allPosts: "全部文章",
  },
  sideNav: {
    title: "探索",
    explore: "探索",
  },
} satisfies UIStrings;
