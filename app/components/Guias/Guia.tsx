import { Disclosure, DisclosureButton } from '@headlessui/react'
import { Link } from '@remix-run/react'
import {
	type ISbStoryData,
	type SbBlokData,
	storyblokEditable,
} from '@storyblok/react'
import dayjs from 'dayjs'
import { lazy, Suspense, Fragment } from 'react'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichContent from '../Helpers/RichContent'
import RichContentGuia from '../Helpers/RichContentGuia'
import MonetizedMobileBannerTemu from '../Monetize/MonetizedMobileBannerTemu'
import GuiaImage from './GuiaImage'

const MonetizedMobileBannerOne = lazy(
	() => import('../Monetize/MonetizedMobileBannerOne.js'),
)
const MonetizedMobileBannerTwo = lazy(
	() => import('../Monetize/MonetizedMobileBannerTwo.js'),
)

const Presentes = lazy(() => import('./Presentes'))

const Share = lazy(() => import('../Share'))

export default function Guia({
	blok,
	autor,
	publishedAt,
	firstPublishedAt,
}: {
	blok: ISbStoryData['content']
	autor: ISbStoryData
	publishedAt: string
	firstPublishedAt: string
}) {
	return (
		<div {...storyblokEditable(blok)} key={blok._uid}>
			<article>
				<h1 className="font-heading mb-6 mt-6 text-2xl leading-8 text-colder sm:text-3xl lg:text-4xl">
					{blok.Title}
				</h1>
				{blok.Image && (
					<GuiaImage image={blok.Image} alt={blok.Title} title={blok.Title} />
				)}
				{publishedAt ? (
					<footer className="mb-4 text-sm text-text-light">
						<time dateTime={dayjs(firstPublishedAt).toISOString()}>
							{dayjs(firstPublishedAt).format('DD')} de{' '}
							<span className="capitalize">
								{dayjs(firstPublishedAt).format('MMM')}
							</span>{' '}
							{dayjs(firstPublishedAt).format('YYYY')}
						</time>{' '}
						por{' '}
						<address className="inline">
							<Link
								rel="author"
								to={`${ENV.BASE_URL}/${autor.full_slug.replace(/\/$/, '')}`}
							>
								{autor.content.Nome}
							</Link>
						</address>
						{', atualizado a '}
						<time dateTime={dayjs(publishedAt).toISOString()}>
							{dayjs(publishedAt).format('DD')} de{' '}
							<span className="capitalize">
								{dayjs(publishedAt).format('MMM')}
							</span>{' '}
							{dayjs(publishedAt).format('YYYY')}
						</time>{' '}
					</footer>
				) : null}

				{blok.Subtitle && !blok.V2_Intro ? (
					<p className="mb-4 text-base">
						<RichContent document={blok.Subtitle} />
					</p>
				) : (
					<div className="relative mb-48">
						<p className="mb-6">{blok.V2_Intro}</p>

						<Disclosure key={`${blok._uid}-content`}>
							{({ open }) => (
								<>
									{open ? null : (
										<>
											<div className="absolute -bottom-24 z-10 flex w-full items-center justify-center">
												<DisclosureButton className="btn-medium btn-lermais bg-warm text-white hover:bg-warmer">
													Continuar a ler
												</DisclosureButton>
											</div>
											<div className="absolute bottom-0 block h-12 w-full bg-gradient-to-b from-background/0 to-background" />
										</>
									)}

									<Disclosure.Panel as="div" unmount={false}>
										<RichContentGuia document={blok.V2_Content} />
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					</div>
				)}

				<aside className="col-span-2 md:hidden">
					<MonetizedMobileBannerTemu />
				</aside>

				{!!blok.YoutubeID && blok.YoutubeDate && (
					<div>
						<h2 className="sr-only">Vídeo:</h2>
						<LiteYouTubeEmbed
							id={blok.YoutubeID} // Default none, id of the video or playlist
							adNetwork={true} // Default true, to preconnect or not to doubleclick addresses called by YouTube iframe (the adnetwork from Google)
							poster="maxresdefault" // Defines the image size to call on first render as poster image. Possible values are "default","mqdefault",  "hqdefault", "sddefault" and "maxresdefault". Default value for this prop is "hqdefault". Please be aware that "sddefault" and "maxresdefault", high resolution images are not always avaialble for every video. See: https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
							title={blok.Title} // a11y, always provide a title for iFrames: https://dequeuniversity.com/tips/provide-iframe-titles Help the web be accessible ;)
							noCookie={true} // Default false, connect to YouTube via the Privacy-Enhanced Mode using https://www.youtube-nocookie.com
						/>
					</div>
				)}

				<aside>
					<Suspense fallback={null}>
						<MonetizedMobileBannerOne />
					</Suspense>
				</aside>

				<Suspense fallback={null}>
					<Presentes presentes={blok.Presentes} />
				</Suspense>
				<aside>
					<Suspense fallback={null}>
						<MonetizedMobileBannerTwo />
					</Suspense>
				</aside>
				<aside className="mb-8 rounded bg-warm/5 px-4 py-4 text-xs italic text-text-light">
					{
						'Esperamos que gostes das nossas sugestões, elas foram selecionadas independentemente pelos nossos autores. Poderemos receber uma parte das vendas e/ou outros tipos de compensação através das ligações nesta página.'
					}
				</aside>
				<Suspense fallback={<div className="mb-4 h-12" />}>
					<div className="my-8 h-12">
						<Share image={blok.Image.filename} />
					</div>
				</Suspense>
				{blok.PerguntasFrequentes && blok.PerguntasFrequentes.length ? (
					<div className="mb-12 mt-8">
						<h3 className="font-heading mb-8 text-2xl text-colder">
							Perguntas e respostas:
						</h3>
						<dl>
							{blok.PerguntasFrequentes.map(
								(
									nestedBlok: SbBlokData & {
										Titel: string
										Copy: StoryblokRichtext
									},
									index: number,
								) => (
									<Fragment key={`faq-${index}`}>
										<dt className="mb-2 font-black text-cold">
											{`${nestedBlok.Title}`}
										</dt>
										<dd>
											<RichContentGuia document={nestedBlok.Copy} />
										</dd>
									</Fragment>
								),
							)}
						</dl>
					</div>
				) : null}
				{blok.Notar &&
				blok.Notar.content[0] &&
				blok.Notar.content[0].content ? (
					<div className="mb-12 mt-8">
						<h3 className="font-heading mb-8 text-2xl text-colder">
							Post scriptum:
						</h3>
						<RichContentGuia document={blok.Notar} />
					</div>
				) : null}
			</article>
		</div>
	)
}
