import { ArrowRightIcon } from '@heroicons/react/20/solid';
import type { LoaderFunction, V2_MetaArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import type { ISbStoriesParams, ISbStoryData } from '@storyblok/react';

import { getStoryblokApi, useStoryblokState } from '@storyblok/react';
import { useState } from 'react';

import AsteriskDividerShadow from '~/components/Assets/Dividers/AsteriskDividerShadow';
import PresentesGrid from '~/components/Guias/PresentesGrid';

import RichContent from '~/components/Helpers/RichContent';
import RichText from '~/components/Helpers/RichText';
import PromocoesGrid from '~/components/Promocoes/PromocoesGrid';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';
import styles from '~/styles';
import type { Promocao } from '~/types/promocao';
let sbParams: ISbStoriesParams = {
  version: ENV.STORYBLOK_EXPLORE,
};

async function storiesService(start: string, autor: string, page = 1) {
  return await getStoryblokApi().get(`cdn/stories`, {
    ...sbParams,
    starts_with: start,
    is_startpage: false,
    page,
    filter_query: {
      Autor: { in: autor },
    },
  });
}

const fetchGuias = (autor: string, page = 1) => storiesService('guias-de-presentes', autor, page);
const fetchPromocoes = (autor: string, page = 1) => storiesService('promocoes', autor, page);

export const loader: LoaderFunction = async ({ params: { slug } }) => {
  let { data } = await getStoryblokApi().get(`cdn/stories/autores/${slug}`, {
    ...sbParams,
    resolve_relations: ['Autor.Guias', 'Autor.Promocoes'],
  });

  let { data: guiasInitialState, total: totalGuias } = await fetchGuias(data.story.uuid);

  let { data: promocoesInitialState, total: totalPromocoes } = await fetchPromocoes(data.story.uuid);

  return json({
    data,
    guiasInitialState,
    totalGuias,
    promocoesInitialState,
    totalPromocoes,
  });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data: { data } }: V2_MetaArgs) => {
  const metadata = {
    title: `${data.story.content.Nome}: autor(a) na Presentes e Prendas`,
    description: data.story.content.ShortBio,
  };
  return [
    ...generateMetadata(data.story.full_slug, metadata),
    generateStructureddata({
      breadcrumbs: [
        { name: 'Autores', item: 'autores' },
        { name: data.story.content.Nome, item: data.story.full_slug },
      ],
    }),
  ];
};

