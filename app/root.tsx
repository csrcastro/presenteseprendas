import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
} from "@remix-run/react";
import { apiPlugin, getStoryblokApi, storyblokInit } from "@storyblok/react";
import type { ISbStoriesParams } from "@storyblok/react";
import dayjs from "dayjs";
import { useEffect } from "react";

import { gdprConsent } from "~/cookies";
import appleTouchIcon from "~/images/apple-touch-icon.png";
import faviconPng16 from "~/images/favicon-16x16.png";
import faviconPng32 from "~/images/favicon-32x32.png";
import faviconPng from "~/images/favicon.png";
import favicon from "~/images/favicon.svg";
import maskIcon from "~/images/safari-pinned-tab.svg";
import manifest from "~/images/site.webmanifest";
// import { getUser } from "~/session.server";
import tailwind from "~/tailwind.css";

import Guia from "./components/Guias/Guia";
import IdeiasLanding from "./components/Guias/Landing";
import Presente from "./components/Guias/Presente";
import MainRouteError from "./components/MainRouteError";
import Promocao from "./components/Promocoes/Promocao";
import SobreNos from "./components/SobreNos";
import { prisma } from "./db.server";
import { getEnv } from "./env.server";
import * as gtag from "./helpers/gtags.client";
import { useIsBot } from "./isBot";
import { Layout } from "./layout";
import GDPR from "./layout/GDPR";

import "dayjs/locale/pt";

dayjs.locale("pt");

const components = {
  Guia,
  ideiasLanding: IdeiasLanding,
  Presente,
  Promocao,
  SobreNos,
};

storyblokInit({
  accessToken: ENV.STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components,
  apiOptions: {
    cache: {
      type: "memory",
      clear: "auto",
    },
  },
});

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: "/fonts/montserrat-v25-latin-900.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
    fetchpriority: "high",
  },
  {
    rel: "preload",
    href: "/fonts/montserrat-v25-latin-800.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { href: tailwind, rel: "preload", as: "style" },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  {
    rel: "preconnect",
    href: "//a.storyblok.com",
  },
  {
    rel: "dns-prefetch",
    href: "//a.storyblok.com",
  },
  { rel: "stylesheet", href: tailwind },
  {
    rel: "shortcut icon",
    href: favicon,
    type: "image/svg+xml",
  },
  {
    rel: "icon",
    href: faviconPng32,
    type: "image/png",
  },
  {
    rel: "icon",
    href: faviconPng16,
    type: "image/png",
  },
  {
    rel: "icon",
    href: faviconPng,
    type: "image/png",
  },
  {
    rel: "apple-touch-icon",
    href: appleTouchIcon,
    sizes: "180x180",
  },
  {
    rel: "manifest",
    href: manifest,
  },
  {
    rel: "mask-icon",
    href: maskIcon,
    color: "#ff5c35",
  },
];

export function ErrorBoundary() {
  const error: unknown = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    console.log(error);
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  return (
    <html lang="pt-PT">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <meta content="#fcf7f4" name="theme-color"></meta>
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.ENV = ${JSON.stringify(ENV)};
              `,
          }}
        />
        <MainRouteError />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   return json({ user: await getUser(request) });
// };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cacheRecord = await prisma.cdn.findUnique({
    where: {
      name: "storyblok",
    },
  });
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await gdprConsent.parse(cookieHeader);

  getEnv(cacheRecord?.timestamp.toString());

  const sbParams: ISbStoriesParams = {
    version: ENV.STORYBLOK_EXPLORE,
  };

  const { data } = await getStoryblokApi().get(
    `cdn/stories/layout/header-navigation`,
    sbParams,
  );

  const baseJson = {
    headerNavigation: data?.story,
    ENV,
  };

  if (cookie) {
    return json({
      ...baseJson,
      gdprConsent: cookie.gdprConsent,
    });
  }

  return json({
    ...baseJson,
    gdprConsent: false,
    headers: {
      "Set-Cookie": await gdprConsent.serialize({ gdprConsent: false }),
    },
  });
};

export default function App() {
  const location = useLocation();
  const isBot = useIsBot();

  const { ENV, gdprConsent } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (ENV.GA_TRACKING_ID?.length && !isBot) {
      gtag.consent(gdprConsent);
    }
  }, [ENV.GA_TRACKING_ID, gdprConsent, isBot]);

  useEffect(() => {
    if (ENV.GA_TRACKING_ID?.length && !isBot) {
      gtag.pageview(location.pathname, ENV.GA_TRACKING_ID);
    }
  }, [location, ENV.GA_TRACKING_ID, isBot]);

  return (
    <html lang="pt">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <meta content="#fcf7f4" name="theme-color"></meta>
        <Meta />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.ENV = ${JSON.stringify(ENV)};
              `,
          }}
        />
        <Links />
        {!ENV.GA_TRACKING_ID?.length || isBot ? null : (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}

                gtag('consent', 'default', {
                  'ad_storage': ${gdprConsent ? "'granted'" : "'denied'"},
                  'analytics_storage': ${gdprConsent ? "'granted'" : "'denied'"}
                });
                document.addEventListener('DOMContentLoaded', () => {
                  setTimeout(initGTM, 2000);
                });
                document.addEventListener('scroll', initGTMOnEvent);
                document.addEventListener('mousemove', initGTMOnEvent);
                document.addEventListener('touchstart', initGTMOnEvent);
                function initGTMOnEvent(event) {
                  initGTM();
                  event.currentTarget.removeEventListener(event.type, initGTMOnEvent);
                }
                function initGTM() {
                  if (window.gtmDidInit) {
                    return false;
                  }
                  window.gtmDidInit = true; 
                  const script = document.createElement('script');
                  script.type = 'text/javascript';
                  script.onload = () => { 
                    gtag('js', new Date());
                    gtag('config', '${ENV.GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  }
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=${
                    ENV.GA_TRACKING_ID
                  }';
                  script.defer = true;
                  document.getElementsByTagName('body')[0].appendChild(script);
                }
              `,
            }}
          />
        )}
      </head>
      <body className="bg-background">
        <Layout>
          <Outlet />
          {!gdprConsent ? <GDPR /> : null}
        </Layout>
        <ScrollRestoration />
        {isBot ? null : <Scripts />}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}
