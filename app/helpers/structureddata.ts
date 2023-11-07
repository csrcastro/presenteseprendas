import type { ISbStoryData } from '@storyblok/react';

import structuredData from '~/config/structuredData';

function generateBreadcrumbs(breadcrumbs: { name: string; item: string }[] | undefined) {
  if (!breadcrumbs) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: `${ENV.BASE_URL}`,
      },
      ...breadcrumbs.map(({ name, item }, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name,
        item: `${ENV.BASE_URL}/${item}`,
      })),
    ],
  };
}

function generateOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: structuredData.name,
    description: structuredData.description,
    url: ENV.BASE_URL,
    sameAs: structuredData.sameAs,
    logo: {
      '@type': 'ImageObject',
      url: `${ENV.BASE_URL}${structuredData.logoPath}`,
      width: 350,
      height: 350,
    },
  };
}

function generateWebsite() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', url: ENV.BASE_URL, name: structuredData.name };
}

function generateCollection(
  collection: { url: string; name: string; description: string; stories: ISbStoryData[] } | undefined
) {
  if (!collection) {
    return null;
  }

  const { url, name, description, stories } = collection;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: `${ENV.BASE_URL}/${url}`,
    name,
    description,
    inLanguage: 'pt-PT',
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'descending',
      itemListElement: stories.map((story) => {
        return {
          '@type': 'ListItem',
          position: 1,
          name: `${story?.content?.Title}`,
          url: `${ENV.BASE_URL}/${story?.full_slug}`,
          image: {
            '@type': 'ImageObject',
            url: `${story?.content?.Image?.filename}/m/1000x1000`,
            width: 1000,
            height: 1000,
          },
        };
      }),
    },
  };
}

function generatePresentList(
  presentList: { ProductName: string; ProductImage: string; ProductBrand: string; ProductPrice: number }[] | undefined
) {
  if (!presentList) {
    return null;
  }
  return {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    itemListElement: presentList.map(
      (
        {
          ProductName,
          ProductImage,
          ProductBrand,
          ProductPrice,
        }: { ProductName: string; ProductImage: string; ProductBrand: string; ProductPrice: number },
        index: number
      ) => {
        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: ProductName,
            image: ProductImage,
            brand: { '@type': 'Brand', name: ProductBrand },
            offers: { '@type': 'Offer', price: ProductPrice, priceCurrency: 'EUR' },
          },
        };
      }
    ),
  };
}

function generateArticle(story: Boolean | undefined) {
  if (!story) {
    return null;
  }
  return {
    '@context': 'http://schema.org',
    '@type': 'Article',
    isAccessibleForFree: true,
    mainEntityOfPage: `${ENV.BASE_URL}/${story.full_slug}`,
    description: story.content.ShortDescription,
    headline: story.content.Title,
    datePublished: story.published_at,
    dateModified: story.updated_at,
    author: [
      {
        '@type': 'Person',
        name: story.content.Autor.content.Nome,
        url: `${ENV.BASE_URL}/${story.content.Autor.full_slug}`,
        jobTitle: 'Autor no Presentes e Prendas',
      },
    ],
    articleSection: story.content.Categoria.content.Title,
    keywords: ['promoção', 'achado', 'pechincha', 'redução', 'rebaixa'],
    publisher: generateOrganization(true),
    image: {
      '@type': 'ImageObject',
      url: `${story.content.Image?.filename}/m/1280x1280/smart`,
      width: 1280,
      representativeOfPage: true,
    },
  };
}

export default function generateStructureddata({
  breadcrumbs,
  organization,
  website,
  collection,
  article,
  presentList,
}: {
  breadcrumbs?: { name: string; item: string }[];
  organization?: Boolean;
  website?: Boolean;
  collection?: { url: string; name: string; description: string; stories: ISbStoryData[] };
  article?: any;
  presentList?: { ProductName: string; ProductImage: string; ProductBrand: string; ProductPrice: number }[];
}) {
  let result = [];

  if (breadcrumbs) {
    result.push(generateBreadcrumbs(breadcrumbs));
  }
  if (organization) {
    result.push(generateOrganization());
  }
  if (website) {
    result.push(generateWebsite());
  }
  if (collection) {
    result.push(generateCollection(collection));
  }
  if (article) {
    result.push(generateArticle(article));
  }
  if (presentList) {
    result.push(generatePresentList(presentList));
  }

  return {
    'script:ld+json': result,
  };
}
