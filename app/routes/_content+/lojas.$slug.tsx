import {
	type LoaderFunction,
	type MetaArgs,
	type MetaFunction,
	json,
} from '@remix-run/node'
import { useLoaderData, useLocation } from '@remix-run/react'
import {
	type ISbStories,
	type ISbStory,
	type ISbStoryData,
	getStoryblokApi,
	useStoryblokState,
	type ISbStoriesParams,
} from '@storyblok/react'
import { Suspense, lazy, useState } from 'react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
import Image, { type IBlok as IBlokImage } from '#app/components/Content/Image'
import Text, { type IBlok as IBlokText } from '#app/components/Content/Text'
import { GeneralErrorBoundary } from '#app/components/error-boundary.js'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

interface IBlok extends IBlokImage, IBlokText {
	id: string
}

const {
	img: { format },
} = config

const sbParams: ISbStoriesParams = {
	version: ENV.STORYBLOK_EXPLORE,
}
const PromocoesGrid = lazy(
	() => import('#app/components/Promocoes/PromocoesGrid'),
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

async function fetchPromocoes(filter: string, page = 1) {
	return await getStoryblokApi().get(`cdn/stories`, {
		...sbParams,
		starts_with: 'promocoes',
		is_startpage: false,
		page,
		filter_query: {
			Loja: { in: filter },
		},
		resolve_relations: ['Promocao.Loja'],
	})
}

export const loader: LoaderFunction = async ({ params: { slug } }) => {
	const { data } = await getStoryblokApi()
		.get(`cdn/stories/lojas/${slug}`, sbParams)
		.catch(_ => {
			return { data: null }
		})

	if (!data) {
		throw new Response('Not Found', { status: 404 })
	}

	const { data: promocoesInitialState, total } = await fetchPromocoes(
		data.story.uuid,
		1,
	)

	return json({
		data,
		promocoesInitialState,
		total,
	})
}

export const meta: MetaFunction<typeof loader> = ({
	data: loaderData,
}: MetaArgs) => {
	if (!loaderData) {
		return []
	}
	const { data } = loaderData as { data: ISbStory['data'] }
	const metadata = {
		title:
			data.story.content.SeoTitle ||
			`Loja: ${data.story.content.Title} - Presentes e Prendas`,
		description:
			data.story.content.SeoDescription || data.story.content.ShortBio,
		image: data.story?.content?.Image?.filename,
	}
	return [
		...generateMetadata(data.story.full_slug, metadata),
		generateStructureddata(
			{
				breadcrumbs: [
					{ name: 'Lojas', item: 'lojas' },
					{ name: data.story.content.Title, item: data.story.full_slug },
				],
			},
			data.story.full_slug,
			metadata,
		),
	]
}

export default function Slug() {
	const { data, promocoesInitialState, total } = useLoaderData<
		typeof loader
	>() as {
		data: ISbStory['data']
		promocoesInitialState: ISbStories['data']
		total: number
	}
	const story = useStoryblokState(data.story)

	const [promocoes, setPromocoes] = useState({
		page: 1,
		slices: [promocoesInitialState.stories],
		total,
	})

	if (!story) {
		return null
	}

	const loadMorePromocoes = async (page: number) => {
		const { data: promocoesSlice } = await fetchPromocoes(data.story.uuid, page)
		setPromocoes({
			page,
			slices: [...promocoes.slices, promocoesSlice.stories],
			total: promocoes.total,
		})
	}

	return (
		<main>
			<article>
				<div className="relative overflow-hidden">
					<div
						className="relative flex h-72 w-full flex-col items-center justify-center overflow-hidden bg-cover bg-top lg:h-96"
						style={{
							backgroundImage: `url("${story?.content?.BackgroundImage?.filename}/m/320x0${format})"`,
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
							<h1 className="sr-only">{story?.content?.Title}</h1>
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
				<div className="relative z-20 mx-auto max-w-5xl p-6 pt-16 lg:p-12">
					<img
						alt={story?.content?.Title}
						className="absolute left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-full rounded-3xl"
						src={`${story?.content?.Image?.filename}/m/128x128${format}`}
					/>

					<h1 className="font-heading my-12 text-center text-4xl">
						{story?.content?.Title}
					</h1>
					{}

					{story?.content.Content.map((blok: IBlok) => {
						if (blok.component === 'Content--Text') {
							return <Text key={blok.id} blok={blok} />
						}
						if (blok.component === 'Content--Image') {
							return <Image key={blok.id} blok={blok} />
						}
						return null
					})}
				</div>
			</article>
			<section className="-mt-12 bg-background pt-12">
				<div className="mx-auto max-w-7xl px-8 py-16">
					<h3 className="heading-large text-colder">
						Promoções {story?.content?.Title}
					</h3>
					{promocoes.slices.map((list: ISbStoryData[], index) => {
						return (
							<div key={`promocoes-grid-${index}`}>
								{index > 0 ? (
									<AsteriskDividerShadow className="mx-auto my-16 h-8 fill-cold" />
								) : null}
								<Suspense
									fallback={
										<p className="pb-20 text-center">A carregar conteúdos</p>
									}
								>
									<PromocoesGrid promocoes={list} />
								</Suspense>
							</div>
						)
					})}

					{promocoes.page < promocoes.total ? (
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
				</div>
			</section>
		</main>
	)
}
