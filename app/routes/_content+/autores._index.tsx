import { type LoaderFunction, type MetaFunction, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
	type ISbStoriesParams,
	type ISbStoryData,
	getStoryblokApi,
} from '@storyblok/react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

export const loader: LoaderFunction = async () => {
	const sbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
		starts_with: 'autores',
	}

	const { data } = await getStoryblokApi().get(`cdn/stories`, {
		...sbParams,
	})

	return json(data?.stories)
}

const metadata = {
	title: `Presentes e Prendas | Perfis pessoais dos nossos autores`,
	description: `Esta é página da equipa da Presentes e Prendas, incansáveis a proporcionar-te guias de presentes surpreendentes e promoções aliciantes. Vem conhecê-los!`,
}

export const meta: MetaFunction<typeof loader> = () => [
	...generateMetadata('autores', metadata),
	generateStructureddata(
		{
			breadcrumbs: [{ name: 'Autores', item: 'autores' }],
		},
		'autores',
		metadata,
	),
]

export default function Page() {
	const stories = useLoaderData<typeof loader>() as ISbStoryData[]

	return (
		<main className="relative isolate overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
			>
				<div
					className="aspect-[1] w-[82.375rem] flex-none bg-gradient-to-r from-[#ff5c35] to-[#E83025] opacity-25"
					style={{
						clipPath: `polygon(1% 41%, 21% 31%, 39% 42%, 61% 26%, 71% 44%, 99% 26%, 78% 70%,
                 58% 52%, 40% 66%, 26% 51%, 8% 62%)`,
					}}
				/>
			</div>
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-xl">
					<h1 className="heading-large text-warm">
						<span className="sr-only">{`Vem conhecer os `}</span>Autores
						<span className="sr-only">{` dão vida à Presentes e Prendas`}</span>
					</h1>
					<p className="mb-4">
						{`Olá! Nós somos a equipa criativa por trás da "Presentes e Prendas",
						um espaço dedicado inteiramente à arte de oferecer os presentes mais
						adequados em qualquer ocasião. A nossa missão é disponibilizar-te
						uma infinidade de ideias originais e inspiradoras, que se possam vir
						a tornar em presentes especiais. Cada sugestão que partilhamos é
						fruto de uma cuidadosa pesquisa e de um processo criativo
						apaixonado, garantindo que cada proposta seja única e pensada
						especialmente para surpreender, e acima de tudo, agradar. Quer
						estejas à procura do presente perfeito para alguém especial ou até
						mesmo algo para te mimares a ti próprio, temos opções para todas as
						necessidades e gostos.`}
					</p>
					<p className="mb-4">
						{`Para além das nossas sugestões de presentes, estamos sempre de olho
						nas melhores promoções para te oferecer. Sabemos que qualidade e
						preço acessível podem andar de mãos dadas, e é por isso que nos
						dedicamos a encontrar as melhores ofertas. Queremos que tenhas
						acesso a produtos incríveis sem comprometer o teu orçamento. Por
						isso, ficar atento às nossas atualizações significa estar sempre um
						passo à frente nas oportunidades de fazer um bom negócio, seja para
						datas comemorativas, simples gestos de gratidão e carinho ou apenas
						aproveitar uma pechincha.`}
					</p>
					<p>
						{`Encorajamos-te a explorar as várias categorias de guias presentes
						que disponibilizamos e a aproveitar as promoções exclusivas que a
						nossa plataforma oferece. Estamos sempre a atualizar o nosso
						conteúdo com novas promoções e ideias, assegurando que nunca te
						faltem opções. A tua satisfação em encontrar o presente perfeito é a
						nossa maior alegria, e esperamos que cada visita tua ao nosso site
						seja uma nova descoberta de possibilidades. Vem encontrar aquele
						presente que fala ao coração e deixa a magia dos pequenos gestos
						fortalecer as tuas relações.`}
					</p>
				</div>
				<AsteriskDividerShadow className="mx-auto my-8 h-8 fill-warm" />

				<ul className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
					{stories.map(story => (
						<li
							key={story.uuid}
							className="group flex transform cursor-pointer flex-col items-center rounded-xl bg-white/40 p-8 transition-colors duration-300 hover:bg-warm"
						>
							<Link
								className="text-center"
								to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
							>
								<img
									alt={story?.content.Nome}
									className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-warm/75"
									src={story?.content?.Foto?.filename}
								/>

								<h2 className="font-serif mt-4 text-xl capitalize">
									{story?.content.Nome}
								</h2>

								<p className="mt-2 text-sm leading-snug">
									{story?.content.ShortBio}
								</p>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
	)
}
