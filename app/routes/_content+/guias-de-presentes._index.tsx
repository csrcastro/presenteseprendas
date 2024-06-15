import { type LoaderFunction, type MetaFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	type ISbStories,
	type ISbStory,
	type ISbStoryData,
	getStoryblokApi,
	useStoryblokState,
} from '@storyblok/react'
import Landing, { type IBlok } from '#app/components/Guias/Landing'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const perPage = 20

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
	const { landing, guias, guiasCurrentPage } = loaderData as {
		landing: ISbStory['data']
		guias: ISbStories['data']
		guiasCurrentPage: string
		guiasTotalPages: number
	}
	const url =
		parseInt(guiasCurrentPage, 10) > 1
			? `${landing.story.full_slug.replace(
					/\/$/,
					'',
				)}?pagina=${guiasCurrentPage}`
			: landing.story.full_slug
	const metadata = {
		title: `Guias de presentes: Inspira-te para oferecer mais e melhor!${
			parseInt(guiasCurrentPage, 10) > 1 ? ` - ${guiasCurrentPage}` : ''
		}`,
		description: `Explore os nossos guias de presentes e prendas repletos de inspiração para todas as ocasiões. Encontre sugestões personalizadas, ideias criativas e mais ${
			parseInt(guiasCurrentPage, 10) > 1 ? ` - ${guiasCurrentPage}` : ''
		}`,
	}

	return [
		...generateMetadata(url, metadata),
		generateStructureddata(
			{
				breadcrumbs: [
					{ name: 'Guias de Presentes', item: 'guias-de-presentes' },
				],
				collection: {
					url: url,
					name: `Guias de Presentes${
						parseInt(guiasCurrentPage, 10) > 1
							? ` Página ${guiasCurrentPage}`
							: ''
					}`,
					description: landing.story.content.SeoDescription,
					stories: [...landing.story.content.OurPicks, ...guias.stories],
				},
			},
			url,
			metadata,
		),
	]
}

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url)
	const search = new URLSearchParams(url.search)

	const { data: landing } = await getStoryblokApi().get(
		`cdn/stories/guias-de-presentes`,
		{
			version: ENV.STORYBLOK_EXPLORE,
			resolve_relations: ['GuiasLanding.OurPicks'],
		},
	)

	const guiasCurrentPage = search.get('pagina') || '1'
	const { data: guias, total: guiasTotal } = await getStoryblokApi().get(
		`cdn/stories`,
		{
			version: ENV.STORYBLOK_EXPLORE,
			starts_with: 'guias-de-presentes',
			is_startpage: false,
			sort_by: 'first_published_at:desc',
			per_page: perPage,
			page: guiasCurrentPage ? parseInt(guiasCurrentPage, 10) : 1,
		},
	)

	const guiasTotalPages = Math.ceil(guiasTotal / perPage)

	return json({
		landing,
		url,
		guias,
		guiasCurrentPage,
		guiasTotalPages,
	})
}

export default function Page() {
	const { landing, url, guias, guiasCurrentPage, guiasTotalPages } =
		useLoaderData<typeof loader>() as {
			landing: ISbStory['data']
			url: URL
			guias: ISbStories['data']
			guiasCurrentPage: string
			guiasTotalPages: number
		}

	const landingState = useStoryblokState(landing.story) as ISbStoryData<IBlok>

	if (!landingState) {
		return null
	}

	return (
		<Landing
			blok={landingState?.content}
			picks={landingState?.content?.OurPicks}
			url={url}
			guias={guias}
			guiasCurrentPage={guiasCurrentPage}
			guiasTotalPages={guiasTotalPages}
		/>
	)
}
