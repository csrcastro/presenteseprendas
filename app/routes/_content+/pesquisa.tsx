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
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'
import sprite from '#app/sprites/sprite.svg'

const {
	svg: { defaults },
} = config

const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))
const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
)

async function fetchStories(start: string, term: string | null, page = 1) {
	let params: {
		version?: 'published' | 'draft'
		starts_with: string
		is_startpage: boolean
		page: number
		search_term?: string
	} = {
		version: ENV.STORYBLOK_EXPLORE,
		starts_with: start,
		is_startpage: false,
		page,
	}

	if (term) {
		params.search_term = term
	}

	const { data }: ISbResult = await getStoryblokApi().get(`cdn/stories`, params)

	return data
}

function fetchGuias(term: string | null, page = 1) {
	return fetchStories('guias-de-presentes', term, page)
}

async function fetchPromocoes(term: string | null, page = 1) {
	return fetchStories('promocoes', term, page)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const search = new URLSearchParams(url.search)

	const pesquisa = search.get('pesquisa')

	const guias: ISbStories['data'] = await fetchGuias(pesquisa)
	const promocoes: ISbStories['data'] = await fetchPromocoes(pesquisa)
	const term: string | null = pesquisa

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
				<div className="relative bg-warm">
					<div className="mx-auto max-w-3xl py-20">
						<div className="mx-auto max-w-lg pb-8">
							<h1 className="text-center font-serif text-2xl uppercase text-background">
								{'Pesquisa aqui pelas melhores ideias de presente'}
							</h1>
						</div>
						<Form className="relative max-w-xl px-4 sm:mx-auto sm:max-w-xl sm:px-0 sm:text-center md:max-w-2xl">
							<label className="sr-only" htmlFor="pesquisa">
								Pesquisa na Presentes e Prendas
							</label>
							<div className="flex rounded-md focus-within:shadow-lg">
								<div className="relative flex flex-grow items-stretch">
									<svg
										{...defaults}
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
										className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cold"
										xmlnsXlink="http://www.w3.org/1999/xlink"
									>
										<use xlinkHref={`${sprite}#sparkles`} />
									</svg>
									<input
										className="block w-full rounded-none rounded-l-md border-0 py-4 pl-10 text-text-light placeholder:text-text-lighter focus:ring-0 focus:ring-offset-0 sm:text-sm sm:leading-6"
										id="pesquisa"
										name="pesquisa"
										placeholder="Pesquisa ideias de presentes"
										type="text"
									/>
								</div>
								<button
									aria-label="Pesquisar"
									className="rounded-r-md bg-cold px-6 text-white hover:bg-colder"
									type="submit"
								>
									<span className="sr-only">Pesquisar</span>
									<svg
										{...defaults}
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
										className="h-7 w-auto px-2"
										xmlnsXlink="http://www.w3.org/1999/xlink"
									>
										<use xlinkHref={`${sprite}#magnifier`} />
									</svg>
								</button>
							</div>
						</Form>
					</div>
				</div>
			</section>

			{term !== null ? (
				<div className="mx-auto max-w-7xl px-4 py-12">
					<h2 className="text-center font-serif text-3xl">
						Resultados da pesquisa para: "{term}"
					</h2>
				</div>
			) : null}

			{guiasCollection.slices[0] && guiasCollection.slices[0].length ? (
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
			) : null}

			{promocoesCollection.slices[0] && promocoesCollection.slices[0].length ? (
				<section className="mx-auto max-w-7xl px-8">
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
			) : null}
			<div className="pb-16"></div>
		</main>
	)
}
