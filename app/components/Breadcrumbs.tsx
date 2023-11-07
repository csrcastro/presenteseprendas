import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { Link } from '@remix-run/react';
import { memo } from 'react';

const Breadcrumbs = memo(function Breadcrumbs({ category }) {
  return (
    <nav aria-label="Navegação em categorias" className="flex text-xs text-text-light" role="navigation">
      <ol className="p-y-3 flex space-x-1 lg:space-x-2">
        <li className="flex">
          <div className="flex items-center">
            <Link className=" hover:text-text" to="/">
              <HomeIcon aria-hidden="true" className="h-3 w-3 flex-shrink-0" />
              <span className="sr-only">Início</span>
            </Link>
          </div>
        </li>
        {category.content.Parents.sort((a, b) => a.full_slug.length - b.full_slug.length).map((story) => (
          <li key={story.uuid} className="flex">
            <div className="flex items-center">
              <ChevronRightIcon aria-hidden="true" className="mt-[1px] h-4 w-4 flex-shrink-0" />
              <Link
                aria-current={false ? 'page' : undefined}
                className=" font-bold uppercase hover:text-text "
                to={`/${story.full_slug}`}
              >
                {story.content.Title}
              </Link>
            </div>
          </li>
        ))}

        <li key={category.uuid} className="flex">
          <div className="flex items-center">
            <ChevronRightIcon aria-hidden="true" className="mt-[1px] h-4 w-4 flex-shrink-0" />
            <Link
              aria-current={false ? 'page' : undefined}
              className="ml-1 font-bold uppercase hover:text-text"
              to={`/${category.full_slug}`}
            >
              {category.content.Title}
            </Link>
          </div>
        </li>
      </ol>
    </nav>
  );
});

export default Breadcrumbs;
