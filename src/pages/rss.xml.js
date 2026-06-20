import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const [posts, team] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('team'),
  ]);
  const sorted = posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  return rss({
    title: 'MLOps.Ninja',
    description: 'Field notes from production — practical essays on real ML systems.',
    site: context.site,
    items: sorted.map((post) => {
      const slug = post.id.split('/').pop()?.replace(/\.(md|mdx)$/, '') || post.id;
      const member = team.find(
        (m) => m.id === post.data.author || m.data.firstName.toLowerCase() === post.data.author,
      );
      const email = member?.data.links.email?.replace('mailto:', '');
      const fullName = member ? `${member.data.firstName} ${member.data.lastName}` : post.data.author;
      const author = email ? `${email} (${fullName})` : fullName;
      return {
        title: post.data.title,
        description: post.data.snippet,
        pubDate: post.data.publishDate,
        link: `/blog/${slug}/`,
        categories: [post.data.lifecycle, post.data.category, ...(post.data.tags ?? [])].filter(Boolean),
        author,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
