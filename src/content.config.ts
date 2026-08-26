import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      category: z.string().default("others"),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      hideDonate: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projects",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDatetime: z.date(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      techStack: z.array(z.string()).default([]),
      cover: image().or(z.string()).optional(),
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
      status: z.enum(["shipped", "building", "archived"]).default("shipped"),
      tags: z.array(z.string()).default([]),
    }),
});

const albums = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/albums" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      cover: image().or(z.string()).optional(),
      pubDatetime: z.date(),
      draft: z.boolean().optional(),
      photos: z
        .array(
          z.object({
            src: image().or(z.string()),
            caption: z.string().optional(),
            alt: z.string().optional(),
          })
        )
        .default([]),
    }),
});

export const collections = { posts, pages, projects, albums };
