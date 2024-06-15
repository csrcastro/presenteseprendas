import { getStoryblokApi ,type  ISbStoriesParams } from "@storyblok/react";
import config from "#app/helpers/sitemap/config";
import printLinks from "#app/helpers/sitemap/printLinks";
import pushLinks from "#app/helpers/sitemap/pushLinks";
import  { type Link } from "#app/helpers/sitemap/types";

const { responseParams, storyblokRequestParams } = config;

export const loader = async () => {
  const all_links: Link[] = [];

  const params: ISbStoriesParams = {
    ...storyblokRequestParams,
    starts_with: "guias-de-presentes",
    is_startpage: false,
  };

  const { total, data } = await getStoryblokApi().get(`cdn/stories`, params);

  const pages = Math.ceil(total / 20);
  [...Array(pages).keys()].forEach((page) => {
    all_links.push({
      id: 0,
      slug: `guias-de-presentes${page > 0 ? `?pagina=${page + 1}` : ""}`,
      frequency: "weekly",
      priority: 0.9,
    });
  });

  pushLinks(all_links, data.stories, 1, "weekly");

  const maxPage = Math.ceil(total / config.storyblokRequestParams.per_page);

  if (maxPage <= 1) {
    return new Response(printLinks(all_links), responseParams);
  }

  const contentRequests = [];

  for (let page = 2; page <= maxPage; page++) {
    contentRequests.push(
      getStoryblokApi().get(`cdn/stories`, { ...params, page }),
    );
  }

  await Promise.all(contentRequests).then((responses) => {
    responses.forEach((resp) => {
      pushLinks(all_links, resp.data.stories, 1, "weekly");
    });
  });

  return new Response(printLinks(all_links), responseParams);
};
