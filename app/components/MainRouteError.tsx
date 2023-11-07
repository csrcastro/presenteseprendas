import AsteriskDividerShadow from './Assets/Dividers/AsteriskDividerShadow';
import FourOhFour from './Assets/FourOhFour';

import { useHydrated } from '~/hooks/useHydrated';

export default function MainRouteError() {
  const message = (page: string) =>
    encodeURIComponent(`
    
    --------------------
    
    Página: ${page}

    Escreve a tua mensagem antes da linha (desde já o nosso obrigado).
    
    
    `);

  return !useHydrated() ? null : (
    <main className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center ">
        <FourOhFour className="mx-auto h-auto w-[200px] fill-warm  sm:w-[365px]" />
        <h1 className="text-gray-900 mt-12 font-serif text-3xl tracking-tight sm:text-5xl">
          Cum catano...
          <br />
          então n'é qu'isto na funciona
        </h1>
        <AsteriskDividerShadow className="mx-auto my-16 h-8 w-auto fill-warm" />
        <p className="mt-6 text-base leading-7">
          Acontece... 🙁, mas não te preocupes, ajuda já está a caminho.
          <br />
          Os nossos engenheiros, investigadores, técnicos profissionais, nadadores salvadores,
          <br />
          jogadores de futebol amador, chefs influencers, finalistas do jardim de infância e até o gato da vizinha já
          estão a tratar do assunto.
          <br />
          <span className="mt-3 block text-5xl">👩🏻‍🔧🧑🏻‍🔧👨🏻‍🔧</span>
          caso o problema persista por favor comunica connosco:
        </p>
        <div className="mt-2 flex items-center justify-center gap-x-6">
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
        </div>
      </div>
    </main>
  );
}
