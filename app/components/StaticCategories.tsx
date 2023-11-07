import { Link } from '@remix-run/react';

import styles from '~/styles';

export default function StaticCategories({ categorias }) {
  return (
    <div className="bg-cold">
      <section aria-labelledby="recent-promocoes-heading" className="mx-auto max-w-7xl">
        <h2 className={`${styles.largeHeading} text-white`}>Inspira-te</h2>
        <ul className="grid grid-cols-2 gap-8 px-4 pb-20 md:grid-cols-3">
          {categorias.map((categoria) => {
            return (
              <li
                key={categoria.content.Title}
                className="group relative mx-auto flex w-full max-w-sm flex-col items-center justify-center"
              >
                <div className="relative mx-4 overflow-hidden rounded-2xl shadow">
                  <img
                    alt={categoria.content.Title}
                    className="aspect-1 w-full object-cover opacity-90 
                    transition group-hover:scale-105 group-hover:opacity-100"
                    height="117"
                    loading="lazy"
                    sizes={`
                      (min-width: 1320px) 352px, 
                      (min-width: 780px) calc(30vw - 38px), 
                      calc(50vw - 64px)
                    `}
                    src={`${categoria.content.Image?.filename}/m/117x117/smart/filters:format(webp)`}
                    srcSet={`
                    ${categoria.content.Image?.filename}/m/192x192/smart/filters:format(webp) 192w,
                    ${categoria.content.Image?.filename}/m/277x277/smart/filters:format(webp) 277w,
                    ${categoria.content.Image?.filename}/m/350x350/smart/filters:format(webp) 350w,
                    ${categoria.content.Image?.filename}/m/117x117/smart/filters:format(webp) 117w,
                    `}
                    width="117"
                  />
                  <div className="absolute inset-0 blur-[52px]">
                    <div
                      className="absolute inset-0 z-10 bg-colder"
                      style={{
                        clipPath: `polygon(0% 0%, 0% 100%, 5% 100%, 5% 5%, 95% 5%, 
                          95% 95%, 5% 95%, 5% 100%, 100% 100%, 100% 0%)`,
                      }}
                    />
                  </div>
                </div>

                <div
                  className="group z-10 -mt-4 w-full overflow-hidden bg-white shadow-[6px_6px_0px_#212121]
               transition group-hover:bg-contrast group-hover:shadow-[8px_8px_0px_#212121]"
                >
                  <h3
                    className="py-2 text-center font-serif text-xl uppercase tracking-wide
                     text-colder group-hover:text-white lg:text-3xl"
                  >
                    <Link to={categoria.full_slug}>
                      <span aria-hidden="true" className="absolute inset-0 z-10" />
                      {categoria.content.Title}
                    </Link>
                  </h3>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
