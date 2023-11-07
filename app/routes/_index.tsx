import { MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/20/solid";
import type { LoaderFunction, MetaArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getStoryblokApi, useStoryblokState } from "@storyblok/react";
import { useState } from "react";

import AsteriskDividerShadow from "~/components/Assets/Dividers/AsteriskDividerShadow";
import PresentesGrid from "~/components/Guias/PresentesGrid";
import PromocoesGrid from "~/components/Promocoes/PromocoesGrid";
import RouteError from "~/components/RouteError";
import FeaturedPromocoesThree from "~/components/Sections/FeaturedPromocoesThree";
import IdeiasCarouselLarge from "~/components/Sections/IdeiasCarouselLarge";
import StaticCategories from "~/components/StaticCategories";
import StaticCategoriesIcons from "~/components/StaticCategoriesIcons";
import listings from "~/config/listings";
import generateMetadata from "~/helpers/metadata";
import generateStructureddata from "~/helpers/structureddata";
import styles from "~/styles";
import type { Promocao } from "~/types/promocao";

import { prisma } from "../db.server";

export function ErrorBoundary() {
  return <RouteError />;
}

const storyblokBaseListParams = {
  sort_by: "published_at:desc",
  is_startpage: false,
  per_page: listings.defaultPerPage,
};

export const loader: LoaderFunction = async () => {
  const cacheRecord = await prisma.cdn.findUnique({
    where: {
      name: "storyblok",
    },
  });

  const storyStoryblokParams = {
    version: ENV.STORYBLOK_EXPLORE,
    cv: Number(cacheRecord?.timestamp),
  };

  const { data } = await getStoryblokApi().get(`cdn/stories/home`, {
    ...storyStoryblokParams,
    resolve_relations: [
      "page.featuredGuias",
      "page.featuredPromocoes",
      "page.Categorias",
    ],
  });

  const listStoryblokParams = {
    ...storyStoryblokParams,
    ...storyblokBaseListParams,
  };

  const guiasInitialState = await getStoryblokApi().get(`cdn/stories`, {
    ...listStoryblokParams,
    starts_with: "guias-de-presentes",
  });

  const promocoesInitialState = await getStoryblokApi().get(`cdn/stories`, {
    ...listStoryblokParams,
    starts_with: "promocoes",
    resolve_relations: ["Promocao.Loja"],
  });

  return json({
    data,
    guiasInitialState,
    promocoesInitialState,
  });
};

const metadata = {
  title: "Presentes e Prendas: a inspiração perfeita para oferecer 🎁",
  description: `Começa a oferecer melhores presentes e prendas. De aniversários ao Natal, todas as ocasiões se vão tornar mais fáceis com a nossa ajuda.`,
};

export const meta: MetaFunction<typeof loader> = ({
  data: { data },
}: MetaArgs) => {
  return [
    ...generateMetadata("", metadata),
    generateStructureddata({
      breadcrumbs: [],
      organization: true,
      website: true,
      collection: {
        url: "",
        name: "Presentes e Prendas",
        description: data.story.content.SeoDescription,
        stories: [
          ...data.story.content.featuredGuias,
          ...data.story.content.featuredPromocoes,
        ],
      },
    }),
  ];
};

function Guias({ guiasInitialState }) {
  const [guias, setGuias] = useState({
    page: 1,
    slices: [guiasInitialState.data.stories],
    total: guiasInitialState.total,
  });

  const loadMoreGuias = async (page: number) => {
    const { data: newGuias } = await getStoryblokApi().get(`cdn/stories`, {
      version: ENV.STORYBLOK_EXPLORE,
      cv: ENV.CV,
      ...storyblokBaseListParams,
      page,
      per_page: listings.defaultPerPage,
    });

    setGuias({
      page,
      slices: [...guias.slices, newGuias.stories],
      total: guias.total,
    });
  };

  return (
    <section
      aria-labelledby="recent-ideias-heading"
      className="mx-auto my-16 max-w-7xl px-8 text-center"
    >
      <h2 className={`${styles.largeHeading} pt-0`} id="recent-ideias-heading">
        Guias de Presentes mais Recentes
      </h2>

      {guias.slices.map((slice, index) => {
        return (
          <div key={`promocoes-grid-${index}`}>
            {index > 0 ? (
              <AsteriskDividerShadow className="mx-auto my-16 h-8 w-auto fill-warm" />
            ) : null}
            <PresentesGrid ideias={slice} />
          </div>
        );
      })}

      {guias.total / listings.defaultPerPage > guias.page ? (
        <button
          className={`${styles.largeButton} ${styles.verMaisButton} mt-16 bg-warm text-white hover:bg-warmer`}
          onClick={() => {
            loadMoreGuias(guias.page + 1);
          }}
        >
          Ver mais
        </button>
      ) : null}
    </section>
  );
}

function Promocoes({ promocoesInitialState }) {
  const [promocoes, setPromocoes] = useState({
    page: 1,
    slices: [promocoesInitialState.data.stories],
    total: promocoesInitialState.total,
  });

  const loadMorePromocoes = async (page: number) => {
    const { data: newpromocoes } = await getStoryblokApi().get(`cdn/stories`, {
      version: ENV.STORYBLOK_EXPLORE,
      cv: ENV.CV,
      ...storyblokBaseListParams,
      page,
      per_page: listings.defaultPerPage,
      resolve_relations: ["Promocao.Loja"],
    });
    setPromocoes({
      page,
      slices: [...promocoes.slices, newpromocoes.stories],
      total: promocoes.total,
    });
  };

  return (
    <section
      aria-labelledby="recent-promocoes-heading"
      className="mx-auto mb-16 max-w-7xl px-8"
    >
      <h2 className={`${styles.largeHeading}`}>Promoções mais recentes</h2>

      {promocoes.slices.map((list, index) => {
        return (
          <div key={`promocoes-grid-${index}`}>
            {index > 0 ? (
              <AsteriskDividerShadow className="mx-auto my-16 h-8 w-auto fill-warm" />
            ) : null}
            <PromocoesGrid promocoes={list} />
          </div>
        );
      })}

      {promocoes.total / listings.defaultPerPage > promocoes.page ? (
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
      ) : null}
    </section>
  );
}

export default function Slug() {
  const { data, guiasInitialState, promocoesInitialState } =
    useLoaderData<typeof loader>();

  const story = useStoryblokState(data.story);

  const { featuredPromocoes, featuredGuias, Categorias } = story?.content;

  return (
    <main className="min-h-screen">
      <section aria-labelledby="category-heading" className="relative bg-warm">
        <div className="absolute inset-x-0 bottom-0">
          <svg
            className="-mb-1 w-full text-background"
            fill="currentColor"
            preserveAspectRatio="none"
            viewBox="0 0 224 12"
          >
            <path
              d={`M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,
            9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z`}
            />
          </svg>
        </div>
        <div className="mx-auto px-4 pb-20 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
          <div className="mx-auto max-w-sm py-12 text-center uppercase sm:max-w-2xl sm:pb-16 sm:pt-12">
            <h1 className="font-serif text-white sm:text-4xl lg:text-5xl">
              A inspiração perfeita para oferecer.
            </h1>
          </div>
          <Form action="pesquisa" method="get">
            <div className="relative max-w-xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-2xl">
              <label className="sr-only" htmlFor="pesquisa">
                Pesquisa no Presentes e Prendas
              </label>
              <div className="flex rounded-md focus-within:shadow-lg">
                <div className="relative flex flex-grow items-stretch">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SparklesIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-cold"
                      height="1.25rem"
                      width="1.25rem"
                    />
                  </div>
                  <input
                    className="block w-full rounded-none rounded-l-md border-0 py-4 pl-10 text-text-light 
                        placeholder:text-text-lighter focus:ring-0 focus:ring-offset-0 sm:text-sm sm:leading-6"
                    id="pesquisa"
                    name="pesquisa"
                    placeholder="Pesquisa aqui..."
                    type="text"
                  />
                </div>
                <button
                  aria-label="Iniciar pesquisa"
                  className="text-md relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-cold px-6 
                  font-serif font-light uppercase tracking-wide text-white hover:bg-colder sm:px-6"
                  type="submit"
                >
                  <span className="hidden sm:block">Pesquisar</span>
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="-ml-1 h-7 w-auto sm:hidden sm:h-4"
                  />
                </button>
              </div>
            </div>
          </Form>
          {/* <StaticCategoriesIcons categorias={Categorias} /> */}
        </div>
        <div className="mx-auto mt-16 max-w-3xl"></div>
      </section>
      <IdeiasCarouselLarge
        ariaId="featured-ideias-heading"
        containerClasses="pb-16 px-16 overflow-hidden"
        heading="Guias de ideias em Destaque"
        ideias={featuredGuias}
      />
      <AsteriskDividerShadow className="mx-auto mb-16 h-8 w-auto fill-warm" />
      <FeaturedPromocoesThree promocoes={featuredPromocoes} />
      <StaticCategories categorias={Categorias} />
      <Promocoes promocoesInitialState={promocoesInitialState} />
      <Guias guiasInitialState={guiasInitialState} />
    </main>
  );
}
