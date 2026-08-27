import type { UIStrings } from "../types";

export default {
  localeName: "English",
  nav: {
    home: "Home",
    posts: "Posts",
    tags: "Tags",
    categories: "Categories",
    projects: "Projects",
    bookmarks: "Bookmarks",
    albums: "Albums",
    skills: "Skills",
    tools: "Tools",
    about: "About",
    archives: "Archives",
    search: "Search",
  },
  post: {
    publishedAt: "Published at",
    updatedAt: "Updated",
    sharePostIntro: "Share this post:",
    sharePostOn: "Share this post on {{platform}}",
    sharePostViaEmail: "Share this post via email",
    tagLabel: "Tags",
    backToTop: "Back to top",
    goBack: "Go back",
    editPage: "Edit page",
    previousPost: "Previous Post",
    nextPost: "Next Post",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "page {{n}}",
  },
  home: {
    socialLinks: "Social Links",
    featured: "Featured",
    recentPosts: "Recent Posts",
    allPosts: "All Posts",
    heroTagline: "Between code and thought, searching for better answers.",
    heroRole: "Developer",
    heroLocation: "China · Beijing",
    heroQuote: "Build ideas. Ship slowly.",
    heroQuoteAuthor: "",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "All the articles with the tag",

    tagsTitle: "Tags",
    tagsDesc: "All the tags used in posts.",

    postsTitle: "Posts",
    postsDesc: "All the articles I've posted.",

    archivesTitle: "Archives",
    archivesDesc: "All the articles I've archived.",

    searchTitle: "Search",
    searchDesc: "Search any article ...",

    categoriesTitle: "Categories",
    categoriesDesc: "Browse posts by category.",

    categoryTitle: "Category",
    categoryDesc: "All posts in this category",

    projectsTitle: "Projects",
    projectsDesc: "My works and open-source projects.",

    bookmarksTitle: "Bookmarks",
    bookmarksDesc: "Curated links and resources.",

    albumsTitle: "Albums",
    albumsDesc: "Moments captured in light.",

    skillsTitle: "Skills",
    skillsDesc: "Tech stack and tools I use.",

    toolsTitle: "Tools",
    toolsDesc: "Useful tools and resources.",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    switchPalette: "Select theme",
    switchLanguage: "Switch language",
    searchPlaceholder: "Search posts...",
    noResults: "No results found",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
  },
  themePicker: {
    title: "Select theme",
    searchPlaceholder: "Search themes…",
    noResults: "No matching themes",
    current: "Current",
  },
  notFound: {
    title: "404 Not Found",
    message: "Page Not Found",
    goHome: "Go back home",
  },
  donate: {
    title: "Buy me a coffee",
    tip: "If this post helped you, consider supporting",
    wechat: "WeChat",
    alipay: "Alipay",
    close: "Close",
  },
  bookmarks: {
    searchPlaceholder: "Search bookmarks…",
    allCategories: "All",
    count: "{{n}} bookmarks",
    importTip: "Import via `pnpm bookmarks:import <html>`",
  },
  albums: {
    count: "{{n}} photos",
    empty: "No photos",
  },
  skills: {
    years: "{{n}} years",
    level: "Level",
  },
  tools: {
    visit: "Visit",
  },
  projects: {
    visitDemo: "Demo",
    viewCode: "Code",
    techStack: "Stack",
    statusShipped: "Shipped",
    statusBuilding: "Building",
    statusArchived: "Archived",
  },
  categories: {
    count: "{{n}} posts",
    allPosts: "All posts",
  },
  sideNav: {
    title: "Explore",
    explore: "Explore",
  },
} satisfies UIStrings;
