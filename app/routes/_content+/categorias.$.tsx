import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from '@headlessui/react'
import { type LoaderFunction, type MetaFunction, defer } from '@remix-run/node'
import { Await, Link, useLoaderData, useLocation } from '@remix-run/react'
import {
	type ISbStoriesParams,
	type ISbStoryData,
	getStoryblokApi,
	useStoryblokState,
	type ISbResult,
	type ISbStory,
} from '@storyblok/react'
import { Suspense, lazy } from 'react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.js'
import RichContent from '#app/components/Helpers/RichContent'
import RichContentGuia from '#app/components/Helpers/RichContentGuia'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
)
const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))
const PageNavigation = lazy(() => import('#app/components/PageNavigation'))
const HomeGuiasDestaques = lazy(
	() => import('#app/components/Sections/HomeGuiasDestaques'),
)

const Error = lazy(() => import('#app/components/Errors/Route404Error'))

export function ErrorBoundary() {
	const location = useLocation()
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: () => (
					<Suspense fallback={<p className="pb-20 text-center">Erro</p>}>
						<Error location={location.pathname} />
					</Suspense>
				),
			}}
		/>
	)
}

const {
	img: { format },
} = config

const perPage = 12

export const loader: LoaderFunction = async ({ params, request }) => {
	const url = new URL(request.url)
	const slug = params['*']

	const search = new URLSearchParams(url.search)

	const sbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
		resolve_relations: [
			'FeaturedIdeias',
			'FeaturedPromocoes',
			'RelatedCategories',
		],
	}

	const { data } = await getStoryblokApi()
		.get(`cdn/stories/categorias/${slug}`, sbParams)
		.catch(_ => {
			return { data: null }
		})

	if (!data) {
		throw new Response('Not Found', { status: 404 })
	}

	//GUIAS

	const guiasCurrentPage = search.get('pagina-de-guias') || '1'
	const guiasPromise = getStoryblokApi().get(`cdn/stories`, {
		version: ENV.STORYBLOK_EXPLORE,
		starts_with: 'guias-de-presentes',
		sort_by: 'first_published_at:desc',
		per_page: perPage,
		filter_query: {
			V2_Categories: { any_in_array: data.story.uuid },
		},
		page: guiasCurrentPage ? parseInt(guiasCurrentPage, 10) : 1,
	})

	//PROMOCOES

	const promocoesCurrentPage = search.get('pagina-de-promocoes') || '1'
	const promocoesPromise = await getStoryblokApi().get(`cdn/stories`, {
		version: ENV.STORYBLOK_EXPLORE,
		starts_with: 'promocoes',
		sort_by: 'first_published_at:desc',
		per_page: perPage,
		filter_query: {
			V2_Categories: { any_in_array: data.story.uuid },
		},
		page: promocoesCurrentPage ? parseInt(promocoesCurrentPage, 10) : 1,
		resolve_relations: ['Promocao.Loja'],
	})

	const { featuredPromocoes, featuredGuias, relatedCategories } =
		data.rels.reduce(
			(
				acc: {
					featuredGuias: ISbStoryData[]
					featuredPromocoes: ISbStoryData[]
					relatedCategories: ISbStoryData[]
				},
				current: ISbStoryData,
			) => {
				const guiaPosition = data.story?.content.FeaturedIdeias.indexOf(
					current.uuid,
				)
				const promocaoPosition = data.story?.content.FeaturedPromocoes.indexOf(
					current.uuid,
				)
				const relatedCategoryPosition =
					data.story?.content.RelatedCategories.indexOf(current.uuid)

				if (guiaPosition > -1) {
					acc.featuredGuias.splice(guiaPosition, 0, current)
				}
				if (promocaoPosition > -1) {
					acc.featuredPromocoes.splice(promocaoPosition, 0, current)
				}
				if (relatedCategoryPosition > -1) {
					acc.relatedCategories.splice(relatedCategoryPosition, 0, current)
				}

				return acc
			},
			{
				featuredPromocoes: [],
				featuredGuias: [],
				relatedCategories: [],
			},
		)

	return defer({
		data,
		featuredPromocoes,
		featuredGuias,
		relatedCategories,
		url,
		guiasCurrentPage,
		guiasPromise,
		promocoesCurrentPage,
		promocoesPromise,
	})
}

