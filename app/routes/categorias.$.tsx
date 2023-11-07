import type { LoaderFunction, V2_MetaArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import type { ISbStoriesParams } from '@storyblok/react';

import { getStoryblokApi, useStoryblokState } from '@storyblok/react';
import { useState } from 'react';

import AsteriskDividerShadow from '~/components/Assets/Dividers/AsteriskDividerShadow';
import PresentesGrid from '~/components/Guias/PresentesGrid';
import RichContent from '~/components/Helpers/RichContent';
import PromocoesGrid from '~/components/Promocoes/PromocoesGrid';
import IdeiasCarousel from '~/components/Sections/IdeiasCarousel';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';
import styles from '~/styles';

import type { Promocao } from '~/types/promocao';

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params['*'];
  let sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
    resolve_relations: ['Ideias', 'Promocoes', 'FeaturedIdeias', 'FeaturedPromocoes', 'RelatedCategories'],
  };

  let { data } = await getStoryblokApi().get(`cdn/stories/categorias/${slug}`, sbParams);

  let { data: initialGuias } = await getStoryblokApi().get(`cdn/stories`, {
    version: ENV.STORYBLOK_EXPLORE,
    starts_with: 'guias-de-presentes',
    filter_query: {
      Categoria: { in: data.story.uuid },
    },
    page: 1,
  });

  let { data: initialPromocoes } = await getStoryblokApi().get(`cdn/stories`, {
    version: ENV.STORYBLOK_EXPLORE,
    starts_with: 'promocoes',
    filter_query: {
      Categoria: { in: data.story.uuid },
    },
  });

  const { featuredPromocoes, featuredGuias, relatedCategories } = data.rels.reduce(
    (acc, current) => {
      const guiaPosition = data.story?.content.FeaturedIdeias.indexOf(current.uuid);
      const promocaoPosition = data.story?.content.FeaturedPromocoes.indexOf(current.uuid);
      const relatedCategoryPosition = data.story?.content.RelatedCategories.indexOf(current.uuid);

      if (guiaPosition > -1) {
        acc.featuredGuias.splice(guiaPosition, 0, current);
      }
      if (promocaoPosition > -1) {
        acc.featuredPromocoes.splice(promocaoPosition, 0, current);
      }
      if (relatedCategoryPosition > -1) {
        acc.relatedCategories.splice(relatedCategoryPosition, 0, current);
      }

      return acc;
    },
    {
      featuredPromocoes: [],
      featuredGuias: [],
      relatedCategories: [],
    }
  );

  return json({
    data,
    initialGuias,
    initialPromocoes,
    featuredPromocoes,
    featuredGuias,
    relatedCategories,
  });
};

export const meta: V2_MetaFunction<typeof loader> = ({
  data: { data, initialGuias, initialPromocoes, featuredPromocoes, featuredGuias },
}: V2_MetaArgs) => {
  const metadata = {
    title: data.story.content.SeoTitle,
    description: data.story.content.SeoDescription,
  };
  return [
    ...generateMetadata(data.story.full_slug, metadata),
    generateStructureddata({
      breadcrumbs: [
        { name: 'Categorias', item: 'categorias' },
        { name: data.story.content.Title, item: data.story.full_slug },
      ],
      collection: {
        url: `/${data.story.full_slug}`,
        name: data.story.content.Title,
        description: data.story.content.SeoDescription,
        stories: [...featuredPromocoes, ...featuredGuias, ...initialPromocoes.stories, ...initialGuias.stories],
      },
    }),
  ];
};

