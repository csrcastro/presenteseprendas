import { type LoaderFunction, type MetaFunction, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
	type ISbStoriesParams,
	type ISbStoryData,
	getStoryblokApi,
} from '@storyblok/react'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

export const loader: LoaderFunction = async () => {
	const sbParams: ISbStoriesParams = {
		version: ENV.STORYBLOK_EXPLORE,
		starts_with: 'lojas',
	}

	const { data } = await getStoryblokApi().get(`cdn/stories`, {
		...sbParams,
	})

	return json(data?.stories)
}

const metadata = {
	title: 'Presentes e Prendas: As nossas lojas favoritas',
	description:
		'Fica a conhecer as nossas lojas favoritas, onde encontramos os mais originais e práticos presentes.',
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
	const stories = loaderData as ISbStoryData[]
	return [
		...generateMetadata('lojas', metadata),
		generateStructureddata(
			{
				breadcrumbs: [{ name: 'Lojas', item: 'lojas' }],
				collection: {
					url: 'lojas',
					name: 'Lojas',
					description: 'As Lojas favoritas da Presentes e Prendas.',
					stories,
				},
			},
			'lojas',
			metadata,
		),
	]
}
export default function Page() {
	const stories = useLoaderData<typeof loader>() as ISbStoryData[]

	return (
		<main className="relative isolate overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -top-80 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
			>
				<div
					className="aspect-[1] w-[82.375rem] flex-none bg-gradient-to-r from-white to-cold opacity-50"
					style={{
						clipPath:
							'polygon(1% 41%, 21% 31%, 39% 42%, 61% 26%, 71% 44%, 99% 26%, 78% 70%, 58% 52%, 40% 66%, 26% 51%, 8% 62%)',
					}}
				/>
			</div>
			<div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
				<div className="mx-auto mb-48 max-w-2xl">
					<h1 className="heading-large text-colder">Lojas</h1>
					<p>
						Estas são as nossas lojas favoritas, são aquelas que encaixam no
						nossos estilo de vida e que recorremos mais quando é altura de
						pensar em presentes ou prendas. Desde a gigante Amazon com seu
						infindável catálogo e entregas em dois dias, até à meça do desporto
						que é a Decathlon vamos procurando sugestões de valor e promoções
						que não vai querer perder.
					</p>
				</div>
			</div>
			{/* <AsteriskDividerShadow className="h-6 w-auto fill-warm mb-6 mx-auto mt-12" /> */}
			<section className="relative bg-cold">
				<div className="container mx-auto px-6 py-10">
					<ul className="-mt-32 grid grid-cols-1 gap-24 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-16">
						{stories.map((story: ISbStoryData) => (
							<li
								key={story.uuid}
								className="shadow-col relative mb-8 flex flex-col items-center rounded-xl bg-white p-6 text-center shadow"
							>
								<Link
									className="mx-auto -mt-16 h-24 w-24 grow-0 rounded shadow"
									to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
								>
									<img
										alt={story.content.Title}
										className="h-auto w-full rounded"
										src={story.content.Image.filename}
									/>
								</Link>

								<h2 className="font-heading mt-12 grow-0 text-xl">
									{story.content.Title}
								</h2>
								<p className="mt-6 grow">{story?.content?.ShortBio}</p>
								<Link
									className="mt-12 block grow-0 text-xs font-bold uppercase hover:text-colder"
									to={`${ENV.BASE_URL}/${story.full_slug.replace(/\/$/, '')}`}
								>
									descobre mais sobre a {story.content.Title} aqui
								</Link>
							</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	)
}
