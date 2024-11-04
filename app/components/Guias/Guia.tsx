import { Link } from '@remix-run/react'
import {
	type ISbStoryData,
	type SbBlokData,
	storyblokEditable,
} from '@storyblok/react'
import dayjs from 'dayjs'
import { lazy, Suspense, Fragment } from 'react'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichContent from '../Helpers/RichContent'
import RichContentGuia from '../Helpers/RichContentGuia'
import GuiaImage from './GuiaImage'

const Presentes = lazy(() => import('./Presentes'))

const Share = lazy(() => import('../Share'))

export default function Guia({
	blok,
	autor,
	publishedAt,
}: {
	blok: ISbStoryData['content']
	autor: ISbStoryData
	publishedAt: string
}) {
	return (
		<article {...storyblokEditable(blok)} key={blok._uid}>
			<h1 className="my-8 font-serif text-2xl leading-tight text-colder sm:my-12 sm:text-5xl sm:leading-tight lg:my-16">
				{blok.Title}
			</h1>
			{blok.Image && (
				<GuiaImage image={blok.Image} alt={blok.Title} title={blok.Title} />
			)}
			{publishedAt ? (
				<footer className="mb-8 text-xs tracking-tighter text-text-light sm:text-sm">
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
				<>
					<p className="mb-4 text-base">
						<RichContent document={blok.Subtitle} />
					</p>
					<Suspense fallback={<div className="mb-4 h-12" />}>
						<div className="my-8 h-12">
							<Share image={blok.Image.filename} />
						</div>
					</Suspense>
				</>
			) : (
				<div className="relative mb-6">
					<p>{blok.V2_Intro}</p>
					{!!blok.YoutubeID && blok.YoutubeDate && (
						<div className="mt-12">
							<h2 className="my-16 font-serif text-2xl text-colder sm:text-5xl">{`Ideias de presente em vídeo`}</h2>
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

					<Suspense fallback={<div className="mb-4 h-12" />}>
						<div className="my-8 h-12">
							<Share image={blok.Image.filename} />
						</div>
					</Suspense>
					<div className="mt-12 text-center">
						<a
							className="btn-medium bg-warm text-sm font-black uppercase text-white hover:bg-warmer md:text-lg"
							href="#ideias-de-presente"
						>
							Saltar para as ideias de presente
						</a>
					</div>
					<span className="p-separator my-12">
						<span className="p-separator-break" />
					</span>

					<RichContentGuia document={blok.V2_Content} />
				</div>
			)}

			<Suspense fallback={null}>
				<Presentes presentes={blok.Presentes} />
			</Suspense>

			<aside className="mb-8 rounded bg-warm/5 px-4 py-4 text-xs italic text-text-light">
				{
					'Esperamos que gostes das nossas sugestões, elas foram selecionadas independentemente pelos nossos autores. Poderemos receber uma parte das vendas e/ou outros tipos de compensação através das ligações nesta página.'
				}
			</aside>

			{blok.PerguntasFrequentes && blok.PerguntasFrequentes.length ? (
				<section>
					<h2 className="my-16 font-serif text-4xl text-colder sm:text-5xl">
						Perguntas frequentes
					</h2>
					{blok.PerguntasFrequentes.map(
						(
							nestedBlok: SbBlokData & {
								Titel: string
								Copy: StoryblokRichtext
							},
							index: number,
						) => (
							<Fragment key={`faq-${index}`}>
								<h3 className="mb-2 font-serif text-xl text-cold">
									{`${nestedBlok.Title}`}
								</h3>
								<RichContentGuia document={nestedBlok.Copy} />
							</Fragment>
						),
					)}
				</section>
			) : null}
			{blok.Notar && blok.Notar.content[0] && blok.Notar.content[0].content ? (
				<section>
					<h2 className="my-16 font-serif text-4xl text-colder sm:text-5xl">
						Nota final
					</h2>
					<RichContentGuia document={blok.Notar} />
				</section>
			) : null}
		</article>
	)
}
