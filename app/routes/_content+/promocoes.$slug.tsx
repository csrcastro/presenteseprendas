import {
	type LoaderFunction,
	type MetaArgs,
	type MetaFunction,
	defer,
} from '@remix-run/node'
import { Await, useLoaderData, useLocation } from '@remix-run/react'
import {
	type ISbStoriesParams,
	getStoryblokApi,
	useStoryblokState,
	type ISbStoryData,
	type ISbStory,
	type ISbStories,
} from '@storyblok/react'
import { lazy, Suspense, useState } from 'react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
import { GeneralErrorBoundary } from '#app/components/error-boundary.js'
import Promocao, { type IBlok } from '#app/components/Promocoes/Promocao'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const {
	sb: { listParams },
} = config

const Breadcrumbs = lazy(() => import('#app/components/Breadcrumbs'))
const Error = lazy(() => import('#app/components/Errors/Route404Error'))
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

export const loader: LoaderFunction = async ({ params: { slug } }) => {
	const storyStoryblokParams = {
		version: ENV.STORYBLOK_EXPLORE,
		cv: ENV.CV,
	}

	const listStoryblokParams = {
		...storyStoryblokParams,
		...listParams,
	}

	const sbPromocoesParams: ISbStoriesParams = {
		...storyStoryblokParams,
		resolve_relations: [
			'Promocao.Autor',
			'Promocao.Categoria',
			'Promocao.Loja',
		],
	}

	const guiasInitialState = getStoryblokApi().get(`cdn/stories`, {
		...listStoryblokParams,
		starts_with: 'guias-de-presentes',
	})

	const { data } = await getStoryblokApi()
		.get(`cdn/stories/promocoes/${slug}`, sbPromocoesParams)
		.catch((_) => {
			return { data: null }
		})

	if (!data) {
		throw new Response('Not Found', { status: 404 })
	}

	return defer({ data, guiasInitialState })
}

export const meta: MetaFunction<typeof loader> = ({
	data: loaderData,
}: MetaArgs) => {
	if (!loaderData) {
		return []
	}

	const { data } = loaderData as {
		data: ISbStory['data']
	}

	const metadata = {
		title: data.story.content.SeoTitle,
		description: data.story.content.SeoDescription,
		image: data.story.content.Image.filename,
		type: 'article',
		author: data.story.content.Autor.content.Nome,
		category: data.story.content.Categoria.content.Title,
	}

	return [
		...generateMetadata(data.story.full_slug, metadata),
		generateStructureddata(
			{
				breadcrumbs: [
					{ name: 'Promoções', item: 'promocoes' },
					{ name: data.story.content.Title, item: data.story.full_slug },
				],
				article: data.story,
			},
			data.story.full_slug,
			metadata,
		),
	]
}

function Guias({ guiasInitialState }: { guiasInitialState: ISbStories }) {
	const [guias, setGuias] = useState({
		page: 1,
		slices: [guiasInitialState.data.stories],
		total: guiasInitialState.total,
	})

	const loadMoreGuias = async (page: number) => {
		const { data: newGuias } = await getStoryblokApi().get(`cdn/stories`, {
			version: ENV.STORYBLOK_EXPLORE,
			cv: ENV.CV,
			...listParams,
			starts_with: 'guias-de-presentes',
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
			<h2 className="heading-large pt-0 text-warm">
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
						loadMoreGuias(guias.page + 1)
					}}
				>
					Ver mais guias
				</button>
			) : null}
		</section>
	)
}

export default function PromocaoPagina() {
	const { data, guiasInitialState } = useLoaderData<typeof loader>() as {
		data: ISbStory['data']
		guiasInitialState: Promise<ISbStories>
	}
	const story = useStoryblokState(data.story) as ISbStoryData<
		IBlok & { Categoria: ISbStoryData }
	>
	return (
		<main className="mx-auto max-w-7xl p-6 lg:px-8">
			<Suspense fallback={<div style={{ height: '17px' }} />}>
				<Breadcrumbs category={story?.content.Categoria} />
			</Suspense>
			<div className="mx-auto max-w-3xl">
				<Promocao blok={story?.content} />
			</div>

			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<Await resolve={guiasInitialState}>
					{(state) => <Guias guiasInitialState={state} />}
				</Await>
			</Suspense>
		</main>
	)
}
