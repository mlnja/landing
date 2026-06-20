import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  return rss({
    title: 'MLOps.Ninja',
    description: 'Field notes from production — practical essays on real ML systems.',
    site: context.site,
    items: sorted.map((post) => {
      const slug = post.id.split('/').pop()?.replace(/\.(md|mdx)$/, '') || post.id;
      return {
        title: post.data.title,
        description: post.data.snippet,
        pubDate: post.data.publishDate,
        link: `/blog/${slug}/`,
        categories: [post.data.lifecycle, post.data.category, ...(post.data.tags ?? [])].filter(Boolean),
        author: post.data.author,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
