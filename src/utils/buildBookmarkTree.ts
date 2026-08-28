export type Bookmark = {
  title: string;
  url: string;
  description?: string;
  category: string;
  categoryPath: string[];
  fullPath?: string[];
  fullPathStr?: string;
  strippedStr?: string;
  topCategory: string;
  subCategory?: string;
  level: number;
  tags?: string[];
  addedAt?: string;
  icon?: string;
};

export type BookmarkFolder = {
  name: string;
  fullPath: string[];
  fullPathStr: string;
  strippedPath: string[];
  strippedStr: string;
  level: number;
  addDate?: string;
  directCount: number;
  isEmpty: boolean;
};

export type TreeNode = {
  name: string;
  path: string[];
  pathStr: string;
  level: number;
  directCount: number;
  totalCount: number;
  isEmptyBranch?: boolean;
  children: TreeNode[];
  bookmarks: Bookmark[];
};

export function buildBookmarkTree(
  bookmarks: Bookmark[],
  folders: BookmarkFolder[]
): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // helper to ensure node exists for a path
  function ensureNode(path: string[]): TreeNode {
    const pathStr = path.join("/");
    if (map.has(pathStr)) return map.get(pathStr)!;
    const name = path[path.length - 1] || "未分类";
    const node: TreeNode = {
      name,
      path: [...path],
      pathStr,
      level: path.length,
      directCount: 0,
      totalCount: 0,
      children: [],
      bookmarks: [],
    };
    map.set(pathStr, node);
    if (path.length === 1) {
      roots.push(node);
    } else {
      const parentPath = path.slice(0, -1);
      const parent = ensureNode(parentPath);
      parent.children.push(node);
    }
    return node;
  }

  // 1. ensure all folders exist (including empty)
  for (const f of folders) {
    const node = ensureNode(f.strippedPath);
    node.directCount = f.directCount;
    // isEmpty will be recomputed later via totalCount
  }

  // 2. attach bookmarks
  for (const b of bookmarks) {
    const path = b.categoryPath && b.categoryPath.length ? b.categoryPath : [b.topCategory || b.category || "未分类"];
    const node = ensureNode(path);
    node.bookmarks.push(b);
    // directCount will be overwritten but keep folder's directCount if larger
    // we already set directCount from folder; ensure at least bookmarks length
    node.directCount = Math.max(node.directCount, node.bookmarks.length);
  }

  // 3. ensure parent chain for all nodes (already via ensureNode) and sort children by original folder order vs name
  // Preserve insertion order as encountered: folders appear in HTML order, bookmarks insertion also HTML order.
  // For deterministic, sort roots by totalCount desc? Keep original order for now, but move to use folder order.
  // We will keep order as first appearance: map insertion order reflects ensureNode call order (folders first).
  // Children order currently as inserted; sort children by directCount desc then name to surface larger folders?
  // To keep UX predictable, sort children alphabetically zh? But spec wants to avoid explosion, not necessarily sort.
  // We'll keep insertion order (HTML order) — comment out sorting.

  // 4. compute totalCount recursively
  function compute(node: TreeNode): number {
    let total = node.bookmarks.length;
    for (const child of node.children) {
      total += compute(child);
    }
    node.totalCount = total;
    node.isEmptyBranch = total === 0;
    return total;
  }
  for (const r of roots) compute(r);

  // 5. sort roots by totalCount desc for prominence, but keep 收藏夹栏 first if it has only 1?
  // Let's sort by totalCount desc to surface 笔记 etc higher, but keep stable for equal.
  roots.sort((a, b) => b.totalCount - a.totalCount);

  // also sort children by totalCount desc
  function sortRec(node: TreeNode) {
    node.children.sort((a, b) => b.totalCount - a.totalCount);
    node.children.forEach(sortRec);
  }
  roots.forEach(sortRec);

  return roots;
}

export function flattenNodes(nodes: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  function walk(n: TreeNode) {
    out.push(n);
    n.children.forEach(walk);
  }
  nodes.forEach(walk);
  return out;
}

export function findNode(nodes: TreeNode[], pathStr: string): TreeNode | null {
  const all = flattenNodes(nodes);
  return all.find(n => n.pathStr === pathStr) || null;
}
