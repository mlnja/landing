import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    draft: z.boolean().default(false),
    title: z.string(),
    snippet: z.string(),
    cover: z.object({
      src: image(),
      alt: z.string(),
    }),
    publishDate: z.string().transform(str => new Date(str)),
    author: z.string().default('virviil'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    lifecycle: z.string().optional(),
    lifecycleSection: z.string().optional(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) => z.object({
    firstName: z.string(),
    lastName: z.string(),
    role: z.string(),
    handle: z.string(),
    org: z.string().default('MLOps.Ninja'),
    avatar: z.object({
      src: image(),
      alt: z.string()
    }),
    bio: z.string(),
    tags: z.array(z.string()),
    links: z.object({
      x: z.string().optional(),
      threads: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      telegram: z.string().optional(),
      email: z.string().optional()
    }),
    url: z.string(),
    draft: z.boolean().default(false)
  }),
});

export const collections = { blog, team };
