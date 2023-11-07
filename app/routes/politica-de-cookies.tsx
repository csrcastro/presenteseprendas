import { type LoaderFunction, type V2_MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { ISbStoriesParams } from '@storyblok/react';
import { getStoryblokApi, useStoryblokState } from '@storyblok/react';

import RichText from '~/components/Helpers/RichText';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';
import styles from '~/styles';

const metadata = {
  title: '🍪 Conhece a nossa política de cookies - Presentes e Prendas',
  description: 'Normalmente não temos grande interesse neste tipo de cookies, mas neste caso temos de falar delas.',
};

export const meta: V2_MetaFunction<typeof loader> = () => [
  ...generateMetadata('politica-de-cookies', metadata),
  generateStructureddata({
    breadcrumbs: [{ name: 'Política de Cookies', item: 'politica-de-cookies' }],
  }),
];

export const loader: LoaderFunction = async ({ params: { slug } }) => {
  let sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
  };

  let { data } = await getStoryblokApi().get(`cdn/stories/pages/politica-de-cookies`, sbParams);

  return json({
    data,
  });
};

export default function PerguntasFrequentes() {
  const { data } = useLoaderData<typeof loader>();
  const story = useStoryblokState(data.story);

  if (!story) {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-4 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className={`${styles.mediumHeading}`}>A nossa política de Cookies</h1>
        <dl>
          {story.content?.Conteudo.map((def) => (
            <div key={def._uid} className="mb-8">
              <dt className={`${styles.smallHeading}`}>{def.Title}</dt>
              <dd className="mt-2 text-text-light [&>p]:mb-4 [&>ul>li]:mb-4">
                <RichText document={def.Copy} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
