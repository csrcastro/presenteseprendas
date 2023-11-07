import type { LoaderFunction, MetaArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ISbStoriesParams } from "@storyblok/react";
import {
  StoryblokComponent,
  getStoryblokApi,
  useStoryblokState,
} from "@storyblok/react";
import { DiscussionEmbed } from "disqus-react";

import Breadcrumbs from "~/components/Breadcrumbs";
import RouteError from "~/components/RouteError";
import generateMetadata from "~/helpers/metadata";
import generateStructureddata from "~/helpers/structureddata";

export function ErrorBoundary() {
  return <RouteError />;
}

export const loader: LoaderFunction = async ({ params: { slug } }) => {
  const sbParams: ISbStoriesParams = {
    resolve_relations: [
      "Guia.Autor",
      "Presente.Loja",
      "Guia.Categoria",
      "Categoria.Parents",
    ],
    version: ENV.STORYBLOK_EXPLORE,
  };

  const { data } = await getStoryblokApi().get(
    `cdn/stories/guias-de-presentes/${slug}`,
    sbParams,
  );

  return json(data);
};

export const meta: MetaFunction<typeof loader> = ({
  data,
  location,
}: MetaArgs) => {
  if (!data) {
    return [
      ...generateMetadata(`${ENV.BASE_URL}${location}`, {
        title: "Error",
        description: "error",
      }),
    ];
  }

  const metadata = {
    title: data.story.content.SeoTitle,
    description: data.story.content.SeoDescription,
    image: data.story.content.Image.filename,
    type: "article",
    author: data.story.content.Autor.content.Nome,
    category: data.story.content.Categoria.content.Title,
  };
  return [
    ...generateMetadata(data.story.full_slug, metadata),
    generateStructureddata({
      breadcrumbs: [
        { name: "Guias de Presentes", item: "guias-de-presentes" },
        { name: data.story.content.Title, item: data.story.full_slug },
      ],
      article: data.story,
      presentList: data.story.content.Presentes,
    }),
  ];
};

export default function Slug() {
  const data = useLoaderData<typeof loader>();
  const story = useStoryblokState(data.story);

  return (
    <main className="mx-auto max-w-7xl p-6 lg:px-8">
      <div className="grid md:grid-cols-5">
        <div className="col-span-3">
          <Breadcrumbs category={story?.content.Categoria} />

          <StoryblokComponent
            autor={story?.content?.Autor}
            blok={story?.content}
            publishedAt={story?.published_at}
          />
          <section className="pb-16">
            <DiscussionEmbed
              config={{
                url: `https://presenteseprendas.pt/${story?.full_slug}`,
                identifier: story?.uuid,
                title: story?.name,
                language: "pt", //e.g. for Traditional Chinese (Taiwan)
              }}
              shortname="presenteseprendas"
            />
          </section>
        </div>
        <div className="col-span-2"></div>
      </div>
    </main>
  );
}
