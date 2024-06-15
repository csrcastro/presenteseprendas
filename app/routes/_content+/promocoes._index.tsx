import { type MetaFunction, json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	type ISbResult,
	getStoryblokApi,
	useStoryblokState,
	type ISbStoryData,
	type ISbStories,
	type ISbStory,
} from '@storyblok/react'

import Landing, { type IBlok } from '#app/components/Promocoes/Landing'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const perPage = 20

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
	const { landing, promocoes, promocoesCurrentPage } = loaderData as {
		landing: ISbStory['data']
		promocoes: ISbStories['data']
		promocoesCurrentPage: string
	}
	const metadata = {
		title: `Promoções e descontos, partilhamos contigo as melhores${
			parseInt(promocoesCurrentPage, 10) > 1
				? ` - página ${promocoesCurrentPage}`
				: ''
		}`,
		description: `Todos gostamos de uma boa promoçāo, -20% aqui, -10% ali, e assim poupamos uns euros. Na Presentes e Prendas partilhamos contigo promoções que valem a pena${
			parseInt(promocoesCurrentPage, 10) > 1
				? ` - página ${promocoesCurrentPage}`
				: ''
		}`,
	}
	const url =
		parseInt(promocoesCurrentPage, 10) > 1
			? `${landing.story.full_slug.replace(
					/\/$/,
					'',
				)}?pagina=${promocoesCurrentPage}`
			: landing.story.full_slug
	return [
		...generateMetadata(url, metadata),
		generateStructureddata(
			{
				breadcrumbs: [{ name: 'Promoções', item: 'promocoes' }],
				collection: {
					url: 'promocoes',
					name: `Promocoes${
						parseInt(promocoesCurrentPage, 10) > 1
							? ` Página ${promocoesCurrentPage}`
							: ''
					}`,
					description: landing.story.content.SeoDescription,
					stories: [...landing.story.content.OurPicks, ...promocoes.stories],
				},
			},
			url,
			metadata,
		),
	]
}

export const loader: LoaderFunction = async ({
	request,
}: {
	request: Request
}) => {
	const url = new URL(request.url)

	const search = new URLSearchParams(url.search)

	const { data: landing }: ISbResult = await getStoryblokApi().get(
		`cdn/stories/promocoes`,
		{
			version: ENV.STORYBLOK_EXPLORE,
			resolve_relations: ['Collection.OurPicks', 'Promocao.Loja'],
		},
	)

	const promocoesCurrentPage = search.get('pagina') || '1'
	const { data: promocoes, total: promocoesTotal }: ISbResult =
		await getStoryblokApi().get(`cdn/stories`, {
			version: ENV.STORYBLOK_EXPLORE,
			starts_with: 'promocoes',
			sort_by: 'first_published_at:desc',
			is_startpage: false,
			per_page: perPage,
			page: promocoesCurrentPage ? parseInt(promocoesCurrentPage, 10) : 1,
			resolve_relations: ['Promocao.Loja'],
		})

	const promocoesTotalPages = Math.ceil(promocoesTotal / perPage)

	return json({
		landing,
		url,
		promocoes,
		promocoesCurrentPage,
		promocoesTotalPages,
	})
}

export default function Page() {
	const { landing, url, promocoes, promocoesCurrentPage, promocoesTotalPages } =
		useLoaderData<typeof loader>() as {
			landing: ISbStory['data']
			url: URL
			promocoes: ISbStories['data']
			promocoesCurrentPage: string
			promocoesTotalPages: number
		}

	const landingState = useStoryblokState(landing.story) as ISbStoryData<IBlok>

	return (
		<Landing
			blok={landingState?.content}
			picks={landing?.story?.content?.OurPicks}
			url={url}
			promocoes={promocoes}
			promocoesCurrentPage={promocoesCurrentPage}
			promocoesTotalPages={promocoesTotalPages}
		/>
	)
}
