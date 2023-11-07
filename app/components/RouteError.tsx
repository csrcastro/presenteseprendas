import { Link } from '@remix-run/react';

import AsteriskDividerShadow from './Assets/Dividers/AsteriskDividerShadow';
import FourOhFour from './Assets/FourOhFour';

import { useHydrated } from '~/hooks/useHydrated';

export default function RouteError() {
  const message = (page: string) =>
    encodeURIComponent(`
    
    --------------------
    
    Página: ${page}

    Escreve a tua mensagem antes da linha (desde já o nosso obrigado).
    
    
    `);

  return !useHydrated() ? null : (
    <div className="my-32 text-center">
      <FourOhFour className="mx-auto h-auto w-[200px] fill-warm  sm:w-[365px]" />
      <h1 className="mt-12 font-serif text-3xl tracking-tight text-colder sm:text-5xl">
        Cum catano...
        <br />
        esta página na funciona
      </h1>
      <AsteriskDividerShadow className="mx-auto my-16 h-8 w-auto fill-warm" />
      <p className="mt-6 text-base text-colder">
        Sabemos que querias mesmo, mesmo ver esta página, infelizmente algo correu mal.
        <br />
        Vamos imediatamente proceder ao tradicional chicoteamento do nosso lead developer, rezar duas avé marias,
        desligar e voltar a ligar o servidor. /s
        <br />
        Caso o problema persista por favor comunica connosco:
      </p>
      <div className="mx-auto mt-12 max-w-3xl gap-x-6">
        <a
          className="duration-318 mx-auto bg-warm px-6 py-2 font-serif text-3xl uppercase 
          text-white  shadow-[3px_3px_#212121] transition hover:bg-warmer 
          hover:shadow-[4px_4px_#212121] focus:outline-none active:shadow-[2px_2px_#212121]"
          href={`
          mailto: csrcastro+problemas-presentes-e-prendas@gmail.com
          ?subject=Problema no PresentesePrendas!
          &body=${message(window.location.href)}`}
        >
          Comunicar Problema
        </a>
        <span className="my-6 block text-colder">ou clica no botão abaixo para sair daqui</span>
        <Link
          className="duration-318 mx-auto bg-cold px-6 py-2 font-serif text-3xl 
          uppercase text-colder  shadow-[3px_3px_#212121] transition hover:bg-colder 
          hover:text-white hover:shadow-[4px_4px_#212121] focus:outline-none active:shadow-[2px_2px_#212121]"
          to="/"
        >
          Página Principal
        </Link>
      </div>
    </div>
  );
}
