import { type SbBlokData } from '@storyblok/react'
import { lazy, Suspense } from 'react'
import { type StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import RichContent from './Helpers/RichContent'

const RichParagraphsOnly = lazy(() => import('./Helpers/RichParagraphsOnly'))

export interface ISobreNos extends SbBlokData {
	IntroTitle: string
	Intro: StoryblokRichtext
	EquipaTitle: string
	EquipaIntro: StoryblokRichtext
	Adultos: {
		Avatar: {
			filename: string
		}
		Name: string
		Bio: StoryblokRichtext
	}[]
	CriancasTitle: string
	Criancas: {
		Avatar: {
			filename: string
		}
		Name: string
		Bio: StoryblokRichtext
	}[]
	ValuesTitle: string
	Values: {
		Title: string
		Copy: StoryblokRichtext
	}[]
}

export default function SobreNos({ blok }: { blok?: ISobreNos }) {
	if (!blok) return null

	return (
		<main>
			<article>
				<div className="mx-auto max-w-3xl px-6 lg:px-8">
					<div className="mx-auto [&>p:last-child]:mb-0 [&>p]:mb-2">
						<h1 className="heading-large">{blok.IntroTitle}</h1>
						<RichParagraphsOnly className={''} document={blok.Intro} />
					</div>
				</div>
				<div className="mx-auto max-w-3xl px-6 lg:px-8">
					<div className="mx-auto [&>p:last-child]:mb-0 [&>p]:mb-2">
						<h2 className="heading-large text-cold">{blok?.EquipaTitle}</h2>
						<RichParagraphsOnly className={''} document={blok.EquipaIntro} />
					</div>

					<h3 className="heading-medium text-cold">Os Adultos</h3>
					<ul className="mx-auto grid gap-x-8 gap-y-16 xs:grid-cols-2">
						{blok.Adultos.map(person => (
							<li
								key={person.Name}
								className="[&>p:last-child]:mb-0 [&>p]:mb-4 [&>p]:text-sm [&>p]:text-text-light"
							>
								<img
									alt={person.Name}
									className="mx-auto h-36 w-36 rounded-full ring-4 ring-cold"
									src={person?.Avatar?.filename}
								/>
								<h3 className="mt-6 text-base font-bold leading-7">
									{person?.Name}
								</h3>
								<Suspense fallback={null}>
									<RichParagraphsOnly className={''} document={person?.Bio} />
								</Suspense>
							</li>
						))}
					</ul>
					<h3 className="heading-medium text-warm">A Pequenada</h3>
					<ul className="mx-auto grid gap-x-8 gap-y-16 xs:grid-cols-2 md:grid-cols-4">
						{blok.Criancas.map(person => (
							<li key={person.Name}>
								<img
									alt={person.Name}
									className="mx-auto h-24 w-24 rounded-full ring-4 ring-warm"
									src={person?.Avatar?.filename}
								/>
								<h3 className="mt-6 text-base font-bold leading-7">
									{person?.Name}
								</h3>
								<p className="text-sm leading-6 text-text-light">
									<RichContent document={person?.Bio} />
								</p>
							</li>
						))}
					</ul>
				</div>
				<div className="mx-auto mb-16 max-w-7xl px-6 lg:px-8">
					<h2 className="heading-large text-warm">{blok.ValuesTitle}</h2>
					<dl className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 md:grid-cols-3 lg:mx-0">
						{blok.Values.map(value => (
							<div key={value.Title}>
								<dt className="heading small text-warm">{value.Title}</dt>
								<dd className="text-sm">
									<RichContent document={value.Copy} />
								</dd>
							</div>
						))}
					</dl>
				</div>
			</article>
		</main>
	)
}
