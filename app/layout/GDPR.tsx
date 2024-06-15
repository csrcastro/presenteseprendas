import { Link, useFetcher, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function GDPR() {
  const fetcher = useFetcher();
  const { pathname, search } = useLocation();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoaded(true);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <aside
      className={`md-right-8 fixed bottom-4 left-4 right-4 z-1000 mx-auto max-w-md 
    rounded-2xl bg-contrast text-white p-4 shadow-xl md:left-auto transition-opacity duration-700 opacity-${
      loaded ? "1" : "0"
    }`}
    >
      <span className="font-heading">🍪🍪🍪 COOKIES! 🍪🍪🍪</span>

      <p className="mt-4 text-sm">
        Nós utilizamos cookies para assegurar que proporcionamos a melhor
        experiência possível aos nossos visitantes.
      </p>

      <div className="mt-6 flex shrink-0 items-center justify-between gap-x-4">
        <fetcher.Form action="/gdpr-consent" method="post">
          <input hidden readOnly name="redirectUrl" value={pathname + search} />

          <button
            className="rounded-lg bg-white px-4 py-2.5 font-heading text-xs uppercase text-black 
            transition-colors duration-300 hover:bg-warm hover:text-white focus:outline-none"
            name="accept-gdpr"
            type="submit"
            value="true"
          >
            Aceitar cookies
          </button>
          <Link
            className="ml-6 underline text-sm hover:no-underline"
            to="/politica-de-cookies"
          >
            Política de cookies
          </Link>
        </fetcher.Form>
      </div>
    </aside>
  );
}
