import type { ActionArgs, LoaderArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { getStoryblokApi } from '@storyblok/react';

import { prisma } from '../db.server';
// import algoliasearch from 'algoliasearch';

export const action = async ({ request }: ActionArgs) => {
  const payload = await request.json();
  console.log(payload);

  async function main() {
    await prisma.cdn.update({
      where: {
        name: 'storyblok',
      },
      data: {
        timestamp: +new Date(),
      },
    });
  }
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  return json({ success: true }, 200);

  switch (request.method) {
  case 'POST': {
    const payload = await request.json();

    if (!/(guias-de-presentes|promocoes|categorias)\/.{1,}/.exec(payload.full_slug)) {
      return json({ success: true }, 200);
    }

    let {
      data: { story },
    } = await getStoryblokApi().get(`cdn/stories/${payload.story_id}`, {
      version: ENV.STORYBLOK_EXPLORE,
    });

    const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

    const index = client.initIndex(story.content.component);

    const res = await index.saveObject({
      objectID: story.uuid,
      ...story,
    });
    if (story.content.component === 'Guia') {
      const presentsIndex = client.initIndex('Presente');

      const mm = await Promise.all(
        story.content.Presentes.map(async (presente) => {
          const res = await presentsIndex.saveObject({
            objectID: `${story.uuid}+${presente._uid}`,
            Image: presente.Images?.[0].filename,
            ImageAlt: presente.Images?.[0].alt,
            ImageSource: presente.ImagesSource,
            HeadLine: presente.Headline,
            story: story.uuid,
            story_slug: `${story.full_slug}`,
            full_slug: `${story.full_slug}#${presente._uid}`,
          });
        })
      );
    }

    return json({ success: true }, 200);
  }
  case 'PUT':
  case 'PATCH':
  case 'DELETE':
  default: {
    return json({ success: true }, 200);
  }
  }
};