export default function Slug() {
  const { data, initialGuias, initialPromocoes, featuredPromocoes, featuredGuias, relatedCategories } =
    useLoaderData<typeof loader>();

  const story = useStoryblokState(data.story);

  const [guias, setGuias] = useState({
    page: 1,
    slices: [initialGuias.stories],
  });

  const [promocoes, setPromocoes] = useState({
    page: 1,
    slices: [initialPromocoes.stories],
  });

  const loadMoreGuias = async (page) => {
    const { data: newGuias } = await getStoryblokApi().get(`cdn/stories`, {
      version: ENV.STORYBLOK_EXPLORE,
      starts_with: 'guias-de-presentes',
      filter_query: {
        Categoria: { in: data.story.uuid },
      },
      page,
    });

    setGuias({
      page,
      slices: [...guias.slices, newGuias.stories],
    });
  };

  const loadMorePromocoes = async (page) => {
    const { data: newPromocoes } = await getStoryblokApi().get(`cdn/stories`, {
      version: ENV.STORYBLOK_EXPLORE,
      starts_with: 'promocoes',
      filter_query: {
        Categoria: { in: data.story.uuid },
      },
      page,
    });

    setPromocoes({
      page,
      slices: [...promocoes.slices, newPromocoes.stories],
    });
  };

  return (
    <main>
      <section aria-labelledby="category-heading">
        <div className="relative overflow-hidden">
          <div className="relative flex aspect-[1380/500] flex-col items-center justify-center overflow-hidden ">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] 
                -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-warm to-warmer 
                opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
            <img
              alt={story?.content?.Title}
              className="absolute inset-0 left-1/2 top-1/2  w-full -translate-x-1/2 -translate-y-1/2 object-fill"
              src={story?.content?.Image?.filename}
            />
            <div className="absolute inset-0 z-10 bg-colder/25" />
            <div className="relative z-20  mx-auto max-w-5xl text-center">
              <h1
                className="font-serif text-3xl
                 uppercase text-background sm:text-5xl md:text-6xl lg:text-5xl"
                id="category-heading"
              >
                {story?.content?.Title}
              </h1>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] z-10 transform-gpu 
            overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2
               bg-gradient-to-tr from-warm to-warmer opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>
        {!!featuredPromocoes.length && (
          <div className="relative z-30 mt-6 pb-4 lg:-mt-32 lg:pb-16">
            <h2 className="sr-only" id="featured-promotions-heading">
              Promoções em Destaque
            </h2>
            <div
              className="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 
            sm:max-w-7xl sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 sm:px-6 lg:gap-x-8 lg:px-8"
            >
              {featuredPromocoes.map((promocao) => (
                <div
                  key={`featured-category-${promocao.uuid}`}
                  className="group relative mx-auto flex w-full max-w-sm flex-col items-center justify-center"
                >
                  <div
                    className="h-64 w-full rounded-lg bg-cover bg-center shadow-md"
                    style={{
                      backgroundImage: `url(${promocao.content?.Image?.filename})`,
                    }}
                  />

                  <div
                    className="mx-4 -mt-10 overflow-hidden rounded-lg bg-white px-4 py-2 shadow-lg 
                  transition-colors duration-[318ms] lg:group-hover:bg-warm"
                  >
                    <h3 className="py-2 text-center font-bold uppercase">{promocao.content.Title}</h3>
                    <Link aria-label={promocao.content.Title} className="capitalize" to={`/${promocao.full_slug}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mx-auto max-w-5xl px-8 py-4 lg:pb-16">
          <p>
            <RichContent document={story?.content.Intro} />
          </p>
        </div>
      </section>

      <IdeiasCarousel
        ariaId="featured-ideias-heading"
        containerClasses="bg-warm py-20 px-8 lg:py-32 lg:px-16 overflow-hidden"
        heading="Guias de ideias em Destaque"
        ideias={featuredGuias}
      />

      <section aria-labelledby="recent-ideias-heading" className="mx-auto max-w-7xl px-8">
        <h2 className={`${styles.largeHeading}`} id="recent-ideias-heading">
          Guias de Ideias Recentes
        </h2>
        {promocoes.slices.map((slice, index) => {
          return (
            <div key={`promocoes-grid-${index}`}>
              <PromocoesGrid promocoes={slice} />
              {index > 0 && <AsteriskDividerShadow className="mx-auto mb-16 h-8 w-auto fill-warm" />}
            </div>
          );
        })}
        <div className="text-center">
          <button
            className={`${styles.largeButton} ${styles.verMaisButton} mt-16 bg-warm text-white hover:bg-warmer`}
            onClick={() => {
              loadMorePromocoes(promocoes.page + 1);
            }}
          >
            Ver mais
          </button>
        </div>
      </section>

      <section aria-labelledby="recent-ideias-heading" className="mx-auto max-w-7xl px-8">
        <h2 className={`${styles.largeHeading}`} id="recent-ideias-heading">
          Guias de Ideias Recentes
        </h2>

        {guias.slices.map((slice, index) => {
          return (
            <div key={`guias-grid-${index}`}>
              {index > 0 && <AsteriskDividerShadow className="mx-auto mb-16 h-8 w-auto fill-warm" />}
              <PresentesGrid ideias={slice} />
            </div>
          );
        })}

        <div className="text-center">
          <button
            className={`${styles.largeButton} ${styles.verMaisButton} mt-16 bg-warm text-white hover:bg-warmer`}
            onClick={() => {
              loadMoreGuias(guias.page + 1);
            }}
          >
            Ver mais
          </button>
        </div>
      </section>

      {!!relatedCategories.length && (
        <section aria-labelledby="recent-ideias-heading" className="mx-auto max-w-7xl px-8 pb-12">
          <h2 className={`${styles.largeHeading} text-colder`} id="recent-ideias-heading">
            Categorias relacionadas com {story?.content?.Title}
          </h2>

          <ul className="flex flex-col items-center justify-center gap-x-4 md:flex-row">
            {relatedCategories.map((category) => {
              return (
                <li key={`category-list-${category.uuid}`} className="pb-8">
                  <Link
                    className="inline-flex items-center gap-x-1.5 rounded-full bg-cold px-10 py-5
                     text-sm font-bold text-white"
                    to={`/${category.full_slug}`}
                  >
                    {category?.content?.Title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
