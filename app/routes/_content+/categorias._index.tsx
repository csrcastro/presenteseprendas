import { type LoaderFunction, type MetaFunction, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
	type ISbStoriesParams,
	getStoryblokApi,
	type ISbStoryData,
} from '@storyblok/react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const {
	img: { format },
} = config

export const loader: LoaderFunction = async () => {
	const sbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
		starts_with: 'categorias',
	}

	const { data } = await getStoryblokApi().get(`cdn/stories`, {
		...sbParams,
	})

	return json(data?.stories)
}

const metadata = {
	title: `As melhores categorias e ideias de presentes e prendas`,
	description: `Usa as nossas categorias para descobrir novas ideias de presentes e ficar a par das últimas promoções`,
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const { stories } = data as {
		stories: ISbStoryData[]
	}
	return [
		...generateMetadata('categorias', metadata),
		generateStructureddata(
			{
				breadcrumbs: [{ name: 'Categorias', item: 'categorias' }],
				collection: {
					url: 'categorias',
					name: 'Categorias',
					description:
						'Descobre as categorias do Presentes e Prendas, de certeza que vais encontrar uma preferida.',
					stories,
				},
			},
			'categorias',
			metadata,
		),
	]
}

export default function Page() {
	const stories = useLoaderData<typeof loader>() as ISbStoryData[]

	return (
		<main className="mx-auto max-w-7xl px-6 text-center lg:px-8">
			<div className="mx-auto max-w-2xl">
				<h1 className="heading-large">Categorias</h1>
				<p>
					Olá, nós somos os autores do presenteseprendas.pt. É das nossas
					cabeças que saem todas estas maravilhosas ideias que te vão ajudar com
					o processo de oferecer algo a alguém. Temos montes de ideias para ti e
					ainda óptimas promoções que queremos partilhar contigo!
				</p>
			</div>
			<AsteriskDividerShadow className="mx-auto mb-6 mt-12 h-8 fill-warm" />
			<section>
				<h2 className="sr-only">Lista de Categorias</h2>
				<ul className="mx-auto mt-20 grid grid-cols-2 gap-x-8 gap-y-16 pb-16 text-center sm:grid-cols-3 md:grid-cols-3 lg:mx-0">
					{stories.map((story: ISbStoryData) => (
						<li
							key={story.uuid}
							className="relative overflow-hidden rounded-lg bg-white shadow"
						>
							<figure>
								<div className="relative mx-auto w-full overflow-hidden pb-[56.25%]">
									<img
										alt={story?.content?.Title}
										className="absolute left-1/2 top-1/2 h-auto w-full -translate-x-1/2 -translate-y-1/2 transform"
										src={`${story?.content?.Image?.filename}/m/384x0${format}`}
									/>
								</div>
								<figcaption className="px-2 py-4">
									<Link
										to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
										className="font-heading mb-2 block text-lg font-bold leading-7 tracking-tight"
									>
										<span aria-hidden="true" className="absi-0" />
										{story.content.Title}
									</Link>
									<p className="mb-4 text-sm font-bold leading-4 tracking-tight">
										{story?.content?.SeoTitle}
									</p>
									<p className="text-xs">{story?.content?.SeoDescription}</p>
								</figcaption>
							</figure>
						</li>
					))}
				</ul>
			</section>
		</main>
	)
}
