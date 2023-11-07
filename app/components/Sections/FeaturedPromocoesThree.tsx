import { TruckIcon } from '@heroicons/react/24/solid';
import { Link } from '@remix-run/react';

import dayjs from 'dayjs';

import DynamicExpression from '~/components/Assets/Expressions/DynamicExpression';
import SimpleTooltip from '~/components/SimpleTooltip';

import type { Promocao } from '~/types/promocao';

export default function FeaturedPromocoesThree({ promocoes }: { promocoes: Promocao[] }) {
  if (promocoes.length < 1) {
    return null;
  }

  return (
    <section aria-labelledby="featured-promotions-heading">
      <div className="relative z-30 pb-16">
        <h2 className="sr-only" id="featured-promotions-heading">
          Promoções em Destaque
        </h2>
        <div
          className="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 
        sm:max-w-7xl sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 sm:px-6 
        lg:gap-x-8 lg:px-8"
        >
          {promocoes.map((promocao) => {
            const discount = Math.floor(100 - (promocao.content.price / promocao.content.oldprice) * 100);
            return (
              <article key={promocao.uuid} className="relative flex flex-col justify-end rounded-lg bg-white shadow-lg">
                <div className="flex grow flex-col px-4 pb-2 pt-2">
                  <h2 className="grow font-bold uppercase">
                    <Link to={`/${promocao.full_slug}`}>
                      <span aria-hidden="true" className="absolute inset-0 z-10" />
                      {promocao.content.Title}
                    </Link>
                  </h2>
                  <footer className="mt-1 grow-0 text-xs text-text-light">
                    <time dateTime={dayjs(promocao.published_at).toISOString()}>
                      Publicado a {dayjs(promocao.published_at).format('DD.MM.YYYY')}
                    </time>
                  </footer>
                </div>

                <div className="relative">
                  <img
                    alt={promocao.content.Title}
                    className="h-48 w-full grow-0 object-cover"
                    height="137"
                    loading="lazy"
                    sizes={`
                      (min-width: 1340px) 384px, 
                      (min-width: 640px) calc(29.85vw - 10px), 
                      (min-width: 480px) 416px, 
                      92.5vw
                    `}
                    src={`${promocao?.content?.Image?.filename}/m/183x137/smart/filters:format(webp)`}
                    srcSet={`
                      ${promocao?.content?.Image?.filename}/m/183x137/smart/filters:format(webp) 183w, 
                      ${promocao?.content?.Image?.filename}/m/338x254/smart/filters:format(webp) 338w, 
                      ${promocao?.content?.Image?.filename}/m/222x166/smart/filters:format(webp) 222w,
                    `}
                    width="183"
                  />
                  <div className="absolute -right-4 -top-4 z-10">
                    <DynamicExpression className="h-8 w-auto fill-warm drop-shadow-[3px_3px_0px_rgba(255,255,255,1)]" />
                  </div>
                </div>

                <div
                  className="-mt-[1px] flex grow-0 items-center 
                justify-between rounded-b-lg bg-colder px-4 py-2 font-bold text-white"
                >
                  <div className="flex">{`até -${discount}% de desconto`}</div>
                  <div className="">
                    {!!promocao.content.ShippingCost && (
                      <div className="flex">
                        <TruckIcon aria-hidden="true" className="h-6 w-6" />
                        <span className="ml-2">{promocao.content.ShippingCost}</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
