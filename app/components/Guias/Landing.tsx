import { storyblokEditable } from '@storyblok/react';

import RichText from '../Helpers/RichText';

import PresentesGrid from './PresentesGrid';

import styles from '~/styles';

export default function Landing({ blok, picks, recent, loadMoreRecent }) {
  return (
    <main {...storyblokEditable(blok)} key={blok._uid}>
      <section aria-labelledby="Cabeçalho da página de guias">
        <div className="relative overflow-hidden bg-background">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-16 flex transform-gpu justify-center overflow-hidden blur-3xl"
          >
            <div
              className="to-backround aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r
               from-background to-warm opacity-25"
              style={{
                clipPath: `polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%,
                  55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 
                    58.9% 0.2%, 73.6% 51.7%)`,
              }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0">
            <svg className="-mb-1 w-full text-warm" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 224 12">
              <path
                d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 
              C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z"
              />
            </svg>
          </div>
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center uppercase">
              <h1 className={`${styles.largeHeading} text-warm`}>{blok.Title}</h1>
            </div>
            <div className="mb-16">
              <RichText document={blok.Copy} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-warm">
        <div className="mx-auto px-4 pb-16 lg:max-w-7xl lg:px-8">
          <h2 className={`${styles.largeHeading} text-white`} id="recent-ideias-heading">
            Guias em destaque
          </h2>
          <PresentesGrid ideias={picks} />
        </div>
      </section>
      <section className="bg-background">
        <div className="mx-auto px-4 lg:max-w-7xl lg:px-8">
          <h2 className={`${styles.largeHeading}`} id="recent-ideias-heading">
            Guias mais recentes
          </h2>
          <PresentesGrid ideias={recent} />
          <div className="mb-16 text-center">
            <button
              className={`${styles.largeButton} ${styles.verMaisButton} mt-16 bg-warm text-white hover:bg-warmer`}
              onClick={() => {
                loadMoreRecent();
              }}
            >
              Ver mais
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
