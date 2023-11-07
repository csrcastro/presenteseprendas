import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { getStoryblokApi } from '@storyblok/react';
import { useEffect, useState } from 'react';

import AsteriskDividerShadow from '~/components/Assets/Dividers/AsteriskDividerShadow';
import PresentesGrid from '~/components/Guias/PresentesGrid';
import PromocoesGrid from '~/components/Promocoes/PromocoesGrid';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';

import type { Promocao } from '~/types/promocao';

async function fetchStories(start: string, term: string, page = 1) {
  const { data } = await getStoryblokApi().get(`cdn/stories`, {
    version: ENV.STORYBLOK_EXPLORE,
    starts_with: start,
    is_startpage: false,
    page,
    search_term: term,
  });

  return data;
}

function fetchGuias(term: string, page = 1) {
  return fetchStories('guias-de-presentes', term, page);
}

async function fetchPromocoes(term: string, page = 1) {
  return fetchStories('promocoes', term, page);
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  const pesquisa = search.get('pesquisa');
  if (!pesquisa) {
    return json({ guias: [], promocoes: [] });
  }

  const guias = await fetchGuias(pesquisa.toString());
  const promocoes = await fetchPromocoes(pesquisa.toString());
  return json({ guias, promocoes, term: pesquisa.toString() });
};

const metadata = {
  title: 'Pesquisa no Presentes e Prendas',
  description: 'Estás à procura de algo específico?',
};
export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    ...generateMetadata('pesquisa', metadata),
    generateStructureddata({
      breadcrumbs: [{ name: 'Pesquisa', item: 'pesquisa' }],
    }),
  ];
};

export default function Pesquisa() {
  const { guias, promocoes, term } = useLoaderData<typeof loader>();

  const [guiasCollection, setGuiasCollection] = useState({
    page: 1,
    slices: [guias.stories],
  });

  const [promocoesCollection, setPromocoesCollection] = useState({
    page: 1,
    slices: [promocoes.stories],
  });

  useEffect(() => {
    setGuiasCollection({
      page: 1,
      slices: [guias.stories],
    });
    setPromocoesCollection({
      page: 1,
      slices: [promocoes.stories],
    });
  }, [guias, promocoes, term]);

  return (
    <main>
      <section aria-labelledby="category-heading">
        <div className="relative bg-warm">
          <div className="mx-auto px-4 pb-20 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
            <Form>
              <div className="relative max-w-xl pt-2 sm:mx-auto sm:max-w-xl sm:pt-8 sm:text-center md:max-w-2xl">
                <div>
                  <label className="sr-only" htmlFor="pesquisa">
                    Pesquisar
                  </label>
                  <div className="mt-2 flex rounded-md shadow-md">
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SparklesIcon aria-hidden="true" className="h-5 w-5 text-text" />
                      </div>
                      <input
                        className="block w-full rounded-none rounded-l-md border-0 py-4 pl-10 
                      text-text-light placeholder:text-text-lighter 
                      focus:ring-2 focus:ring-inset focus:ring-colder sm:text-sm sm:leading-6"
                        defaultValue={term}
                        id="pesquisa"
                        name="pesquisa"
                        placeholder="Pesquisa aqui..."
                        type="text"
                      />
                    </div>
                    <button
                      className="text-md transition-duration-[312ms] relative -ml-px inline-flex items-center gap-x-1.5
                    rounded-r-md bg-text px-6 font-bold uppercase text-white transition-colors hover:bg-warmer sm:px-3"
                      type="submit"
                    >
                      <span className="hidden sm:block">Pesquisar</span>
                      <MagnifyingGlassIcon aria-hidden="true" className="-ml-1 h-7 w-auto sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </section>

      <section aria-labelledby="recent-ideias-heading" className="mx-auto max-w-7xl px-8 pb-16">
        <h2 className="py-12 text-center font-serif text-4xl uppercase text-warm" id="recent-ideias-heading">
          Guias de Ideias Recentes
        </h2>
        {promocoesCollection.slices.map((slice, index) => {
          return (
            <div key={`promocoes-grid-${index}`}>
              <PromocoesGrid promocoes={slice} />
              {index > 0 && <AsteriskDividerShadow className="mx-auto mb-16 h-8 w-auto fill-warm" />}
            </div>
          );
        })}
      </section>

      <section aria-labelledby="recent-ideias-heading" className="mx-auto max-w-7xl px-8">
        <h2 className="py-12 text-center font-serif text-4xl uppercase text-warm" id="recent-ideias-heading">
          Guias de Ideias Recentes
        </h2>

        {guiasCollection.slices.map((slice, index) => {
          return (
            <div key={`guias-grid-${index}`}>
              {index > 0 && <AsteriskDividerShadow className="mx-auto mb-16 h-8 w-auto fill-warm" />}
              <PresentesGrid ideias={slice} />
            </div>
          );
        })}
      </section>
    </main>
  );
}
