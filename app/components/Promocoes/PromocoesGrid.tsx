import { Link } from '@remix-run/react';

import type { Promocao } from '~/types/promocao';

const PromocoesGrid = ({ promocoes }: { promocoes: Promocao[] }) => {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
      {promocoes.map((promocao: Promocao) => {
        const discount = Math.floor(100 - (promocao?.content?.price / promocao?.content?.oldprice) * 100);
        return (
          <article
            key={promocao.uuid}
            className="group relative flex flex-col rounded-lg bg-white shadow-[0_3px_0_#005089] hover:shadow-[0_3px_0_#0094fe]"
          >
            <div className="aspect-[4/3] grow-0 overflow-hidden rounded-t-lg">
              <img
                alt={promocao?.content.Title}
                className="h-full w-full object-cover object-center transition-transform group-hover:scale-125"
                height="137"
                loading="lazy"
                sizes={`
        (min-width: 1360px) 183px, 
        (min-width: 1040px) 13.33vw, 
        (min-width: 780px) calc(25vw - 34px), 
        calc(50vw - 44px)
          `}
                src={`${promocao?.content?.Image?.filename}/m/183x137/smart/filters:format(webp)`}
                srcSet={`
          ${promocao?.content?.Image?.filename}/m/183x137/smart/filters:format(webp) 183w, 
          ${promocao?.content?.Image?.filename}/m/222x166/smart/filters:format(webp) 222w,
          ${promocao?.content?.Image?.filename}/m/384x287/smart/filters:format(webp) 384w,
          ${promocao?.content?.Image?.filename}/m/416x311/smart/filters:format(webp) 416w,
          `}
                width="183"
              />
            </div>
            <div className="flex grow flex-col justify-between p-2 pb-1 pt-4">
              <h2 className="mb-4 text-sm font-bold leading-tight group-hover:text-cold">
                <Link
                  aria-label={`Ver promoção: ${promocao?.content.Title} `}
                  title={`Ver promoção: ${promocao?.content.Title} `}
                  to={`/${promocao.full_slug}`}
                >
                  <span aria-hidden="true" className="absolute inset-0" />
                  {promocao?.content.Title}
                </Link>
              </h2>
              <div>
                <span className="font-serif font-light text-warmer">{`até -${discount}%`}</span>
                {!!promocao?.content?.Loja && (
                  <aside className="text-xs font-light text-text-light">
                    na {promocao?.content?.Loja?.content?.Title}
                  </aside>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PromocoesGrid;
