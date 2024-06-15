import { type LoaderFunction, type MetaFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	type ISbStoriesParams,
	type ISbStory,
	type SbBlokData,
	getStoryblokApi,
	useStoryblokState,
} from '@storyblok/react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichText from '#app/components/Helpers/RichText'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const metadata = {
	title: '🍪 Conhece a nossa política de cookies - Presentes e Prendas',
	description:
		'Normalmente não temos grande interesse neste tipo de cookies, mas neste caso temos de falar delas.',
}

export const meta: MetaFunction<typeof loader> = () => [
	...generateMetadata('politica-de-cookies', metadata),
	generateStructureddata(
		{
			breadcrumbs: [
				{ name: 'Política de Cookies', item: 'politica-de-cookies' },
			],
		},
		'politica-de-cookies',
		metadata,
	),
]

export const loader: LoaderFunction = async () => {
	const sbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
	}

	const { data } = await getStoryblokApi().get(
		`cdn/stories/pages/politica-de-cookies`,
		sbParams,
	)

	return json({
		data,
	})
}

export default function PerguntasFrequentes() {
	const { data } = useLoaderData<typeof loader>() as ISbStory
	const story = useStoryblokState(data.story)

	if (!story) {
		return null
	}

	return (
		<main className="mx-auto max-w-7xl px-6 pb-4 lg:px-8">
			<article className="mx-auto max-w-4xl">
				<h1 className="heading-medium">A nossa política de Cookies</h1>
				<dl>
					{story.content?.Conteudo.map(
						(
							item: SbBlokData & {
								Title: string
								Copy: StoryblokRichtext
							},
						) => (
							<div key={item._uid} className="mb-8">
								<dt className="heading-small">{item.Title}</dt>
								<dd className="mt-2 text-text-light [&>p]:mb-4 [&>ul>li]:mb-4">
									<RichText document={item.Copy} />
								</dd>
							</div>
						),
					)}
				</dl>
			</article>
		</main>
	)
}
