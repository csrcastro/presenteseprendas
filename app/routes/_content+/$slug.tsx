import {
	type LoaderFunction,
	type MetaArgs,
	type MetaFunction,
	json,
} from '@remix-run/node'
import { useLoaderData, useLocation } from '@remix-run/react'
import {
	getStoryblokApi,
	useStoryblokState,
	type ISbStory,
} from '@storyblok/react'
import { Suspense, lazy } from 'react'
import Guias, { type IBlok as IBlokGuias } from '#app/components/Content/Guias'
import Image, { type IBlok as IBlokImage } from '#app/components/Content/Image'
import Text, { type IBlok as IBlokText } from '#app/components/Content/Text'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
// import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'

interface IBlok extends IBlokImage, IBlokText, IBlokGuias {
	id: string
}

const Error = lazy(() => import('#app/components/Errors/Route404Error'))

// const {
// 	img: { format },
// 	sb: { listParams },
// } = config

// async function storiesService(start: string, autor: string, page = 1) {
//   return await getStoryblokApi().get(`cdn/stories`, {
//     ...listParams,
//     starts_with: start,
//     is_startpage: false,
//     version: ENV.STORYBLOK_EXPLORE,
//     page,
//     filter_query: {
//       Autor: { in: autor },
//     },
//   });
// }

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
	const { data } = await getStoryblokApi()
		.get(`cdn/stories/pages/${slug}`, {
			version: ENV.STORYBLOK_EXPLORE,
			resolve_relations: ['Content--Guias.Guias'],
		})
		.catch(_ => {
			return { data: null }
		})

	if (!data) {
		throw new Response('Not Found', { status: 404 })
	}

	return json({ data })
}

export const meta: MetaFunction<typeof loader> = ({
	data: loaderData,
}: MetaArgs) => {
	if (!loaderData) return []

	const { data } = loaderData as { data: ISbStory['data'] }
	const metadata = {
		title: `${data.story.content.META_Title}: autor(a) na Presentes e Prendas`,
		description: data.story.content.META_Description,
	}
	return [
		...generateMetadata(data.story.full_slug, metadata),
		// generateStructureddata(
		//   {
		//     breadcrumbs: [
		//       { name: "Autores", item: "autores" },
		//       { name: data.story.content.Nome, item: data.story.full_slug },
		//     ],
		//   },
		//   data.story.full_slug,
		//   metadata,
		// ),
	]
}

export default function Pagina() {
	const { data } = useLoaderData<typeof loader>() as { data: ISbStory['data'] }
	const story = useStoryblokState(data.story)

	return (
		<main>
			<article>
				<div className="mx-auto max-w-3xl text-colder">
					<h1 className="font-heading mb-16 mt-16 text-center text-5xl uppercase leading-tight text-cold">
						{story?.content.Title}
					</h1>
					{story?.content.Content.map((blok: IBlok) => {
						if (blok.component === 'Content--Text') {
							return <Text key={blok.id} blok={blok} />
						}
						if (blok.component === 'Content--Image') {
							return <Image key={blok.id} blok={blok} />
						}
						if (blok.component === 'Content--Guias') {
							return <Guias key={blok.id} blok={blok} />
						}
						return (
							<div key={blok.id}>
								<p>{blok.component}</p>
								{JSON.stringify(blok)}
								<br />
								<br />
							</div>
						)
					})}
				</div>
			</article>
		</main>
	)
}
