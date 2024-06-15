import { type LoaderFunction, type MetaFunction, json } from '@remix-run/node'
import { Link, useLoaderData, useLocation } from '@remix-run/react'
import {
	type ISbStoryData,
	getStoryblokApi,
	useStoryblokState,
	type ISbStory,
	type ISbStories,
} from '@storyblok/react'
import { Suspense, lazy, useState } from 'react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
import { GeneralErrorBoundary } from '#app/components/error-boundary.js'
import RichContent from '#app/components/Helpers/RichContent'
import RichText from '#app/components/Helpers/RichText'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))
const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
)

const {
	img: { format },
	sb: { listParams },
} = config

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

async function storiesService(start: string, autor: string, page = 1) {
	return await getStoryblokApi().get(`cdn/stories`, {
		...listParams,
		starts_with: start,
		is_startpage: false,
		version: ENV.STORYBLOK_EXPLORE,
		page,
		filter_query: {
			Autor: { in: autor },
		},
	})
}

const fetchGuias = (autor: string, page = 1) =>
	storiesService('guias-de-presentes', autor, page)
const fetchPromocoes = (autor: string, page = 1) =>
	storiesService('promocoes', autor, page)

export const loader: LoaderFunction = async ({ params: { slug } }) => {
	const { data } = await getStoryblokApi()
		.get(`cdn/stories/autores/${slug}`, {
			version: ENV.STORYBLOK_EXPLORE,
			resolve_relations: ['Autor.Guias', 'Autor.Promocoes'],
		})
		.catch(_ => {
			return { data: null }
		})

	if (!data) {
		throw new Response('Not Found', { status: 404 })
	}

	const { data: guiasInitialState, total: totalGuias } = await fetchGuias(
		data.story.uuid,
	)

	const { data: promocoesInitialState, total: totalPromocoes } =
		await fetchPromocoes(data.story.uuid)

	return json({
		data,
		guiasInitialState,
		totalGuias,
		promocoesInitialState,
		totalPromocoes,
	})
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
	if (!loaderData) {
		return []
	}
	const { data } = loaderData as {
		data: ISbStory['data']
		guiasInitialState: ISbStories['data']
		totalGuias: number
		promocoesInitialState: ISbStories['data']
		totalPromocoes: number
	}

	const metadata = {
		title: `${data.story.content.Nome}: autor(a) na Presentes e Prendas`,
		description: data.story.content.ShortBio,
	}
	return [
		...generateMetadata(data.story.full_slug, metadata),
		generateStructureddata(
			{
				breadcrumbs: [
					{ name: 'Autores', item: 'autores' },
					{ name: data.story.content.Nome, item: data.story.full_slug },
				],
			},
			data.story.full_slug,
			metadata,
		),
	]
}

