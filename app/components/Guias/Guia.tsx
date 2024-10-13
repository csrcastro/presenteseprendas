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
				<h1 className="font-serif mb-6 mt-6 text-2xl leading-8 text-colder sm:text-4xl lg:text-5xl">
					{blok.Title}
				</h1>
				{blok.Image && (
					<GuiaImage image={blok.Image} alt={blok.Title} title={blok.Title} />
				)}
				{publishedAt ? (
					<footer className="mb-4 text-sm text-text-light">
						<time dateTime={dayjs(firstPublishedAt).toISOString()}>
							{dayjs(firstPublishedAt).tz('Europe/Lisbon').format('DD')} de{' '}
							<span className="capitalize">
								{dayjs(firstPublishedAt).tz('Europe/Lisbon').format('MMM')}
							</span>{' '}
							{dayjs(firstPublishedAt).tz('Europe/Lisbon').format('YYYY')}
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
							{dayjs(publishedAt).tz('Europe/Lisbon').format('DD')} de{' '}
							<span className="capitalize">
								{dayjs(publishedAt).tz('Europe/Lisbon').format('MMM')}
							</span>{' '}
							{dayjs(publishedAt).tz('Europe/Lisbon').format('YYYY')}
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
							containerElement="div"
							id={blok.YoutubeID}
							adNetwork={true}
							poster="maxresdefault"
							title={blok.Title}
							noCookie={true}
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
						<h3 className="font-serif mb-8 text-3xl text-colder xl:text-4xl">
							Perguntas frequentes:
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
										<dt className="mb-2 font-serif text-xl text-cold">
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
						<h3 className="font-serif mb-8 text-3xl text-colder xl:text-4xl">
							Nota final:
						</h3>
						<RichContentGuia document={blok.Notar} />
					</div>
				) : null}
			</article>
		</div>
	)
}
