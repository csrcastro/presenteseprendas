import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Link, useRouteLoaderData } from '@remix-run/react';
import { useState } from 'react';

import Logo from '../components/Assets/Logo';

import Search from './Search';

export default function Header() {
  const { headerNavigation } = useRouteLoaderData('root');

  const [open, setOpen] = useState(false);

  return (
    <header className="border-b-2 border-warm bg-background">
      <nav aria-label="Navegação Principal" className="mx-auto max-w-7xl items-center justify-center p-2 lg:p-8">
        <div className="relative">
          <div className="left-0 top-0 z-10 mt-2 lg:absolute lg:mt-0">
            <Link
              aria-label="Página inicial da Presentes e Prendas"
              className="mx-auto block w-[260px] lg:w-[300px]"
              to="https://presenteseprendas.pt"
            >
              <Logo className=" h-auto w-full fill-warm" />
            </Link>
          </div>
          <div className="relative mt-4 pr-[30px] lg:mt-0 lg:grow lg:pl-[320px]">
            <div className="scroll-hidden space-x-4 overflow-y-auto whitespace-nowrap lg:flex">
              {headerNavigation.content.Sections.map((section) => (
                <Link
                  key={section._uid}
                  className="duration-312 font-serif text-sm font-light
                uppercase leading-6 hover:text-warmer md:my-0"
                  target={section.Link.target}
                  to={`/${section.Link.cached_url}`}
                >
                  {section.text}
                </Link>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 top-0 m-auto h-[24px] w-[24px]">
              <button
                className="relative hover:text-warmer active:outline-none"
                type="button"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <span className="sr-only">Pesquisar</span>
                <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6 lg:h-6 lg:w-6" />
              </button>
            </div>
          </div>
        </div>
        <Search open={open} setOpen={setOpen} />
      </nav>
    </header>
  );
}
