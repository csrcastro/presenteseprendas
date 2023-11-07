import { Link, useFetcher, useLocation } from '@remix-run/react';

export const LAST_UPDATED_DATE = new Date('07/11/2022').valueOf();

export default function GDPR() {
  const fetcher = useFetcher();
  const { pathname, search } = useLocation();
  return (
    <section
      className="md-right-8 fixed bottom-4 left-4 right-4 z-1000 mx-auto max-w-md 
    rounded-2xl bg-white p-4 shadow-xl md:left-auto"
    >
      <h2 className="font-serif font-light">🍪 Há cookies neste forno!!! 🍪</h2>

      <p className="mt-4 text-sm">
        Nós utilizamos cookies para assegurar que proporcionamos a melhor experiência possível aos nossos visitantes.
      </p>

      <div className="mt-6 flex shrink-0 items-center justify-between gap-x-4">
        <fetcher.Form action="/gdpr-consent" method="post">
          <input hidden readOnly name="redirectUrl" value={pathname + search} />

          <button
            className="rounded-lg bg-contrast px-4 py-2.5 font-serif text-xs uppercase text-white 
            transition-colors duration-300 hover:bg-warm focus:outline-none"
            name="accept-gdpr"
            type="submit"
            value="true"
          >
            Aceitar cookies
          </button>
          <Link
            className="ml-4 text-sm text-contrast-cold hover:text-contrast hover:underline"
            to="/politica-de-cookies"
          >
            Ler política de cookies
          </Link>
        </fetcher.Form>
      </div>
    </section>
  );
}