function urelle(url: string, segmentOne: string, segmentTwo: string): string[] {
	if (parseInt(segmentOne, 10) < 2 && parseInt(segmentTwo, 10) < 2) {
		return [url, '']
	}

	const searchParams = new URLSearchParams('')
	let page = ' '

	if (parseInt(segmentOne, 10) > 1) {
		searchParams.append('pagina-de-guias', segmentOne)
		page += `${segmentOne} `
	}

	if (parseInt(segmentOne, 10) > 1 || parseInt(segmentTwo, 10) > 1) {
		page += '•'
	}

	if (parseInt(segmentTwo, 10) > 1) {
		searchParams.append('pagina-de-promocoes', segmentTwo)
		page += ` ${segmentTwo}`
	}

	return [`${url.replace(/\/$/, '')}?${searchParams.toString()}`, page]
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
	if (!loaderData) {
		return []
	}
	const { data, guiasCurrentPage, promocoesCurrentPage } = loaderData as {
		data: ISbStory['data']
		guiasCurrentPage: string
		promocoesCurrentPage: string
	}
	const [url, page] = urelle(
		data.story.full_slug,
		guiasCurrentPage,
		promocoesCurrentPage,
	)
	const metadata = {
		title: `${data.story.content.SeoTitle}${page}`,
		description: `${data.story.content.SeoDescription}${page}`,
		image: data.story.content.Image.filename,
		type: 'article',
	}
	return [
		...generateMetadata(url || '', metadata),
		generateStructureddata(
			{
				breadcrumbs: [
					{ name: 'Categorias', item: 'categorias' },
					{ name: data.story.content.Title, item: url || '' },
				],
			},
			url || '',
			metadata,
		),
	]
}

function CategoryTitlePage({
	segmentOne,
	segmentTwo,
}: {
	segmentOne: string
	segmentTwo: string
}) {
	if (parseInt(segmentOne, 10) < 2 && parseInt(segmentTwo, 10) < 2) {
		return null
	}

	return <span>{`Page # ${segmentOne}|${segmentTwo}: `}</span>
}

