import { Link } from '@remix-run/react';

import RichContent from '../Helpers/RichContent';

const PresentesGrid = ({ ideias }) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 text-left md:grid-cols-3 lg:grid-cols-4">
      {ideias.map((ideia) => (
        <div key={ideia.uuid} className="group relative">
          <article>
            <div className="bg-gray-100 aspect-[4/3] overflow-hidden rounded-lg">
              <img
                alt={ideia.content.SeoTitle}
                className="w-full object-cover object-center"
                height="116"
                loading="lazy"
                sizes={`
                (min-width: 1360px) 292px, 
                (min-width: 1040px) calc(20vw + 24px), 
                (min-width: 780px) calc(33.33vw - 32px), 
                calc(50vw - 40px)
                `}
                src={`${ideia?.content?.Image?.filename}/m/155x116/smart/filters:format(webp)`}
                srcSet={`
                ${ideia?.content?.Image?.filename}/m/155x116/smart/filters:format(webp) 155w, 
                ${ideia?.content?.Image?.filename}/m/344x257/smart/filters:format(webp) 344w, 
                ${ideia?.content?.Image?.filename}/m/292x218/smart/filters:format(webp) 292w,
                `}
                width="155"
              />
            </div>
            <h2 className="mt-4 text-xl font-bold leading-5 text-text group-hover:text-contrast">
              <Link
                aria-label={`Ler guia: ${ideia.content.SeoTitle} `}
                title={`Ler guia: ${ideia.content.SeoTitle} `}
                to={`/${ideia.full_slug}`}
              >
                <span aria-hidden="true" className="absolute inset-0" />
                <RichContent document={ideia.content.Title} />
              </Link>
            </h2>
          </article>
        </div>
      ))}
    </div>
  );
};

export default PresentesGrid;
