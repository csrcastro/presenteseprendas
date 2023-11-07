import type { LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { ISbStoriesParams } from '@storyblok/react';
import { getStoryblokApi, useStoryblokState } from '@storyblok/react';
import { useState } from 'react';

import Landing from '~/components/Guias/Landing';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';

const metadata = {
  title: `As melhores opções de presentes para todas as ocasiões`,
  description: `À procura do presente perfeito? Nós também... e o resultado está nesta página de guias, 
  onde encontrará sugestões de presentes e prendas para todos os gostos e ocasiões.`,
};

export const meta: V2_MetaFunction<typeof loader> = ({ data: { landing, stories } }) => {
  return [
    ...generateMetadata('guias-de-presentes', metadata),
    generateStructureddata({
      breadcrumbs: [{ name: 'Guias de Presentes', item: 'guias-de-presentes' }],
      collection: {
        url: 'guias-de-presentes',
        name: 'Guias de Presentes',
        description: landing.story.content.SeoDescription,
        stories: [...landing.story.content.OurPicks, ...stories],
      },
    }),
  ];
};

export const loader: LoaderFunction = async () => {
  let sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
    starts_with: 'guias-de-presentes',
    is_startpage: false,
    per_page: 12,
  };

  const { data: landing } = await getStoryblokApi().get(`cdn/stories/guias-de-presentes`, {
    version: ENV.STORYBLOK_EXPLORE,
    resolve_relations: ['GuiasLanding.OurPicks'],
  });

  const { data } = await getStoryblokApi().get(`cdn/stories`, {
    ...sbParams,
  });

  const { stories } = data;

  return json({ landing, stories });
};

export default function Page() {
  let { landing, stories } = useLoaderData<typeof loader>();

  const landingState = useStoryblokState(landing.story);

  const [recent, setRecent] = useState(stories);

  const loadMoreRecent = async (page) => {
    const { data } = await getStoryblokApi().get(`cdn/stories`, {
      version: ENV.STORYBLOK_EXPLORE,
      starts_with: 'guias-de-presentes',
      is_startpage: false,
      page: 2,
      per_page: 12,
    });

    setRecent([...recent, ...data.stories]);
  };

  return (
    <Landing
      blok={landingState?.content}
      loadMoreRecent={loadMoreRecent}
      picks={landingState?.content?.OurPicks}
      recent={recent}
    />
  );
}
