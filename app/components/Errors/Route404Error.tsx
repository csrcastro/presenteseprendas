import { Link } from '@remix-run/react'

import AsteriskDividerShadow from '../Assets/Dividers/AsteriskDividerShadow'
import FourOhFour from '../Assets/FourOhFour'

export default function RouteError({ location }: { location: string }) {
	const message = (page: string) =>
		encodeURIComponent(`
    
    --------------------
    
    Página: ${page}

    Escreve a tua mensagem antes da linha (desde já o nosso obrigado).
    
    
    `)

	return (
		<div className="my-16 text-center">
			<FourOhFour className="mx-auto h-auto w-[200px] fill-warm sm:w-[365px]" />
			<h1 className="font-heading mt-12 text-3xl tracking-tight sm:text-5xl">
				Cum catano...
				<br />
				esta página na funciona
			</h1>
			<AsteriskDividerShadow className="mx-auto my-16 h-8 fill-warm" />
			<p className="mt-6 text-base text-colder">
				Sabemos que querias mesmo, mesmo ver esta página, infelizmente algo
				correu mal.
				<br />
				Vamos imediatamente proceder ao tradicional chicoteamento do nosso lead
				developer, rezar duas avé marias, desligar e voltar a ligar o servidor.
				/s
				<br />
				Caso o problema persista por favor comunica connosco:
			</p>
			<div className="mx-auto mt-12 max-w-3xl gap-x-6">
				<a
					className="font-heading mx-auto bg-warm px-6 py-2 text-3xl uppercase text-white rounded-custom transition duration-300 hover:bg-warmer focus:outline-none"
					href={`
          mailto: csrcastro+problemas-presentes-e-prendas@gmail.com
          ?subject=Problema no PresentesePrendas!
          &body=${message(location)}`}
				>
					Comunicar Problema
				</a>
				<span className="my-6 block text-colder">
					ou clica no botão abaixo para sair daqui
				</span>
				<Link
					className="font-heading mx-auto bg-cold px-6 py-2 text-3xl uppercase text-colder rounded-custom transition duration-300 hover:bg-colder hover:text-white focus:outline-none"
					to={`${ENV.BASE_URL}`}
				>
					Página Principal
				</Link>
			</div>
		</div>
	)
}
