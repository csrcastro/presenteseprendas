import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'
import {
	type LoaderFunctionArgs,
	type MetaFunction,
	json,
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import {
	type ISbResult,
	type ISbStories,
	getStoryblokApi,
} from '@storyblok/react'
import { Suspense, lazy, useEffect, useState } from 'react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))
const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
)

async function fetchStories(start: string, term: string, page = 1) {
	const { data }: ISbResult = await getStoryblokApi().get(`cdn/stories`, {
		version: ENV.STORYBLOK_EXPLORE,
		starts_with: start,
		is_startpage: false,
		page,
		search_term: term,
	})

	return data
}

function fetchGuias(term: string, page = 1) {
	return fetchStories('guias-de-presentes', term, page)
}

async function fetchPromocoes(term: string, page = 1) {
	return fetchStories('promocoes', term, page)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const search = new URLSearchParams(url.search)

	const pesquisa = search.get('pesquisa')

	if (!pesquisa) {
		return json({ guias: [], promocoes: [], term: '' })
	}

	const guias: ISbStories['data'] = await fetchGuias(pesquisa.toString())
	const promocoes: ISbStories['data'] = await fetchPromocoes(
		pesquisa.toString(),
	)
	const term: string = pesquisa.toString()

	return json({ guias, promocoes, term })
}

const metadata = {
	title: 'Pesquisa na Presentes e Prendas',
	description: 'Estás à procura de algo específico?',
}
export const meta: MetaFunction<typeof loader> = () => {
	return [
		...generateMetadata('pesquisa', metadata),
		generateStructureddata(
			{
				breadcrumbs: [{ name: 'Pesquisa', item: 'pesquisa' }],
			},
			'pesquisa',
			metadata,
		),
	]
}

export default function Pesquisa() {
	const { guias, promocoes, term } = useLoaderData<typeof loader>() as {
		guias: ISbStories['data']
		promocoes: ISbStories['data']
		term: string
	}

	const [guiasCollection, setGuiasCollection] = useState({
		page: 1,
		slices: [guias.stories || []],
	})

	const [promocoesCollection, setPromocoesCollection] = useState({
		page: 1,
		slices: [promocoes.stories || []],
	})

	useEffect(() => {
		setGuiasCollection({
			page: 1,
			slices: [guias.stories || []],
		})
		setPromocoesCollection({
			page: 1,
			slices: [promocoes.stories || []],
		})
	}, [guias, promocoes, term])

	return (
		<main>
			<section aria-labelledby="category-heading">
				<h1 className="sr-only">
					{'Pesquisa aqui pelos melhores Promocões, Presentes e Prendas'}
				</h1>
				<div className="relative bg-warm">
					<div className="mx-auto px-4 pb-20 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
						<Form>
							<div className="relative max-w-xl pt-2 sm:mx-auto sm:max-w-xl sm:pt-8 sm:text-center md:max-w-2xl">
								<div>
									<label className="sr-only" htmlFor="pesquisa">
										Pesquisar
									</label>
									<div className="mt-2 flex rounded-md shadow-md">
										<div className="relative flex flex-grow items-stretch focus-within:z-10">
											<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
												<SparklesIcon
													aria-hidden="true"
													className="h-5 w-5 text-text"
												/>
											</div>
											<input
												className="block w-full rounded-none rounded-l-md border-0 py-4 pl-10 text-text-light placeholder:text-text-lighter focus:ring-2 focus:ring-inset focus:ring-colder sm:text-sm sm:leading-6"
												defaultValue={term}
												id="pesquisa"
												name="pesquisa"
												placeholder="Pesquisa aqui..."
												type="text"
											/>
										</div>
										<button
											className="text-md relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-text px-6 font-bold uppercase text-white transition-colors duration-300 hover:bg-warmer sm:px-3"
											type="submit"
										>
											<span className="hidden sm:block">Pesquisar</span>
											<MagnifyingGlassIcon
												aria-hidden="true"
												className="-ml-1 h-7 w-auto sm:h-4"
											/>
										</button>
									</div>
								</div>
							</div>
						</Form>
					</div>
				</div>
			</section>

			<h2 className="sr-only">Resultados da Pesquisa</h2>
			<section className="mx-auto max-w-7xl px-8">
				<h3 className="font-heading py-12 text-center text-4xl uppercase text-warm">
					Guias de Presentes
				</h3>

				{guiasCollection.slices.map((slice, index) => {
					return (
						<div key={`guias-grid-${index}`}>
							{index > 0 ? (
								<AsteriskDividerShadow className="mx-auto mb-16 h-8 fill-warm" />
							) : null}
							<Suspense
								fallback={
									<p className="pb-20 text-center">A carregar conteúdos</p>
								}
							>
								<PresentesGrid ideias={slice} />
							</Suspense>
						</div>
					)
				})}
			</section>

			<section className="mx-auto max-w-7xl px-8 pb-16">
				<h3 className="font-heading py-12 text-center text-4xl uppercase text-warm">
					Promocões
				</h3>
				{promocoesCollection.slices.map((slice, index) => {
					return (
						<div key={`promocoes-grid-${index}`}>
							{index > 0 ? (
								<AsteriskDividerShadow className="mx-auto mb-16 h-8 fill-warm" />
							) : null}
							<Suspense
								fallback={
									<p className="pb-20 text-center">A carregar conteúdos</p>
								}
							>
								<PromocoesGrid promocoes={slice} />
							</Suspense>
						</div>
					)
				})}
			</section>
		</main>
	)
}
