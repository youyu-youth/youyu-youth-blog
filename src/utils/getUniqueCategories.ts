import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Category = {
  category: string;
  categoryName: string;
};

export function getUniqueCategories(posts: CollectionEntry<"posts">[]) {
  const categories: Category[] = posts
    .filter(postFilter)
    .map(post => post.data.category ?? "others")
    .map(cat => ({ category: slugifyStr(cat), categoryName: cat }))
    .filter(
      (value, index, self) =>
        self.findIndex(c => c.category === value.category) === index
    )
    .sort((a, b) => a.category.localeCompare(b.category));
  return categories;
}
