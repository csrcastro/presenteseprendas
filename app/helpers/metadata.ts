export default function generateMetadata(
  canonical: string,
  metadata: {
    title: string;
    description: string;
    image?: string;
    type?: string;
    author?: string;
    category?: string;
  },
) {
  const canon = canonical ? `/${canonical.replace(/\/$/, "")}` : "";

  let result = [
    { title: metadata.title },
    {
      name: "description",
      content: metadata.description,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `${ENV.BASE_URL}${canon}`,
    },
    {
      name: "copyright",
      content: "Copyright Presentes e Prendas. Todos os direitos reservados.",
    },
    {
      property: "og:site_name",
      content: "Presentes e Prendas",
    },
    {
      property: "og:title",
      content: metadata.title,
    },
    {
      property: "og:url",
      content: `${ENV.BASE_URL}${canon}`,
    },
    {
      property: "og:description",
      content: metadata.description,
    },
    {
      property: "og:type",
      content: metadata.type || "website",
    },
    {
      property: "og:locale",
      content: "pt_PT",
    },
    {
      property: "og:email",
      content: "presenteseprendas.pt@gmail.com",
    },
    {
      property: "article:content_tier",
      content: "free",
    },
    {
      property: "pin:description",
      content: metadata.description,
    },
    {
      property: "fb:page_id",
      content: "104040472799130",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:site",
      content: "@presenteprendas",
    },
    {
      name: "twitter:title",
      content: metadata.title,
    },
    {
      name: "twitter:description",
      content: metadata.description,
    },
    {
      name: "twitter:url",
      content: `${ENV.BASE_URL}${canon}`,
    },
    {
      name: "robots",
      content: "max-image-preview:large",
    },
    {
      property: "og:image:heigth",
      content: "630",
    },
    {
      property: "og:image:width",
      content: "1200",
    },
  ];

  if (metadata.author) {
    result = [
      ...result,
      {
        property: "article:author",
        content: metadata.author,
      },
    ];
  }

  if (metadata.category) {
    result = [
      ...result,
      {
        property: "article:section",
        content: metadata.category,
      },
    ];
  }

  if (metadata.image) {
    result = [
      ...result,
      {
        property: "og:image",
        content: `${metadata.image}/m/1280x960/smart`,
      },
      {
        property: "og:image:secure_url",
        content: `${metadata.image}/m/1280x960/smart`,
      },
      {
        name: "twitter:image",
        content: `${metadata.image}/m/1280x960/smart`,
      },
      {
        property: "pin:media",
        content: `${metadata.image}/m/1000x1500/smart`,
      },
    ];
  } else {
    result = [
      ...result,
      {
        property: "og:image",
        content: "/fb-fallback.png",
      },
      {
        property: "og:image:secure_url",
        content: "/fb-fallback.png",
      },

      {
        name: "twitter:image",
        content: "/twitter-fallback.png",
      },
      {
        property: "pin:media",
        content: "/pin-fallback.png",
      },
    ];
  }

  return result;
}
