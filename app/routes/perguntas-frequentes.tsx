import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { type LoaderFunction, type V2_MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { ISbStoriesParams } from '@storyblok/react';
import { getStoryblokApi, useStoryblokState } from '@storyblok/react';

import RichContent from '~/components/Helpers/RichContent';
import generateMetadata from '~/helpers/metadata';
import generateStructureddata from '~/helpers/structureddata';
import styles from '~/styles';

const metadata = {
  title: 'Dúvidas acerca da Presentes e Prendas? Vê a resposta aqui.',
  description: 'Vamos responder aquelas questões mundanas que te podem passar pela cabeça.',
};

export const meta: V2_MetaFunction<typeof loader> = () => [
  ...generateMetadata('perguntas-frequentes', metadata),
  generateStructureddata({
    breadcrumbs: [{ name: 'Perguntas Frequentes', item: 'perguntas-frequentes' }],
  }),
];

export const loader: LoaderFunction = async ({ params: { slug } }) => {
  let sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
  };

  let { data } = await getStoryblokApi().get(`cdn/stories/pages/perguntas-frequentes`, sbParams);

  return json({
    data,
  });
};

export default function PerguntasFrequentes() {
  const { data } = useLoaderData<typeof loader>();
  const story = useStoryblokState(data.story);
  const faqs = story?.content?.Conteudo;

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="divide mx-auto max-w-4xl divide-y">
        <h1 className={`${styles.largeHeading}`}>Perguntas Frequentes</h1>
        <dl className="divide mb-16 space-y-6 divide-y">
          {faqs.map((faq) => (
            <Disclosure key={faq._uid} as="div" className="pt-6" defaultOpen={true}>
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left">
                      <span className="font-serif font-light">{faq.Title}</span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <MinusSmallIcon aria-hidden="true" className="h-6 w-6" />
                        ) : (
                          <PlusSmallIcon aria-hidden="true" className="h-6 w-6" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-2 pr-12 text-sm text-text-light">
                    <RichContent document={faq.Copy} />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </main>
  );
}
