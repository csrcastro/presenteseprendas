import { type ISbStoryData, type SbBlokData } from '@storyblok/react'
import { lazy, Suspense } from 'react'

const PresentesGrid = lazy(() => import('#app/components/Guias/PresentesGrid'))

export interface IBlok extends SbBlokData {
	Guias: ISbStoryData[]
	Title: string
}

export default function Guias({ blok }: { blok: IBlok }) {
	if (!blok.Guias) return null

	if (blok.Guias.length === 0) return null

	return (
		<section className="pb-8 text-center">
			<h3 className="heading-large pt-0 text-colder">{blok.Title}</h3>
			<Suspense
				fallback={<p className="pb-20 text-center">{'A carregar conteúdos'}</p>}
			>
				<PresentesGrid ideias={blok.Guias} alt={true} />
			</Suspense>
		</section>
	)
}
