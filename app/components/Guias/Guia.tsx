import { Disclosure } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import dayjs from "dayjs";

import { useIsBot } from "~/isBot";
import styles from "~/styles";

import RichContent from "../Helpers/RichContent";
import RichContentGuia from "../Helpers/RichContentGuia";
import Share from "../Share";

export default function Guia({ blok, autor, publishedAt }) {
  const isBot = useIsBot();

  return (
    <div {...storyblokEditable(blok)} key={blok._uid}>
      <article className="mb-16">
        <header>
          <h1 className="mb-4 font-serif text-3xl font-light leading-8 mt-6 lg:text-4xl">
            {blok.Title}
          </h1>
        </header>

        {blok.Subtitle && !blok.V2_Intro ? (
          <p className="mb-4 text-base">
            <RichContent document={blok.Subtitle} />
          </p>
        ) : (
          <>
            <RichContentGuia document={blok.V2_Intro} />

            <Disclosure key={`${blok._uid}-content`} defaultOpen={isBot}>
              {({ open }) => (
                <>
                  {open ? null : (
                    <div className="flex w-full items-center justify-center">
                      <Disclosure.Button
                        className={`${styles.mediumButtonNoShadow} ${styles.verMaisButton} bg-warm text-white hover:bg-warmer`}
                      >
                        Ver mais
                      </Disclosure.Button>
                    </div>
                  )}

                  <Disclosure.Panel as="div" className="bg-red">
                    <RichContentGuia document={blok.V2_Content} />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </>
        )}

        {publishedAt ? (
          <footer className="my-8 text-sm text-text-light">
            <time dateTime={dayjs(publishedAt).toISOString()}>
              publicado {dayjs(publishedAt).format("dddd, DD")} de{" "}
              {dayjs(publishedAt).format("MMMM")} de{" "}
              {dayjs(publishedAt).format("YYYY")}
            </time>{" "}
            por{" "}
            <address className="inline">
              <Link rel="author" to={`/${autor.full_slug}`}>
                {autor.content.Nome}
              </Link>
            </address>
          </footer>
        ) : null}
        <aside className="my-8 rounded bg-warm/5 px-4 py-4 italic text-text-light">
          <p className="text-xs">
            Esperamos que gostes deste Guia! Todas estas sugestões foram
            selecionadas independentemente pelos nossos autores. A Presentes e
            Prendas poderá receber uma parte das vendas e/ou outros tipos de
            compensação através dos links nesta página.
          </p>
        </aside>
        <Share image={blok.Image.filename} />
      </article>
      <section>
        {blok.Presentes.map((nestedBlok: unknown, index: number) => (
          <StoryblokComponent
            key={nestedBlok._uid}
            blok={nestedBlok}
            index={index + 1}
          />
        ))}
      </section>
    </div>
  );
}
