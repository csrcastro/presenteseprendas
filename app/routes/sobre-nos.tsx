import { type LoaderFunction, type V2_MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { ISbStoriesParams } from '@storyblok/react';
import { StoryblokComponent, getStoryblokApi, useStoryblokState } from '@storyblok/react';

import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';

const metadata = {
  title: 'O que somos, quem somos e porque o fazemos - Presentes e Prendas',
  description: 'Fica a saber tudo sobre esta plataforma, como tudo começou, quem é a equipa e quais nossos valores',
};

export const meta: V2_MetaFunction<typeof loader> = () => [
  ...generateMetadata('sobre-nos', metadata),
  generateStructureddata({
    breadcrumbs: [{ name: 'Sobre nós', item: 'sobre-nos' }],
    organization: true,
    website: true,
  }),
];

export const loader: LoaderFunction = async () => {
  let sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
  };

  const { data } = await getStoryblokApi().get(`cdn/stories/pages/sobre-nos`, {
    ...sbParams,
  });

  return json(data);
};

export default function Page() {
  let { story } = useLoaderData<typeof loader>();

  let blok = useStoryblokState(story);

  return <StoryblokComponent blok={blok?.content} />;
}
