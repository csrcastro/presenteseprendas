import invariant from "tiny-invariant";

export function getEnv(CV: string | undefined) {
  invariant(
    process.env.STORYBLOK_ACCESS_TOKEN,
    "STORYBLOK_ACCESS_TOKEN should be defined",
  );
  invariant(
    process.env.STORYBLOK_EXPLORE,
    "STORYBLOK_EXPLORE should be defined",
  );
  // invariant(process.env.ALGOLIA_APP_ID, 'ALGOLIA_APP_ID should be defined');
  // invariant(process.env.ALGOLIA_SEARCH_KEY, 'ALGOLIA_SEARCH_KEY should be defined');
  invariant(process.env.BASE_URL, "BASE_URL should be defined");

  const STORYBLOK_EXPLORE: "draft" | "published" =
    process.env.STORYBLOK_EXPLORE;

  return {
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    STORYBLOK_ACCESS_TOKEN: process.env.STORYBLOK_ACCESS_TOKEN,
    STORYBLOK_EXPLORE,
    // ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    // ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY,
    BASE_URL: process.env.BASE_URL,
    CV: Number(CV || +new Date()),
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  // eslint-disable-next-line no-var
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
