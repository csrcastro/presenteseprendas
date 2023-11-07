import type { LoaderFunction, V2_MetaArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { ISbStoriesParams } from '@storyblok/react';

import { StoryblokComponent, getStoryblokApi, useStoryblokState } from '@storyblok/react';

import { DiscussionEmbed } from 'disqus-react';

import Breadcrumbs from '~/components/Breadcrumbs';

import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';

export const loader: LoaderFunction = async ({ params: { slug } }) => {
  let sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
    resolve_relations: ['Promocao.Autor', 'Promocao.Categoria', 'Promocao.Loja'],
  };

  let { data } = await getStoryblokApi().get(`cdn/stories/promocoes/${slug}`, sbParams);

  return json(data);
};

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }: V2_MetaArgs) => {
  if (!data) {
    return [
      ...generateMetadata(`${ENV.BASE_URL}${location}`, {
        title: 'Error',
        description: 'error',
      }),
    ];
  }

  const metadata = {
    title: data.story.content.SeoTitle,
    description: data.story.content.SeoDescription,
    image: data.story.content.Image.filename,
    type: 'article',
    author: data.story.content.Autor.content.Nome,
    category: data.story.content.Categoria.content.Title,
  };

  return [
    ...generateMetadata(data.story.full_slug, metadata),
    generateStructureddata({
      breadcrumbs: [
        { name: 'Promoções', item: 'promocoes' },
        { name: data.story.content.Title, item: data.story.full_slug },
      ],
      article: data.story,
    }),
  ];
};

export default function Slug() {
  const data = useLoaderData<typeof loader>();
  const story = useStoryblokState(data.story);
  return (
    <main className="mx-auto max-w-7xl p-6 lg:px-8">
      <div className="grid lg:grid-cols-5">
        <div className="col-span-3">
          <div className="mx-auto mb-6 max-w-7xl">
            <aside className="rounded bg-warm/5 px-4 py-4 italic text-text-light">
              <p className="text-xs">
                Esperamos que gostes desta Promoção, ela foi selecionada independentemente por um dos nossos autores. A
                Presentes e Prendas poderá receber uma parte das vendas e/ou outros tipos de compensação através dos
                links nesta página.
              </p>
            </aside>
          </div>
          <div>
            <Breadcrumbs category={story?.content.Categoria} />
          </div>

          <StoryblokComponent blok={story?.content} />

          <aside className="pb-16">
            <DiscussionEmbed
              config={{
                url: `https://presenteseprendas.pt/${story?.full_slug}`,
                identifier: story?.uuid,
                title: story?.name,
                language: 'pt', //e.g. for Traditional Chinese (Taiwan)
              }}
              shortname="presenteseprendas"
            />
          </aside>
        </div>
        <div className="col-span-2"></div>
      </div>
    </main>
  );
}
