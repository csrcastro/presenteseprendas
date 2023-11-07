import type { LoaderFunction, V2_MetaArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getStoryblokApi, useStoryblokState } from '@storyblok/react';
import type { ISbStoriesParams, ISbStoryData, TUseStoryblokState } from '@storyblok/react';

import { useState } from 'react';

import AsteriskDividerShadow from '~/components/Assets/Dividers/AsteriskDividerShadow';

import RichText from '~/components/Helpers/RichText';
import PromocoesGrid from '~/components/Promocoes/PromocoesGrid';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';
import styles from '~/styles';
import type { Promocao } from '~/types/promocao';

let sbParams: ISbStoriesParams = {
  version: ENV.STORYBLOK_EXPLORE,
};

async function fetchPromocoes(filter: string, page = 1) {
  return await getStoryblokApi().get(`cdn/stories`, {
    ...sbParams,
    starts_with: 'promocoes',
    is_startpage: false,
    page,
    filter_query: {
      Loja: { in: filter },
    },
    resolve_relations: ['Promocao.Loja'],
  });
}

export const loader: LoaderFunction = async ({ params: { slug } }) => {
  let { data } = await getStoryblokApi().get(`cdn/stories/lojas/${slug}`, sbParams);

  let { data: promocoesInitialState, total } = await fetchPromocoes(data.story.uuid, 1);

  return json({
    data,
    promocoesInitialState,
    total,
  });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data: { data } }: V2_MetaArgs) => {
  const metadata = {
    title: `Loja: ${data.story.content.Title} - Presentes e Prendas`,
    description: data.story.content.ShortBio,
  };
  return [
    ...generateMetadata(data.story.full_slug, metadata),
    generateStructureddata({
      breadcrumbs: [
        { name: 'Lojas', item: 'lojas' },
        { name: data.story.content.Title, item: data.story.full_slug },
      ],
    }),
  ];
};

export default function Slug() {
  const { data, promocoesInitialState, total } = useLoaderData<typeof loader>();
  const story = useStoryblokState(data.story);

  const [promocoes, setPromocoes] = useState({
    page: 1,
    slices: [promocoesInitialState.stories],
    total,
  });

  if (!story) {
    return null;
  }

  const loadMorePromocoes = async (page: number) => {
    const { data: promocoesSlice } = await fetchPromocoes(data.story.uuid, page);
    setPromocoes({
      page,
      slices: [...promocoes.slices, promocoesSlice.stories],
      total: promocoes.total,
    });
  };

  return (
    <main>
      <article>
        <div className="bg-colder px-6 pt-6">
          <div className="relative z-10 mx-auto max-w-5xl rounded bg-white p-12 shadow">
            <div className="flex flex-col items-center md:flex-row">
              <img
                alt={story?.content?.Title}
                className="inline-block h-32 w-32 rounded-3xl lg:mr-12"
                src={story?.content?.Image?.filename}
              />
              <div className="mt-12 lg:mt-0">
                <h1 className="mb-4 font-serif text-2xl font-light">{story?.content?.Title}</h1>
                <RichText document={story?.content.Bio} />
              </div>
            </div>
          </div>
        </div>
      </article>
      <section className="-mt-12 bg-background  pt-12">
        <div aria-labelledby="recent-promocoes-heading" className="mx-auto  max-w-7xl  px-8 py-16">
          <h2 className="sr-only">Promoções na {story?.content?.Title}</h2>

          {promocoes.slices.map((list: Promocao[], index) => {
            return (
              <div key={`promocoes-grid-${index}`}>
                {index > 0 && <AsteriskDividerShadow className="mx-auto my-16 h-8 w-auto fill-cold" />}
                <PromocoesGrid promocoes={list} />
              </div>
            );
          })}

          {promocoes.page < promocoes.total && (
            <div className="text-center">
              <button
                className={`${styles.largeButton} ${styles.verMaisButton} mt-16 bg-cold text-white hover:bg-colder`}
                onClick={() => {
                  loadMorePromocoes(promocoes.page + 1);
                }}
              >
                Ver mais
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
