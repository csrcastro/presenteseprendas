import { Link } from '@remix-run/react';

import Casa from './Assets/Material/Casa';

import Desporto from './Assets/Material/Desporto';

import Familia from './Assets/Material/Familia';
import Moda from './Assets/Material/Moda';
import Saude from './Assets/Material/Saude';
import Tecnologia from './Assets/Material/Tecnologia';

const icons = {
  Casa,
  Desporto,
  Tecnologia,
  Saúde: Saude,
  Moda,
  Família: Familia,
};

export default function StaticCategoriesIcons({ categorias }) {
  return (
    <div className="sm:hidden">
      <section aria-labelledby="recent-promocoes-heading" className="mx-auto max-w-xl pb-16 pt-8">
        <h2 className=" sr-only">Inspira-te</h2>
        <ul className="grid grid-cols-2 gap-8 px-4">
          {categorias.map((categoria) => {
            const Icon = icons[categoria.name];
            return (
              <li
                key={categoria.name}
                className="group relative mx-auto flex w-full max-w-sm flex-col items-center justify-center"
              >
                <div className="mb-4">
                  <Icon className="h-16 w-16 fill-background" />
                </div>

                <h3 className="text-xl font-bold uppercase text-background">
                  <Link to={`/${categoria.full_slug}`}>
                    <span aria-hidden="true" className="absolute inset-0 z-10" />
                    {categoria.name}
                  </Link>
                </h3>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
