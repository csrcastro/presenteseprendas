import type { LoaderFunction, V2_MetaArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { ISbStoriesParams } from '@storyblok/react';
import { getStoryblokApi, useStoryblokState } from '@storyblok/react';
import { useState } from 'react';

import Landing from '~/components/Promocoes/Landing';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';

export const loader: LoaderFunction = async () => {
  let sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
    starts_with: 'promocoes',
    is_startpage: false,
    per_page: 12,
  };

  const { data: landing } = await getStoryblokApi().get(`cdn/stories/promocoes`, {
    version: ENV.STORYBLOK_EXPLORE,
    resolve_relations: ['Collection.OurPicks'],
  });

  const { data } = await getStoryblokApi().get(`cdn/stories`, {
    ...sbParams,
  });

  const { stories } = data;

  return json({ landing, stories });
};

const metadata = {
  title: 'Promoções e descontos. Nós partilhamos contigo as melhores',
  description: `Todos gostamos de uma boa promoçāo, -20% aqui, -10% ali, e lá vamos nós poupando uns 
  euros. No Presentes e Prendas partilhamos contigo promoções que achamos valer a pena`,
};

export const meta: V2_MetaFunction<typeof loader> = ({ data: { landing, stories } }: V2_MetaArgs) => {
  return [
    ...generateMetadata(landing.story.full_slug, metadata),
    generateStructureddata({
      breadcrumbs: [{ name: 'Promoções', item: 'promocoes' }],
      collection: {
        url: 'promocoes',
        name: 'Promocoes',
        description: landing.story.content.SeoDescription,
        stories: [...landing.story.content.OurPicks, ...stories],
      },
    }),
  ];
};

export default function Page() {
  let { landing, stories } = useLoaderData<typeof loader>();

  const landingState = useStoryblokState(landing.story);

  const [recent, setRecent] = useState(stories);

  const loadMoreRecent = async () => {
    const { data } = await getStoryblokApi().get(`cdn/stories`, {
      version: ENV.STORYBLOK_EXPLORE,
      starts_with: 'promocoes',
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
      picks={landing?.story?.content?.OurPicks}
      recent={recent}
    />
  );
}
