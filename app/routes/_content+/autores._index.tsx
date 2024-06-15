import  { type LoaderFunction, type MetaFunction , json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import  { type ISbStoriesParams, type ISbStoryData , getStoryblokApi } from '@storyblok/react'
import AsteriskDividerShadow from '#app/components/Assets/Dividers/AsteriskDividerShadow'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

export const loader: LoaderFunction = async () => {
	const sbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
		starts_with: 'autores',
	}

	const { data } = await getStoryblokApi().get(`cdn/stories`, {
		...sbParams,
	})

	return json(data?.stories)
}

const metadata = {
	title: `Presentes e Prendas: Conhece os nossos autores`,
	description: `Esta é a equipa de autores do presenteseprendas.pt, incansáveis a 
  proporcionar-te guias de presentes surpreendentes e promoções aliciantes`,
}

export const meta: MetaFunction<typeof loader> = () => [
	...generateMetadata('autores', metadata),
	generateStructureddata(
		{
			breadcrumbs: [{ name: 'Autores', item: 'autores' }],
		},
		'autores',
		metadata,
	),
]

export default function Page() {
	const stories = useLoaderData<typeof loader>() as ISbStoryData[]

	return (
		<main className="relative isolate overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
			>
				<div
					className="aspect-[1] w-[82.375rem] flex-none bg-gradient-to-r from-[#ff5c35] to-[#E83025] opacity-25"
					style={{
						clipPath: `polygon(1% 41%, 21% 31%, 39% 42%, 61% 26%, 71% 44%, 99% 26%, 78% 70%,
                 58% 52%, 40% 66%, 26% 51%, 8% 62%)`,
					}}
				/>
			</div>
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-xl">
					<h1 className="heading-large text-warm">Autores</h1>
					<p>
						Olá, nós somos os autores da Presentes e Prendas. É das nossas
						cabeças e da nossa pesquisa que saem todas estas maravilhosas ideias
						que te vão inspirar no processo de oferecer algo a alguém ou a ti
						próprio. Temos montes de ideias para ti e ainda promoções que
						queremos partilhar contigo!
					</p>
				</div>
				<AsteriskDividerShadow className="mx-auto my-8 h-8 fill-warm" />

				<ul className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
					{stories.map(story => (
						<li
							key={story.uuid}
							className="group flex transform cursor-pointer flex-col items-center rounded-xl bg-white/40 p-8 transition-colors duration-300 hover:bg-warm"
						>
							<Link
								className="text-center"
								to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
							>
								<img
									alt={story?.content.Nome}
									className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-warm/75"
									src={story?.content?.Foto?.filename}
								/>

								<h2 className="font-heading mt-4 text-xl capitalize">
									{story?.content.Nome}
								</h2>

								<p className="mt-2 text-sm leading-snug">
									{story?.content.ShortBio}
								</p>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
	)
}
