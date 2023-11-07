import { getStoryblokApi } from '@storyblok/react';
import type { ISbStoriesParams } from '@storyblok/react';

interface Link {
  id: number;
  slug: string;
}

interface Links<T> {
  [key: string]: T;
}

export const loader = async () => {
  let per_page = 100;
  let page = 1;
  let all_links: Link[] = [];

  let sbParams: ISbStoriesParams = {
    page,
    paginated: 1,
    per_page,
    version: 'published',
    excluding_slugs: 'home,pages,layout/*',
  };

  let response = await getStoryblokApi().get(`cdn/links`, sbParams);

  function digestLinks(allLinks: Link[]) {
    let sitemap_entries = allLinks.map((link: Link) => {
      return `<url><loc>https://presenteseprendas.pt/${link.slug}</loc></url>`;
    });

    return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
    xmlns:image="http://www.sitemaps.org/schemas/sitemap-image/1.1" 
    xmlns:video="http://www.sitemaps.org/schemas/sitemap-video/1.1">
    ${sitemap_entries.join('')}</urlset>`;
  }

  function allLinksPush(links: Links<Link>) {
    Object.keys(links).forEach((key: string) => {
      const { slug } = links[key];

      if (
        slug.startsWith('layout') ||
        slug === 'home' ||
        slug === 'pages' ||
        slug === 'guias-de-presentes/' ||
        slug === 'promocoes/' ||
        /categorias\/.*\/$/.test(slug)
      ) {
        return;
      }

      if (slug.includes('pages/')) {
        all_links.push({
          ...links[key],
          slug: slug.replace('pages/', ''),
        });
        return;
      }
      all_links.push(links[key]);
    });
  }

  allLinksPush(response.data.links);

  const total = response.headers.total;
  const maxPage = Math.ceil(total / per_page);

  if (maxPage <= 1) {
    return new Response(digestLinks(all_links), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'xml-version': '1.0',
        encoding: 'UTF-8',
      },
    });
  }

  let contentRequests = [];

  for (let page = 2; page <= maxPage; page++) {
    contentRequests.push(getStoryblokApi().get(`cdn/links`, { ...sbParams, page }));
  }

  await Promise.all(contentRequests).then((responses) => {
    responses.forEach((resp) => {
      allLinksPush(resp.data.links);
    });
  });

  return new Response(digestLinks(all_links), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};
