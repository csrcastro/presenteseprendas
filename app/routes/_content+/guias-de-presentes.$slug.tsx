import { type LoaderFunction, type MetaFunction, defer } from '@remix-run/node'
import { Await, useLoaderData, useLocation } from '@remix-run/react'
import {
	type ISbStoriesParams,
	type ISbStoryData,
	type ISbStories,
	getStoryblokApi,
	useStoryblokState,
	type ISbStory,
} from '@storyblok/react'
import { Suspense, lazy, useState } from 'react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import Guia from '#app/components/Guias/Guia'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const {
	sb: { listParams },
	img: { format },
} = config

const Error = lazy(() => import('#app/components/Errors/Route404Error'))
const Breadcrumbs = lazy(() => import('#app/components/Breadcrumbs'))
const RelatedGuias = lazy(() => import('#app/components/Guias/RelatedGuias'))
const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))

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

function Guias({
	guiasInitialState,
	slug,
}: {
	guiasInitialState: ISbStories
	slug: string
}) {
	const [guias, setGuias] = useState<{
		page: number
		slices: ISbStoryData[][]
		total: number
	}>({
		page: 1,
		slices: [guiasInitialState.data.stories],
		total: guiasInitialState.total,
	})

	const loadMoreGuias = async (page: number, slug: string) => {
		const { data: newGuias } = await getStoryblokApi().get(`cdn/stories`, {
			version: ENV.STORYBLOK_EXPLORE,
			cv: ENV.CV,
			...listParams,
			starts_with: 'guias-de-presentes',
			excluding_slugs: `guias-de-presentes/${slug}`,
			page,
		})

		setGuias({
			page,
			slices: [...guias.slices, newGuias.stories],
			total: guias.total,
		})
	}

	return (
		<section className="pb-8 text-center">
			<h2 className="heading-large pt-0 text-colder">
				Guias de Presentes Recentes
			</h2>

			{guias.slices.map((slice, index) => {
				return (
					<div key={`promocoes-grid-${index}`}>
						{index > 0 ? (
							<AsteriskDividerShadow className="mx-auto my-16 h-8 fill-warm" />
						) : null}
						<Suspense
							fallback={
								<p className="pb-20 text-center">{'A carregar conteúdos'}</p>
							}
						>
							<PresentesGrid ideias={slice} alt={true} />
						</Suspense>
					</div>
				)
			})}

			{guias.total / listParams.per_page > guias.page ? (
				<button
					className="btn-large btn-vermais mt-16 bg-warm text-white hover:bg-warmer"
					onClick={() => {
						loadMoreGuias(guias.page + 1, slug)
					}}
				>
					Ver mais guias
				</button>
			) : null}
		</section>
	)
}

export const loader: LoaderFunction = async ({ params: { slug } }) => {
	const storyStoryblokParams = {
		version: ENV.STORYBLOK_EXPLORE,
		cv: ENV.CV,
		excluding_slugs: `guias-de-presentes/${slug}`,
	}

	const listStoryblokParams = {
		...storyStoryblokParams,
		...listParams,
	}

	const sbParams: ISbStoriesParams = {
		cv: ENV.CV,
		resolve_relations: [
			'Guia.Autor',
			'Presente.Loja',
			'Guia.Categoria',
			'Categoria.Parents',
		],
		version: ENV.STORYBLOK_EXPLORE,
	}

	const guiasInitialState = getStoryblokApi().get(`cdn/stories`, {
		...listStoryblokParams,
		starts_with: 'guias-de-presentes',
	})
	const { data } = await getStoryblokApi()
		.get(`cdn/stories/guias-de-presentes/${slug}`, sbParams)
		.catch((_) => {
			return { data: null }
		})

	if (!data) {
		throw new Response('Not Found', { status: 404 })
	}

	const related =
		!data.story.content.Related || data.story.content.Related.length < 1
			? new Promise((resolve) => {
					setTimeout(() => {
						resolve({ data: { stories: [] } })
					}, 0)
				})
			: getStoryblokApi().get(`cdn/stories/`, {
					by_uuids: (data.story.content.Related || []).join(','),
				})

	return defer({ data, guiasInitialState, related, slug })
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
	if (!loaderData) {
		return []
	}
	const { data } = loaderData as {
		data: ISbStory['data']
	}

	const fl = data.story.content.Image.filename
	const metadata = {
		title: data.story.content.SeoTitle,
		description: data.story.content.SeoDescription,
		image: fl,
		type: 'article',
		author: data.story.content.Autor.content.Nome,
		category: data.story.content.Categoria.content.Title,
	}
	return [
		{
			tagName: 'link',
			rel: 'preload',
			href: `${fl}/m/314x209${format}`,
			as: 'image',
			type: 'image/webp',
			fetchpriority: 'high',
		},
		{
			tagName: 'link',
			rel: 'preload',
			as: 'image',
			type: 'image/webp',
			href: `${fl}/m/314x209${format}`,
			imageSizes: `(min-width: 780px) 504px, (min-width: 640px) calc(50vw + 124px), (min-width: 480px) calc(83.57vw - 41px), calc(91.88vw - 45px)`,
			imageSrcSet: `${fl}/m/504x336${format} 504w, ${fl}/m/444x296${format} 444w, ${fl}/m/360x240${format} 360w, ${fl}/m/314x209${format} 314w`,
			fetchpriority: 'high',
		},
		...generateMetadata(data.story.full_slug.replace(/\/$/, ''), metadata),
		generateStructureddata(
			{
				breadcrumbs: [
					{ name: 'Guias de Presentes', item: 'guias-de-presentes' },
					{ name: data.story.content.Title, item: data.story.full_slug },
				],
				article: data.story,
				presentList: data.story.content.Presentes,
				faq: data.story.content.PerguntasFrequentes,
				video: {
					id: data.story.content.YoutubeID,
					date: data.story.content.YoutubeDate,
				},
			},
			data.story.full_slug,
			metadata,
		),
	]
}

export default function GuiaDePresentesPagina() {
	const { data, guiasInitialState, related, slug } = useLoaderData<
		typeof loader
	>() as {
		data: ISbStory['data']
		guiasInitialState: ISbStories
		related: ISbStories
		slug: string
	}
	const story = useStoryblokState(data.story)

	if (!story) {
		return null
	}

	return (
		<main className="mx-auto max-w-7xl p-6 lg:px-8">
			<Suspense fallback={<div className="h-[17px]" />}>
				<Breadcrumbs category={story?.content.Categoria} />
			</Suspense>
			<div className="mx-auto max-w-2xl">
				<Guia
					autor={story?.content?.Autor}
					blok={story?.content}
					publishedAt={story.published_at || ''}
					firstPublishedAt={story.first_published_at || ''}
				/>
			</div>

			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<Await resolve={related}>
					{(state) => {
						return state.data.stories.length > 0 ? (
							<RelatedGuias related={state} />
						) : null
					}}
				</Await>
			</Suspense>

			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<Await resolve={guiasInitialState}>
					{(state) => <Guias guiasInitialState={state} slug={slug} />}
				</Await>
			</Suspense>
		</main>
	)
}
