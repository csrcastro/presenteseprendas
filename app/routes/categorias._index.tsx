import type { LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import type { ISbStoriesParams } from '@storyblok/react';
import { getStoryblokApi } from '@storyblok/react';

import AsteriskDividerShadow from '~/components/Assets/Dividers/AsteriskDividerShadow';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';
import styles from '~/styles';

export const loader: LoaderFunction = async () => {
  let sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
    starts_with: 'categorias',
  };

  let { data } = await getStoryblokApi().get(`cdn/stories`, {
    ...sbParams,
  });

  return json(data?.stories);
};

const metadata = {
  title: `Aqui encontrarás as melhores sugestões de presentes e prendas`,
  description: `Usa as nossas categorias para descobrir novas ideias de presentes e ficar a par das últimas promoções`,
};

export const meta: V2_MetaFunction<typeof loader> = ({ data: stories }) => [
  ...generateMetadata('categorias', metadata),
  generateStructureddata({
    breadcrumbs: [{ name: 'Categorias', item: 'categorias' }],
    collection: {
      url: 'categorias',
      name: 'Categorias',
      description: 'Descobre as categorias do Presentes e Prendas, de certeza que vais encontrar uma preferida.',
      stories,
    },
  }),
];

export default function Page() {
  const stories = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-7xl px-6 text-center lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className={`${styles.largeHeading}`}>Categorias</h1>
        <p>
          Olá, nós somos os autores do presenteseprendas.pt. É das nossas cabeças que saem todas estas maravilhosas
          ideias que te vão ajudar com o processo de oferecer algo a alguém. Temos montes de ideias para ti e ainda
          óptimas promoções que queremos partilhar contigo!
        </p>
      </div>
      <AsteriskDividerShadow className="mx-auto mb-6 mt-12 h-6 w-auto fill-warm" />
      <ul
        className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 pb-16 
        text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6"
      >
        {stories.map((story) => (
          <li key={story.uuid}>
            <Link to={`/${story.full_slug}`}>
              <div className="mx-auto h-24 w-24 rounded-full p-4 shadow ">
                <img alt={story?.content?.Title} className="h-auto w-full" src={story?.content?.Image?.filename} />
              </div>
            </Link>
            <Link to={`/${story.full_slug}`}>
              <h3 className="text-gray-900 mt-6 text-base font-bold leading-7 tracking-tight">{story.content.Title}</h3>
            </Link>
            <p className="text-gray-600 text-sm leading-6">lol</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
