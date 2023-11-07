import facebookFallback from '~/images/fb-fallback.png';
import pinFallback from '~/images/pin-fallback.png';
import twitterFallback from '~/images/twitter-fallback.png';

export default function generateMetadata(
  canonical: string,
  metadata: { title: string; description: string; image?: string; type?: string; author?: string; category?: string }
) {
  const canon = canonical ? `/${canonical}` : '';

  let result = [
    { title: metadata.title },
    {
      name: 'description',
      content: metadata.description,
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: `${ENV.BASE_URL}${canon}`,
    },
    {
      name: 'copyright',
      content: 'Copyright Presentes e Prendas. Todos os direitos reservados.',
    },
    {
      property: 'og:site_name',
      content: 'Presentes e Prendas',
    },
    {
      property: 'og:title',
      content: metadata.title,
    },

    {
      property: 'og:url',
      content: `${ENV.BASE_URL}${canon}`,
    },
    {
      property: 'og:description',
      content: metadata.description,
    },
    {
      property: 'og:type',
      content: metadata.type,
    },
    {
      property: 'og:locale',
      content: 'pt_PT',
    },
    {
      property: 'article:author',
      content: metadata.author,
    },
    {
      property: 'article:section',
      content: metadata.category,
    },
    {
      property: 'article:content_tier',
      content: 'free',
    },
    {
      property: 'pin:description',
      content: metadata.description,
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:site',
      content: '@presente_prenda',
    },
    {
      property: 'twitter:title',
      content: metadata.title,
    },
    {
      property: 'twitter:description',
      content: metadata.description,
    },
    {
      property: 'twitter:url',
      content: `${ENV.BASE_URL}${canon}`,
    },
    {
      name: 'robots',
      content: 'max-image-preview:large',
    },
    {
      property: 'og:image:heigth',
      content: '630',
    },
    {
      property: 'og:image:width',
      content: '1200',
    },
  ];

  if (metadata.image) {
    result = [
      ...result,
      {
        property: 'og:image',
        content: `${metadata.image}/m/1200x630/smart`,
      },
      {
        property: 'og:image:secure_url',
        content: `${metadata.image}/m/1200x630/smart`,
      },
      {
        property: 'twitter:image',
        content: `${metadata.image}/m/800x418/smart`,
      },
      {
        property: 'pin:media',
        content: `${metadata.image}/m/1000x1500/smart`,
      },
    ];
  } else {
    result = [
      ...result,
      {
        property: 'og:image',
        content: `${ENV.BASE_URL}${facebookFallback}`,
      },
      {
        property: 'og:image:secure_url',
        content: `${ENV.BASE_URL}${facebookFallback}`,
      },

      {
        property: 'twitter:image',
        content: `${ENV.BASE_URL}${twitterFallback}`,
      },
      {
        property: 'pin:media',
        content: `${ENV.BASE_URL}${pinFallback}`,
      },
    ];
  }

  return result;
}