export default function Autores() {
	const {
		data,
		guiasInitialState,
		totalGuias,
		promocoesInitialState,
		totalPromocoes,
	} = useLoaderData<typeof loader>() as {
		data: ISbStory['data']
		guiasInitialState: ISbStories['data']
		totalGuias: number
		promocoesInitialState: ISbStories['data']
		totalPromocoes: number
	}
	const story = useStoryblokState(data.story)

	const [promocoes, setPromocoes] = useState({
		page: 1,
		slices: [promocoesInitialState.stories],
		total: totalPromocoes,
	})

	const loadMorePromocoes = async (page: number) => {
		const { data: promocoesSlice } = await fetchPromocoes(data.story.uuid, page)
		setPromocoes({
			page,
			slices: [...promocoes.slices, promocoesSlice.stories],
			total: promocoes.total,
		})
	}

	const [guias, setGuias] = useState({
		page: 1,
		slices: [guiasInitialState.stories],
		total: totalGuias,
	})

	const loadMoreGuias = async (page: number) => {
		const { data: guiasSlice } = await fetchGuias(data.story.uuid, page)
		setGuias({
			page,
			slices: [...guias.slices, guiasSlice.stories],
			total: guias.total,
		})
	}

	return (
		<main>
			<article>
				<div className="bg-warm px-4 pt-6 lg:px-8">
					<div className="relative z-10 mx-auto max-w-5xl rounded bg-white p-6 shadow lg:p-12">
						<div className="flex flex-col items-center lg:flex-row">
							<img
								alt={story?.content.Nome}
								className="h-32 w-32 grow-0 rounded-full object-cover ring-4 ring-warm/75 lg:mr-12"
								src={story?.content.Foto.filename}
							/>
							<div className="grow">
								<h1 className="font-heading mb-4 mt-8 text-center text-4xl lg:mt-0 lg:text-left">
									{story?.content.Nome}
								</h1>
								<RichText document={story?.content.Bio} />
							</div>
						</div>
					</div>
				</div>
				<div className="-mt-12 bg-background px-8">
					<div className="mx-auto max-w-5xl pt-12">
						<h2 className="font-heading py-16 text-center text-4xl uppercase">
							As minhas escolhas
						</h2>
						<section
							aria-labelledby="products-heading"
							className="mx-auto max-w-7xl overflow-hidden pb-2"
						>
							<h3 className="sr-only">As minhas promoções favoritas</h3>
							<Suspense
								fallback={
									<p className="pb-20 text-center">A carregar conteúdos</p>
								}
							>
								<PromocoesGrid promocoes={story?.content.Promocoes} />
							</Suspense>
						</section>
					</div>
					<AsteriskDividerShadow className="mx-auto my-16 h-8 fill-warm" />
					<div className="mx-auto max-w-5xl pb-16">
						<section
							aria-labelledby="products-heading"
							className="mx-auto max-w-7xl overflow-hidden"
						>
							<h3 className="sr-only">Os meus guias favoritos</h3>
							<Suspense
								fallback={
									<p className="pb-20 text-center">A carregar conteúdos</p>
								}
							>
								<PresentesGrid ideias={story?.content.Guias} />
							</Suspense>
						</section>
					</div>
				</div>
				<div className="bg-white">
					<div className="mx-auto max-w-5xl px-8 py-24">
						<div className="grid gap-6 sm:grid-cols-2">
							<section aria-labelledby="products-heading" className="">
								<h3 className="font-heading mb-8 text-2xl text-colder md:text-3xl lg:text-4xl">
									Guias recentes
								</h3>

								{guias.slices.map(slice =>
									slice.map((story: ISbStoryData) => (
										<div
											key={story.uuid}
											className="group relative mb-6 grid grid-cols-3 gap-6"
										>
											<div className="aspect-[4/3] overflow-hidden rounded-lg">
												<Link
													to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
												>
													<img
														alt={
															story.content.Image.alt || story.content.SeoTitle
														}
														className="object-cover object-center"
														width="140"
														height="105"
														loading="lazy"
														sizes={`(min-width: 1080px) 140px, (min-width: 640px) calc(15.24vw - 22px), (min-width: 560px) 140px, calc(32.08vw - 33px)`}
														src={`${story.content.Image.filename}/m/183x137${format}`}
														srcSet={`${story.content.Image.filename}/m/176x132${format} 176w, ${story.content.Image.filename}/m/140x105${format} 140w`}
													/>
												</Link>
											</div>
											<div className="col-span-2">
												<Link
													className="font-bold capitalize"
													to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
												>
													<span aria-hidden="true" className="absi-0" />
													<RichContent document={story.content.Title} />
												</Link>
											</div>
										</div>
									)),
								)}
								{guias.total > guias.page * listParams.per_page ? (
									<div className="text-center">
										<button
											className="btn-large btn-vermais mt-16 bg-cold text-white hover:bg-colder"
											onClick={() => {
												loadMoreGuias(guias.page + 1)
											}}
										>
											Ver mais
										</button>
									</div>
								) : null}
							</section>

							<section aria-labelledby="products-heading" className="">
								<h3 className="font-heading mb-8 text-2xl text-colder md:text-3xl lg:text-4xl">
									Promoções recentes
								</h3>
								{promocoes.slices.map(slice =>
									slice.map((story: ISbStoryData) => (
										<div
											key={story.uuid}
											className="group relative mb-6 grid grid-cols-3 gap-6"
										>
											<div className="aspect-[4/3] overflow-hidden rounded-lg">
												<Link
													to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
												>
													<img
														alt={
															story.content.Image.alt || story.content.SeoTitle
														}
														className="object-cover object-center"
														width="140"
														height="105"
														loading="lazy"
														sizes="(min-width: 1080px) 140px, (min-width: 640px) calc(15.24vw - 22px), (min-width: 560px) 140px, calc(32.08vw - 33px)"
														src={`${story.content.Image.filename}/m/183x137${format}`}
														srcSet={`${story.content.Image.filename}/m/176x132${format} 176w, ${story.content.Image.filename}/m/140x105${format} 140w`}
													/>
												</Link>
											</div>
											<div className="col-span-2">
												<Link
													to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
													className="font-bold"
												>
													<span aria-hidden="true" className="absi-0" />
													{story.content.Title}
												</Link>
											</div>
										</div>
									)),
								)}
								{promocoes.total > promocoes.page * listParams.per_page ? (
									<div className="text-center">
										<button
											className="btn-large btn-vermais mt-16 bg-cold text-white hover:bg-colder"
											onClick={() => {
												loadMorePromocoes(promocoes.page + 1)
											}}
										>
											Ver mais
										</button>
									</div>
								) : null}
							</section>
						</div>
					</div>
				</div>
			</article>
		</main>
	)
}
