import {
	type LoaderFunction,
	type MetaArgs,
	type MetaFunction,
	json,
} from '@remix-run/node'
import { Link, useLoaderData, useLocation } from '@remix-run/react'
import {
	getStoryblokApi,
	type SbBlokData,
	useStoryblokState,
	type ISbStory,
} from '@storyblok/react'
import dayjs from 'dayjs'
import { Fragment, Suspense, lazy } from 'react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import Guias, { type IBlok as IBlokGuias } from '#app/components/Content/Guias'
import Image, { type IBlok as IBlokImage } from '#app/components/Content/Image'
import Text, { type IBlok as IBlokText } from '#app/components/Content/Text'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import config from '#app/config'
import generateMetadata from '#app/helpers/metadata'
import generateStructureddata from '#app/helpers/structureddata'

const {
	img: { format },
} = config

interface IBlok extends IBlokImage, IBlokText, IBlokGuias {
	_uid: string
}

const Error = lazy(() => import('#app/components/Errors/Route404Error'))

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
			resolve_relations: ['Content--Guias.Guias', 'Artigo SEO.Autor'],
		})
		.catch((_) => {
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

	const fl = data.story.content.Image.filename
	const metadata = {
		title: data.story.content.META_title,
		description: data.story.content.META_description,
		image: fl,
		type: 'article',
		author: data.story.content.Autor.content.Nome,
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
					{
						name: data.story.content.Title,
						item: data.story.full_slug.replace('/pages', ''),
					},
				],
				post: data.story,
				faq: data.story.content.PerguntasFrequentes,
			},
			data.story.full_slug.replace('/pages', ''),
			metadata,
		),
	]
}

export default function Pagina() {
	const { data } = useLoaderData<typeof loader>() as { data: ISbStory['data'] }
	const story = useStoryblokState(data.story)

	return (
		<main>
			<article>
				<div className="bg-rabanete pb-4 pt-24 sm:pb-96">
					<div className="mx-auto max-w-3xl px-6 lg:px-8">
						<h1 className="text-ameixa mb-16 text-left font-serif text-4xl sm:text-6xl">
							{story?.content.Title}
						</h1>
						<p className="text-pimenta mb-4 font-light italic sm:text-lg">
							{story?.content.Subtitle}
						</p>

						{story?.created_at ? (
							<footer className="mb-16 text-xs font-light tracking-tighter sm:text-sm">
								<address className="inline">
									<Link
										rel="author"
										to={`${ENV.BASE_URL}/${data.story.content.Autor.full_slug.replace(/\/$/, '')}`}
									>
										{data.story.content.Autor.content.Nome}
									</Link>
								</address>
								{', atualizado a '}
								<time dateTime={dayjs(story?.created_at).toISOString()}>
									{dayjs(story?.created_at).tz('Europe/Lisbon').format('DD')} de{' '}
									<span className="capitalize">
										{dayjs(story?.created_at).tz('Europe/Lisbon').format('MMM')}
									</span>{' '}
									{dayjs(story?.created_at).tz('Europe/Lisbon').format('YYYY')}
								</time>{' '}
							</footer>
						) : null}
					</div>
				</div>

				<div className="z-10 mx-auto mb-24 max-w-3xl sm:-mt-96">
					<img
						title={story?.content.Title}
						height="260"
						src={`${story?.content.Image?.filename}/m/390x260${format}`}
						sizes={`(min-width: 820px) 768px, calc(93.6vw + 19px)`}
						srcSet={`${story?.content.Image?.filename}/m/768x512${format} 768w, ${story?.content.Image?.filename}/m/390x260${format} 390w`}
						width="390"
						className="w-full"
					/>
				</div>
				{story?.content.Content.map((blok: IBlok) => {
					if (blok.component === 'Content--Text') {
						return (
							<div
								key={blok._uid}
								className="mx-auto mb-16 max-w-3xl px-6 lg:px-8"
							>
								<Text content={blok.Copy} />
							</div>
						)
					}
					if (blok.component === 'Content--Image') {
						return (
							<div key={blok._uid} className="mx-auto max-w-2xl px-6 lg:px-8">
								<Image blok={blok} />
							</div>
						)
					}
					if (blok.component === 'Content--Guias') {
						return (
							<div key={blok._uid} className="bg-inhame mb-24">
								<div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
									<Guias
										blok={blok}
										titleClasses="font-serif text-4xl text-ameixa py-16"
									/>
								</div>
							</div>
						)
					}
					return (
						<div key={blok._uid}>
							<p>{blok.component}</p>
							{/* {JSON.stringify(blok)} */}
							<br />
							<br />
						</div>
					)
				})}

				{story?.content.PerguntasFrequentes &&
				story.content.PerguntasFrequentes.length ? (
					<section className="bg-chila">
						<div className="mx-auto mb-16 max-w-3xl px-6 py-24 lg:px-8">
							<h2 className="text-couve my-16 font-serif text-4xl sm:text-5xl">
								Perguntas frequentes
							</h2>
							{story.content.PerguntasFrequentes.map(
								(
									nestedBlok: SbBlokData & {
										Titel: string
										Copy: StoryblokRichtext
									},
									index: number,
								) => (
									<Fragment key={`faq-${index}`}>
										<h3 className="mb-2 font-serif text-xl">
											{`${nestedBlok.Title}`}
										</h3>
										<Text content={nestedBlok.Copy} />
									</Fragment>
								),
							)}
						</div>
					</section>
				) : null}

				{story?.content.Conclusao && (
					<section>
						<div className="mx-auto mb-16 max-w-3xl px-6 lg:px-8">
							<Text content={story?.content.Conclusao} />
						</div>
					</section>
				)}
			</article>
		</main>
	)
}
