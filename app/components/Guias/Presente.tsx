import { Disclosure } from "@headlessui/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { storyblokEditable } from "@storyblok/react";

import type { Suggestion } from "~/types/suggestions";

import RichContent from "../Helpers/RichContent";
import RichLinksOnly from "../Helpers/RichLinksOnly";
import RichParagraphsOnly from "../Helpers/RichParagraphsOnly";

import PresenteImages from "./PresenteImages";

export default function Presente({
  blok,
  index,
}: {
  blok: Suggestion;
  index: number;
}) {
  return (
    <article className="mb-12" {...storyblokEditable(blok)} key={blok._uid}>
      <header>
        <h2 className="mb-3 font-serif text-3xl font-light lg:mb-7">
          <span className="font-serif text-4xl text-warm">
            {index}
            {". "}
          </span>
          <span className="">
            <RichContent document={blok.Headline} />
          </span>
        </h2>
      </header>
      <figure>
        <PresenteImages images={blok?.Images} url={blok?.Link?.url} />
        <div className="mb-6 mt-2 text-sm font-light lowercase italic text-text-light">
          <RichLinksOnly
            className="hover:text-contrast hover:underline"
            document={blok?.ImagesSource}
          />
        </div>
      </figure>
      <aside className="tracking-snug">
        <RichContent document={blok?.Review} />
        {" - "}
        <Link
          className="italic text-highlight hover:text-warm hover:underline"
          rel="noreferrer"
          target="_blank"
          to={blok?.ReviewLink}
        >
          {blok?.ReviewName}
        </Link>
      </aside>

      {blok?.Loja ? (
        <aside className="my-6 ">
          <Disclosure key="disclosure" as="div">
            {({ open }) => (
              <>
                <div>
                  <Disclosure.Button className="flex w-full items-start justify-start text-left">
                    <span className="flex h-7 items-center">
                      {open ? (
                        <MinusSmallIcon
                          aria-hidden="true"
                          className="h-6 w-6"
                        />
                      ) : (
                        <PlusSmallIcon aria-hidden="true" className="h-6 w-6" />
                      )}
                    </span>
                    <span className="ml-6 text-base font-bold leading-7">
                      Tempo de envio
                    </span>
                  </Disclosure.Button>
                </div>
                <Disclosure.Panel
                  as="div"
                  className="mt-2 pr-12 text-text-light [&>p]:mb-4"
                >
                  <RichParagraphsOnly
                    className={""}
                    document={blok?.Loja?.content?.ShippingInfo}
                  />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </aside>
      ) : null}

      <div className="mt-6">
        <Link
          className="duration-318 inline-flex h-12 w-auto items-center rounded-sm bg-warm px-12 
          text-center font-serif text-lg leading-[3rem] text-white hover:bg-warmer"
          rel="noreferrer"
          target="_blank"
          to={blok?.Link?.url}
        >
          Ver{" "}
          {`${blok?.Loja?.content ? `na ${blok?.Loja?.content?.Title}` : ""}`}
          <ArrowTopRightOnSquareIcon
            aria-hidden="true"
            className="-mr-0.5 ml-1 h-5 w-5"
          />
        </Link>
      </div>
    </article>
  );
}