export default function Categoria() {
	const {
		data,
		featuredPromocoes,
		featuredGuias,
		relatedCategories,
		url,
		guiasCurrentPage,
		guiasPromise,
		promocoesCurrentPage,
		promocoesPromise,
	} = useLoaderData<typeof loader>() as {
		data: ISbStory['data']
		featuredPromocoes: ISbStoryData[]
		featuredGuias: ISbStoryData[]
		relatedCategories: ISbStoryData[]
		url: URL
		guiasCurrentPage: string
		guiasPromise: Promise<ISbResult>
		promocoesCurrentPage: string
		promocoesPromise: Promise<ISbResult>
	}

	const story = useStoryblokState(data.story)

	return (
		<main>
			<article>
				<div className="relative overflow-hidden">
					<div
						className="relative flex aspect-[1380/500] flex-col items-center justify-center overflow-hidden bg-cover bg-center"
						style={{
							backgroundImage: `url("${story?.content?.Image?.filename}/m/320x0${format}")`,
						}}
					>
						<div
							aria-hidden="true"
							className="absi-0 z-10 transform-gpu backdrop-blur-sm"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-x-0 z-20 transform-gpu blur-3xl sm:-top-80"
						>
							<div
								className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-warm to-warmer opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
								style={{
									clipPath:
										'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
								}}
							/>
						</div>
						<div className="absi-0 z-10 bg-colder/25" />
						<div className="relative z-20 mx-auto max-w-5xl text-center">
							<h1
								className="font-heading text-3xl uppercase text-background sm:text-5xl md:text-6xl lg:text-5xl"
								id="category-heading"
							>
								<span className="sr-only">
									<CategoryTitlePage
										segmentOne={guiasCurrentPage}
										segmentTwo={promocoesCurrentPage}
									/>
									{'Presentes, prendas e promocões - '}
								</span>
								{story?.content?.Title}
							</h1>
						</div>
					</div>
					<div
						aria-hidden="true"
						className="absolute inset-x-0 top-[calc(100%-13rem)] z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
					>
						<div
							className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-warm to-warmer opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
							style={{
								clipPath:
									'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
							}}
						/>
					</div>
				</div>

				{featuredPromocoes.length ? (
					<div className="relative z-30 mt-6 pb-4 lg:-mt-32 lg:pb-16">
						<h2 className="sr-only" id="featured-promotions-heading">
							Promoções {story?.content?.Title} em Destaque
						</h2>
						<div className="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 sm:max-w-7xl sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 sm:px-6 lg:gap-x-8 lg:px-8">
							{featuredPromocoes.map((promocao: ISbStoryData) => (
								<div
									key={`featured-category-${promocao.uuid}`}
									className="group relative mx-auto flex w-full max-w-sm flex-col items-center justify-center"
								>
									<div
										className="h-64 w-full rounded-lg bg-cover bg-center shadow-md"
										style={{
											backgroundImage: `url("${promocao.content?.Image?.filename}/m/384x256${format}")`,
										}}
									/>
									<div className="mx-4 -mt-10 overflow-hidden rounded-lg bg-white px-4 py-2 shadow-lg transition-colors duration-300 lg:group-hover:bg-warm">
										<Link
											aria-label={promocao.content.Title}
											className="py-2 text-center font-bold uppercase"
											to={`${ENV.BASE_URL}/${promocao.full_slug.replace(
												/\/$/,
												'',
											)}`}
										>
											{promocao.content.Title}
											<span aria-hidden="true" className="absi-0" />
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>
				) : null}
				<h2 className="sr-only">Categoria {story?.content?.Title}</h2>
				<div className="mx-auto max-w-5xl px-8 py-4 lg:pb-16">
					<p className="mb-6">
						<RichContent document={story?.content.Intro} />
					</p>
					{story?.content.Content &&
					story?.content.Content.content.length > 1 ? (
						<Disclosure key={`${story?.content._uid}-content`}>
							{({ open }) => (
								<>
									{open ? null : (
										<div className="flex w-full items-center justify-center">
											<DisclosureButton className="btn-medium btn-lermais bg-warm text-white hover:bg-warmer">
												Ler mais
											</DisclosureButton>
										</div>
									)}

									<DisclosurePanel as="div" unmount={false}>
										<RichContentGuia document={story?.content.Content} />
									</DisclosurePanel>
								</>
							)}
						</Disclosure>
					) : null}
				</div>
			</article>
			<Suspense
				fallback={<p className="pb-20 text-center">A carregar conteúdos</p>}
			>
				<HomeGuiasDestaques
					containerClasses="px-4 lg:px-16"
					heading="Destaques"
					headingClasses="heading-large"
					ideias={featuredGuias}
				/>
			</Suspense>

			<Suspense
				fallback={<p className="pb-20 text-center">A carregar conteúdos</p>}
			>
				<Await resolve={guiasPromise}>
					{state => {
						return state.data.stories.length > 0 ? (
							<section className="mx-auto max-w-7xl px-8">
								<h3 className="heading-large" id="guia-grid">
									Guias de Presentes
								</h3>
								<PresentesGrid ideias={state.data.stories} alt={true} />
								<PageNavigation
									borderColor="warm"
									containerClasses="px-4 py-3 sm:px-6"
									current={parseInt(guiasCurrentPage, 10)}
									hash="guia-grid"
									searchParam="pagina-de-guias"
									textColor="warmer"
									total={Math.ceil(state.total / state.perPage)}
									url={url}
								/>
							</section>
						) : null
					}}
				</Await>
			</Suspense>

			<Suspense
				fallback={<p className="pb-20 text-center">A carregar conteúdos</p>}
			>
				<Await resolve={promocoesPromise}>
					{state => {
						return state.data.stories.length > 0 ? (
							<section className="mx-auto max-w-7xl px-8">
								<h3 className="heading-large" id="promo-grid">
									Promocões
								</h3>
								<PromocoesGrid promocoes={state.data.stories} />
								<PageNavigation
									borderColor="cold"
									containerClasses="px-4 py-3 sm:px-6"
									current={parseInt(promocoesCurrentPage, 10)}
									hash="promo-grid"
									searchParam="pagina-de-promocoes"
									textColor="colder"
									total={Math.ceil(state.total / state.perPage)}
									url={url}
								/>
							</section>
						) : null
					}}
				</Await>
			</Suspense>

			{relatedCategories.length ? (
				<section className="mx-auto max-w-7xl px-8 pb-12">
					<h3 className="heading-large text-colder">
						Categorias relacionadas com {story?.content?.Title}
					</h3>

					<ul className="flex flex-col items-center justify-center gap-x-4 md:flex-row">
						{relatedCategories.map((category: ISbStoryData) => {
							return (
								<li key={`category-list-${category.uuid}`} className="pb-8">
									<Link
										className="inline-flex items-center gap-x-1.5 rounded-full bg-cold px-10 py-5 text-sm font-bold text-white"
										to={`${ENV.BASE_URL}/${category.full_slug.replace(
											/\/$/,
											'',
										)}`}
									>
										{category?.content?.Title}
									</Link>
								</li>
							)
						})}
					</ul>
				</section>
			) : null}
		</main>
	)
}
