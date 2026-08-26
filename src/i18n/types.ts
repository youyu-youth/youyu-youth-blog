export interface UIStrings {
  /** Native name of this locale, shown by the language switcher */
  localeName: string;
  nav: {
    home: string;
    posts: string;
    tags: string;
    categories: string;
    projects: string;
    bookmarks: string;
    albums: string;
    skills: string;
    tools: string;
    about: string;
    archives: string;
    search: string;
  };
  post: {
    publishedAt: string;
    updatedAt: string;
    sharePostIntro: string;
    sharePostOn: string;
    sharePostViaEmail: string;
    tagLabel: string;
    backToTop: string;
    goBack: string;
    editPage: string;
    previousPost: string;
    nextPost: string;
  };
  pagination: {
    prev: string;
    next: string;
    /** "{{n}}" is replaced with the page number, e.g. "page 2" / "第 2 页" */
    page: string;
  };
  home: {
    socialLinks: string;
    featured: string;
    recentPosts: string;
    allPosts: string;
    /** Hero section on the home page */
    heroTagline: string;
    heroRole: string;
    heroLocation: string;
    heroQuote: string;
    heroQuoteAuthor: string;
  };
  footer: {
    copyright: string;
    allRightsReserved: string;
  };
  pages: {
    tagTitle: string;
    tagDesc: string;

    tagsTitle: string;
    tagsDesc: string;

    postsTitle: string;
    postsDesc: string;

    archivesTitle: string;
    archivesDesc: string;

    searchTitle: string;
    searchDesc: string;

    categoriesTitle: string;
    categoriesDesc: string;
    categoryTitle: string;
    categoryDesc: string;

    projectsTitle: string;
    projectsDesc: string;

    bookmarksTitle: string;
    bookmarksDesc: string;

    albumsTitle: string;
    albumsDesc: string;

    skillsTitle: string;
    skillsDesc: string;

    toolsTitle: string;
    toolsDesc: string;
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    switchPalette: string;
    switchLanguage: string;
    searchPlaceholder: string;
    noResults: string;
    goToPreviousPage: string;
    goToNextPage: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
  donate: {
    title: string;
    tip: string;
    wechat: string;
    alipay: string;
    close: string;
  };
  bookmarks: {
    searchPlaceholder: string;
    allCategories: string;
    count: string;
    importTip: string;
  };
  albums: {
    count: string;
    empty: string;
  };
  skills: {
    years: string;
    level: string;
  };
  tools: {
    visit: string;
  };
  projects: {
    visitDemo: string;
    viewCode: string;
    techStack: string;
    statusShipped: string;
    statusBuilding: string;
    statusArchived: string;
  };
  categories: {
    count: string;
    allPosts: string;
  };
  sideNav: {
    title: string;
    explore: string;
  };
}
