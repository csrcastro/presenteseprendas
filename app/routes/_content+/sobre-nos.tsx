import { type LoaderFunction, type MetaFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	type ISbStoriesParams,
	getStoryblokApi,
	useStoryblokState,
	type ISbStoryData,
} from '@storyblok/react'
import SobreNos, { type ISobreNos } from '#app/components/SobreNos'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const metadata = {
	title: 'Sobre nós: quem somos e porque o fazemos - Presentes e Prendas',
	description:
		'Fica a saber tudo sobre esta plataforma, como tudo começou, quem é a equipa e quais nossos valores',
}

export const meta: MetaFunction<typeof loader> = () => [
	...generateMetadata('sobre-nos', metadata),
	generateStructureddata(
		{
			breadcrumbs: [{ name: 'Sobre nós', item: 'sobre-nos' }],
		},
		'sobre-nos',
		metadata,
	),
]

export const loader: LoaderFunction = async () => {
	const sbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
	}

	const { data } = await getStoryblokApi().get(`cdn/stories/pages/sobre-nos`, {
		...sbParams,
	})

	return json(data)
}

export default function Page() {
	const { story } = useLoaderData<typeof loader>() as {
		story: ISbStoryData<ISobreNos>
	}

	const blok: ISbStoryData<ISobreNos> | null = useStoryblokState(story)

	return <SobreNos blok={blok?.content} />
}