export default function Slug() {
  const { data, guiasInitialState, totalGuias, promocoesInitialState, totalPromocoes } = useLoaderData<typeof loader>();
  const story = useStoryblokState(data.story);

  const [promocoes, setPromocoes] = useState({
    page: 1,
    slices: [promocoesInitialState.stories],
    total: totalPromocoes,
  });

  const loadMorePromocoes = async (page: number) => {
    const { data: promocoesSlice } = await fetchPromocoes(data.story.uuid, page);
    setPromocoes({
      page,
      slices: [...promocoes.slices, promocoesSlice.stories],
      total: promocoes.total,
    });
  };

  const [guias, setGuias] = useState({
    page: 1,
    slices: [guiasInitialState.stories],
    total: totalGuias,
  });

  const loadMoreGuias = async (page: number) => {
    const { data: guiasSlice } = await fetchGuias(data.story.uuid, page);
    setGuias({
      page,
      slices: [...guias.slices, guiasSlice.stories],
      total: guias.total,
    });
  };

  return (
    <main>
      <article>
        <div className="bg-warm px-4  pt-6 lg:px-8">
          <div className="relative z-10 mx-auto max-w-5xl rounded bg-white p-6 shadow lg:p-12">
            <div className="flex flex-col items-center lg:flex-row">
              <img
                alt={story?.content.Nome}
                className="h-32 w-32 grow-0 rounded-full object-cover ring-4 ring-warm/75 lg:mr-12"
                src={story?.content.Foto.filename}
              />
              <div className="grow">
                <h1 className="mb-4 mt-8 text-center font-serif text-4xl font-light lg:mt-0 lg:text-left">
                  {story?.content.Nome}
                </h1>
                <RichText document={story?.content.Bio} />
              </div>
            </div>
          </div>
        </div>
        <div className="-mt-12 bg-background px-8">
          <div className="mx-auto max-w-5xl  pt-12">
            <h2 className="py-16 text-center font-serif text-4xl uppercase">As minhas escolhas</h2>
            <section aria-labelledby="products-heading" className="mx-auto max-w-7xl overflow-hidden pb-2">
              <h2 className="sr-only">As minhas promoções favoritas</h2>
              <PromocoesGrid promocoes={story?.content.Promocoes} />
            </section>
          </div>
          <AsteriskDividerShadow className="mx-auto my-16 h-8 w-auto fill-warm" />
          <div className="mx-auto max-w-5xl pb-16">
            <section aria-labelledby="products-heading" className="mx-auto max-w-7xl overflow-hidden">
              <h3 className="sr-only">Os meus guias favoritos</h3>
              <PresentesGrid ideias={story?.content.Guias} />
            </section>
          </div>
        </div>
        <div className="bg-white">
          <div className="mx-auto max-w-5xl px-8 py-24">
            <div className="grid gap-6 sm:grid-cols-2">
              <section aria-labelledby="products-heading" className="">
                <h3 className="mb-8 font-serif text-2xl text-colder md:text-3xl lg:text-4xl">Guias recentes</h3>

                {guias.slices.map((slice) =>
                  slice.map((story: ISbStoryData) => (
                    <div key={story.uuid} className="group relative mb-6 grid grid-cols-3 gap-6">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg">
                        <Link to={`/${story.full_slug}`}>
                          <img
                            alt={story.content.Image.alt || story.content.SeoTitle}
                            className="object-cover object-center"
                            src={story.content.Image.filename}
                          />
                        </Link>
                      </div>
                      <div className="col-span-2">
                        <h3 className="font-bold">
                          <Link className="capitalize" to={`/${story.full_slug}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            <RichContent document={story.content.Title} />
                          </Link>
                        </h3>
                        <div className="mt-4">
                          <Link
                            className="inline-flex items-center text-text-light hover:text-cold"
                            to={story.content.Link}
                          >
                            ver guia <ArrowRightIcon aria-hidden="true" className="nt-0.5 -mr-0.5 ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {guias.page < guias.total && (
                  <div className="text-center">
                    <button
                      className={`${styles.largeButton} ${styles.verMaisButton} 
                      mt-16 bg-cold text-white hover:bg-colder`}
                      onClick={() => {
                        loadMoreGuias(guias.page + 1);
                      }}
                    >
                      Ver mais
                    </button>
                  </div>
                )}
              </section>

              <section aria-labelledby="products-heading" className="">
                <h3 className="mb-8 font-serif text-2xl text-colder md:text-3xl lg:text-4xl">Promoções recentes</h3>
                {promocoes.slices.map((slice) =>
                  slice.map((story: ISbStoryData) => (
                    <div key={story.uuid} className="group relative mb-6 grid grid-cols-3 gap-6">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg">
                        <Link to={`/${story.full_slug}`}>
                          <img
                            alt={story.content.Image.alt || story.content.SeoTitle}
                            className="h-full w-full object-cover object-center"
                            src={story.content.Image.filename}
                          />
                        </Link>
                      </div>
                      <div className="col-span-2">
                        <h3 className="font-bold ">
                          <Link to={`/${story.full_slug}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {story.content.Title}
                          </Link>
                        </h3>
                        <div className="mt-4">
                          <Link
                            className="inline-flex items-center text-text-light hover:text-cold"
                            to={`/${story.full_slug}`}
                          >
                            ver promoção <ArrowRightIcon aria-hidden="true" className="-mr-0.5 ml-1 mt-0.5 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {promocoes.page < promocoes.total && (
                  <div className="text-center">
                    <button
                      className={`${styles.largeButton} ${styles.verMaisButton} 
                      mt-16 bg-cold text-white hover:bg-colder`}
                      onClick={() => {
                        loadMorePromocoes(promocoes.page + 1);
                      }}
                    >
                      Ver mais
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
