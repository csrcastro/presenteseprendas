import {
	type LoaderFunction,
	type MetaArgs,
	type MetaFunction,
	defer,
} from '@remix-run/node'
import { Await, useLoaderData, useLocation } from '@remix-run/react'
import {
	type ISbStories,
	type ISbStory,
	getStoryblokApi,
	useStoryblokState,
	type ISbStoriesParams,
} from '@storyblok/react'
import { Suspense, lazy } from 'react'
import Image, { type IBlok as IBlokImage } from '#app/components/Content/Image'
import Text, { type IBlok as IBlokText } from '#app/components/Content/Text'
import { GeneralErrorBoundary } from '#app/components/error-boundary.js'
import RichText from '#app/components/Helpers/RichText.js'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const {
	sb: { listParams },
	img: { format },
} = config

interface IBlok extends IBlokImage, IBlokText {
	_uid: string
}

const sbParams: ISbStoriesParams = {
	version: ENV.STORYBLOK_EXPLORE,
}

const Promocoes = lazy(
	() => import('#app/components/Promocoes/PromocoesDynamicList'),
)
const Guias = lazy(() => import('#app/components/Guias/GuiasDynamicList'))
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

export const loader: LoaderFunction = async ({ params: { slug } }) => {
	const storyStoryblokParams = {
		version: ENV.STORYBLOK_EXPLORE,
		cv: ENV.CV,
	}

	const listStoryblokParams = {
		...storyStoryblokParams,
		...listParams,
	}

	const guiasInitialState = getStoryblokApi().get(`cdn/stories`, {
		...listStoryblokParams,
		starts_with: 'guias-de-presentes',
	})

	const { data } = await getStoryblokApi()
		.get(`cdn/stories/lojas/${slug}`, sbParams)
		.catch(_ => {
			return { data: null }
		})

	if (!data) {
		throw new Response('Not Found', { status: 404 })
	}

	const promocoesInitialState = getStoryblokApi().get(`cdn/stories`, {
		...listStoryblokParams,
		starts_with: 'promocoes',
		filter_query: {
			Loja: { in: data.story.uuid },
		},
		resolve_relations: ['Promocao.Loja'],
	})

	return defer({
		data,
		guiasInitialState,
		promocoesInitialState,
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
		image: data.story.content.Image?.filename,
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

export default function Loja() {
	const { data, guiasInitialState, promocoesInitialState } = useLoaderData<
		typeof loader
	>() as {
		data: ISbStory['data']
		guiasInitialState: Promise<ISbStories>
		promocoesInitialState: Promise<ISbStories>
	}
	const story = useStoryblokState(data.story)

	if (!story) {
		return null
	}

	return (
		<main>
			<article>
				<div className="relative overflow-hidden">
					<div
						className="relative flex h-72 w-full flex-col items-center justify-center overflow-hidden bg-cover bg-top lg:h-96"
						style={{
							backgroundImage: `url("${story.content.BackgroundImage?.filename}/m/320x0${format}")`,
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
				<div className="text-text-mid relative z-20 mx-auto max-w-2xl p-6 pt-16 text-lg lg:p-12">
					<img
						alt={story.content.Title}
						className="absolute left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-full rounded-3xl"
						src={`${story.content.Image?.filename}/m/128x128${format}`}
					/>

					<h1 className="font-serif my-12 text-center text-4xl text-warm">
						{story.content.Title}
					</h1>

					{story.content.Content &&
						story.content.Content.map((blok: IBlok) => {
							if (blok.component === 'Content--Text') {
								return <Text key={blok._uid} blok={blok} />
							}
							if (blok.component === 'Content--Image') {
								return <Image key={blok._uid} blok={blok} />
							}
							return null
						})}
				</div>
				<div className="mb-12 p-8">
					<div className="mx-auto max-w-4xl animate-grad overflow-hidden rounded-lg bg-gradient-to-tr from-warm via-[#efe7bc] to-cold bg-2x p-4 shadow-md lg:p-4">
						<div className=" rounded-sm bg-white p-8 text-sm shadow">
							<h4 className="font-serif mb-8 text-xl">{`Envios na ${story.content.Title}`}</h4>
							<RichText document={story.content.ShippingInfo} />
						</div>
					</div>
				</div>
			</article>

			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar promoções'}</p>}
			>
				<Await resolve={promocoesInitialState}>
					{state => (
						<Promocoes
							filterQuery={{
								Loja: { in: data.story.uuid },
							}}
							promocoesInitialState={state}
						/>
					)}
				</Await>
			</Suspense>

			<Suspense
				fallback={
					<p className="pb-20 text-center">{'A carregar guias de presentes'}</p>
				}
			>
				<Await resolve={guiasInitialState}>
					{state => <Guias guiasInitialState={state} />}
				</Await>
			</Suspense>
		</main>
	)
}
